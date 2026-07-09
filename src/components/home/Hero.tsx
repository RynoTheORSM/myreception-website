import { useEffect, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { SCENARIOS } from "@/lib/scenarios";

/** Slice `str` given the typewriter has typed `avail` chars overall and this
    string starts at offset `from` in the scenario's combined text. */
const cut = (str: string, from: number, avail: number) => {
  const take = Math.max(0, Math.min(str.length, avail - from));
  return str.slice(0, take);
};

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const [{ scIdx, charN }, setTw] = useState({ scIdx: 0, charN: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    // Typewriter: advance chars; when scenario fully typed, hold, then next scenario.
    const id = window.setInterval(() => {
      setTw((s) => {
        const sc = SCENARIOS[s.scIdx % 4];
        const total = sc.t1.length + sc.tc.length + sc.t2.length;
        if (s.charN >= total + 120) {
          return { scIdx: (s.scIdx + 1) % 4, charN: 0 };
        }
        return { ...s, charN: s.charN + 2 };
      });
    }, 50);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const sc = SCENARIOS[scIdx % 4];
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
          {/* TODO: wire the live-demo phone number (tel:) when it exists */}
          <button className="btn btn--lg" type="button">Talk to Lauren</button>
          {/* TODO: wire the sample-call audio when the recording exists */}
          <div className="audio-chip">
            <div className="audio-chip__play"><span /></div>
            <div className="audio-chip__body">
              <div className="audio-chip__title">Hear a real call</div>
              <div className="audio-chip__row">
                <div className="audio-chip__track"><div className="audio-chip__progress" /></div>
                <span className="audio-chip__time">0:38</span>
              </div>
            </div>
          </div>
        </div>
        <p className="hero__note">Live demo — ask her if she's human; she'll tell you straight.</p>
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
            <span className="call-panel__count">{(scIdx % 4) + 1} / 4</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
