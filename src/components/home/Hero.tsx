import { useCallback, useEffect, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import useTurnstile from "@/hooks/useTurnstile";
import useRetellCall, { WebCallError } from "@/hooks/useRetellCall";
import LiveCallBar from "@/components/home/LiveCallBar";
import { supabase } from "@/lib/supabase";
import { SCENARIOS } from "@/lib/scenarios";

const SCENARIO_COUNT = SCENARIOS.length;

/** Slice `str` given the typewriter has typed `avail` chars overall and this
    string starts at offset `from` in the scenario's combined text. */
const cut = (str: string, from: number, avail: number) => {
  const take = Math.max(0, Math.min(str.length, avail - from));
  return str.slice(0, take);
};

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const [{ scIdx, charN }, setTw] = useState({ scIdx: 0, charN: 0 });
  const { containerRef, token, reset, failed: turnstileFailed } = useTurnstile();
  // Turnstile blocked/timed out, or Supabase env vars missing — either way the
  // demo can't run, so say so instead of leaving a forever-disabled button.
  const demoUnavailable = turnstileFailed || !supabase;

  // useRetellCall runs this after the mic preflight passes; it exchanges the
  // Turnstile token for a single-use Retell access token.
  const createWebCall = useCallback(async () => {
    if (!supabase || !token) throw new WebCallError("connect_failed");
    try {
      const { data, error } = await supabase.functions.invoke("create-retell-web-call", {
        body: { turnstile_token: token },
      });
      if (error) {
        console.error("create-retell-web-call failed", error);
        // FunctionsHttpError carries the Response; 429 is the per-IP demo cap.
        const status = (error as { context?: { status?: number } }).context?.status;
        throw new WebCallError(status === 429 ? "rate_limited" : "connect_failed");
      }
      if (!data?.ok || typeof data?.access_token !== "string") {
        console.error("create-retell-web-call bad payload", data);
        throw new WebCallError("connect_failed");
      }
      return data.access_token;
    } finally {
      reset(); // Turnstile tokens are single-use; re-arm for the next click.
    }
  }, [token, reset]);

  const { status, errorKind, elapsedSec, endedAtLimit, agentTalking, start, hangUp } =
    useRetellCall(createWebCall);
  const callBusy = status === "connecting" || status === "live";

  const onTalkToLauren = () => {
    // Button is disabled until Turnstile hands over a token, so this guard
    // only catches races (e.g. token expiring mid-click).
    if (!supabase || !token || callBusy) return;
    void start();
  };

  useEffect(() => {
    if (reducedMotion) return;
    // Typewriter: advance chars; when scenario fully typed, hold, then next scenario.
    const id = window.setInterval(() => {
      setTw((s) => {
        const sc = SCENARIOS[s.scIdx % SCENARIO_COUNT];
        const total = sc.t1.length + sc.tc.length + sc.t2.length;
        if (s.charN >= total + 120) {
          return { scIdx: (s.scIdx + 1) % SCENARIO_COUNT, charN: 0 };
        }
        return { ...s, charN: s.charN + 2 };
      });
    }, 50);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const sc = SCENARIOS[scIdx % SCENARIO_COUNT];
  const n = reducedMotion ? Infinity : charN;
  const t1 = cut(sc.t1, 0, n);
  const tc = cut(sc.tc, sc.t1.length, n);
  const t2 = cut(sc.t2, sc.t1.length + sc.tc.length, n);

  return (
    <header className="container hero">
      <div>
        <h1>The phone rings.<br />You're on the tools.</h1>
        <p className="hero__sub">Lauren answers when you're on the tools, takes the job down properly, then texts and emails you the lead — before the caller rings the next number on the list.</p>
        <div className="hero__ctas">
          <button
            className="btn btn--lg"
            id="talk-to-lauren"
            type="button"
            disabled={demoUnavailable || !token || callBusy}
            onClick={onTalkToLauren}
          >
            {status === "connecting" ? "Connecting…" : status === "live" ? "Live with Lauren" : "Talk to Lauren"}
          </button>
          {/* TODO: wire the sample-call audio when the recording exists.
              Until then it's decorative — hidden from AT, dimmed, badged. */}
          <div className="audio-chip audio-chip--soon" aria-hidden="true">
            <div className="audio-chip__play"><span /></div>
            <div className="audio-chip__body">
              <div className="audio-chip__title">Hear a real call<span className="audio-chip__badge">Coming soon</span></div>
              <div className="audio-chip__row">
                <div className="audio-chip__track"><div className="audio-chip__progress" /></div>
                <span className="audio-chip__time">0:38</span>
              </div>
            </div>
          </div>
        </div>
        {/* Managed mode: stays empty for most visitors; Cloudflare expands a
            challenge here only for high-risk traffic. */}
        <div className="hero__turnstile" ref={containerRef} />
        {demoUnavailable ? (
          <p className="hero__note" role="status">
            Demo temporarily unavailable — email <a href="mailto:hello@myreception.com.au">hello@myreception.com.au</a> to book a call.
          </p>
        ) : status === "idle" ? (
          <p className="hero__note">
            Live demo — ask her if she's human; she'll tell you straight.
            <br />
            This connects your mic to a real AI call — nothing is saved.
          </p>
        ) : (
          <LiveCallBar
            status={status}
            errorKind={errorKind}
            elapsedSec={elapsedSec}
            endedAtLimit={endedAtLimit}
            agentTalking={agentTalking}
            onHangUp={hangUp}
          />
        )}
      </div>
      <div className="call-panel">
        <div className="call-panel__head">
          <span className="call-panel__label">Live call · {sc.trade}</span>
          <span className="call-panel__pill">{sc.name} answering</span>
        </div>
        <div className="call-panel__body">
          <div className="bubble">
            <div className="bubble__who">{sc.name}</div>
            <div className="bubble__text">{t1}</div>
          </div>
          <div className="bubble bubble--caller">
            <div className="bubble__who">Caller</div>
            <div className="bubble__text">{tc}</div>
          </div>
          <div className="bubble">
            <div className="bubble__who">{sc.name}</div>
            <div className="bubble__text">{t2}</div>
          </div>
          <div className="call-panel__foot">
            <span className="call-panel__foot-note">Lead texted and emailed moments after hang-up — name, number, address, the job.</span>
            <span className="call-panel__count">{(scIdx % SCENARIO_COUNT) + 1} / {SCENARIO_COUNT}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
