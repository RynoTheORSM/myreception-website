import { useEffect, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import useTurnstile from "@/hooks/useTurnstile";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { SCENARIOS } from "@/lib/scenarios";

const TOAST_MS = 6000;
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
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState<{ message: string; detail: string } | null>(null);
  // Bumped on every submit so a re-submit restarts the auto-dismiss timer.
  const [toastKey, setToastKey] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(id);
  }, [toast, toastKey]);

  const showToast = (message: string, detail: string) => {
    setToast({ message, detail });
    setToastKey((k) => k + 1);
  };

  const onTalkToLauren = async () => {
    // Button is disabled until Turnstile hands over a token, so this guard
    // only catches races (e.g. token expiring mid-click).
    if (!supabase || !token || connecting) return;
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-retell-web-call", {
        body: { turnstile_token: token },
      });
      if (error || !data?.ok) {
        console.error("create-retell-web-call failed", error ?? data);
        showToast("Couldn't start the demo.", "Give it another go in a moment.");
        return;
      }
      // TODO(demo voice call): data.access_token is what the next task consumes —
      // start the browser voice session with retell-client-js-sdk here.
      if (import.meta.env.DEV) console.log("create-retell-web-call ok", data);
      showToast("Verified.", "Live demo calling is launching soon — email hello@myreception.com.au to hear Lauren now.");
    } finally {
      setConnecting(false);
      reset(); // Turnstile tokens are single-use; re-arm for the next click.
    }
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
            disabled={demoUnavailable || !token || connecting}
            onClick={onTalkToLauren}
          >
            {connecting ? "Connecting…" : "Talk to Lauren"}
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
        ) : (
          <p className="hero__note">Live demo — ask her if she's human; she'll tell you straight.</p>
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
      {toast && (
        <Toast
          key={toastKey}
          message={toast.message}
          detail={toast.detail}
          onDismiss={() => setToast(null)}
        />
      )}
    </header>
  );
};

export default Hero;
