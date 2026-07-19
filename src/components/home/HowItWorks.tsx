import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

type CardStatus = "todo" | "focus" | "done" | "static";

const CARD_DATA: { title: string; body: ReactNode; desc: string }[] = [
  {
    title: "The phone rings",
    body: (
      <div className="mini">
        <div className="mini__title">Incoming call</div>
        <div className="mini__line">0412 555 ···</div>
        <div className="mini__status"><span className="dot" /><span>Ringing…</span></div>
      </div>
    ),
    desc: "You're mid-job. After a few rings, the line hands to Lauren.",
  },
  {
    title: "She takes the job",
    body: (
      <div className="mini-chat">
        <div>G'day, you've reached Dave's Plumbing.</div>
        <div>Hot water's died — can someone come out?</div>
      </div>
    ),
    desc: "The transcript types on as the call plays out.",
  },
  {
    title: "The lead assembles",
    body: (
      <div className="mini-lead">
        <div><span>Name</span><span>Sarah M.</span></div>
        <div><span>Number</span><span>0412 555 ···</span></div>
        <div><span>Suburb</span><span>Thornbury</span></div>
        <div><span>Job</span><span>Hot water — no heat</span></div>
      </div>
    ),
    desc: "Lead fields fill in one by one, straight from the call.",
  },
  {
    title: "The lead reaches you",
    body: (
      <div style={{ display: "grid", gap: 8 }}>
        <div className="mini-sms">
          <div className="mini-sms__head">
            <span className="mini-sms__app">Messages</span>
            <span className="mini-sms__time">now</span>
          </div>
          <div className="mini-sms__text">New lead: Sarah M., Thornbury — hot water, no heat. 0412 555 ···</div>
        </div>
        <div className="mini-email">
          <div className="mini-email__subject">New lead — hot water, Thornbury</div>
          <div className="mini-email__to">to dave@davesplumbing.com.au</div>
        </div>
        <div className="mini-dash-note"><span className="tick" style={{ width: 10, height: 6 }} /> On your dashboard a moment later</div>
      </div>
    ),
    desc: "The text and the email land, the dashboard ticks up — and the dots become the tick.",
  },
];

const N = CARD_DATA.length;

const Dots = ({ lit }: { lit: number }) => (
  <span className="state-card__dots">
    {[0, 1, 2].map((i) => (
      <span key={i} className={i < lit ? "on" : undefined} />
    ))}
  </span>
);

/* Card design unchanged from the static build; the only status-driven part is
   the head marker — passed states swap their progress dots for the tick, so
   ticks accumulate behind the focus and State 04's tick lands as the payoff. */
const StateCard = ({ index, status }: { index: number; status: CardStatus }) => {
  const card = CARD_DATA[index];
  const showTick = index === N - 1 || status === "done";
  return (
    <div className="state-card">
      <div className="state-card__head">
        <span className="state-card__label">State 0{index + 1}</span>
        {showTick ? <span className="state-card__tick" /> : <Dots lit={index + 1} />}
      </div>
      <h3>{card.title}</h3>
      {card.body}
      <p className="state-card__desc">{card.desc}</p>
    </div>
  );
};

const SectionHead = () => (
  <div className="section-head">
    <h2 className="kicker">How it works</h2>
    <span className="section-head__note">From ring to lead in one flow.</span>
  </div>
);

const Steps = ({ active, variant }: { active: number; variant: "top" | "bottom" }) => (
  <div className={`hiw-steps hiw-steps--${variant}`} aria-hidden="true">
    {CARD_DATA.map((_, i) => (
      <span key={i} className={i <= active ? "on" : undefined}>0{i + 1}</span>
    ))}
  </div>
);

/* The grid with focus treatments. Rendered twice in the DOM tree cheaply:
   the top steps bar shows only on mobile (sticky), the bottom one on desktop. */
const Stage = ({ focus }: { focus: number }) => (
  <div className="container">
    <SectionHead />
    <Steps active={focus} variant="top" />
    <div className="states">
      {CARD_DATA.map((_, i) => {
        const status: CardStatus = i === focus ? "focus" : i < focus ? "done" : "todo";
        return (
          <div key={i} className={`hiw-card is-${status}`}>
            <StateCard index={i} status={status} />
          </div>
        );
      })}
    </div>
    <Steps active={focus} variant="bottom" />
  </div>
);

/* Scroll-linked focus, rAF-throttled: maps the section's travel past the
   reading line (70% down the viewport) to 0..1. On mobile that's the card
   crossing the line; on desktop the row's transit through it. Plain
   listeners — nothing can capture the scroll. The 1.25 stretch spreads the
   four states over a quarter more scroll so the sweep doesn't feel rushed;
   the final state stays reachable because p tends to at least 1/1.25 = 0.8
   (> 3/4) by the time the section leaves the viewport. */
const SWEEP_STRETCH = 1.25;

const useScrollFocus = (ref: RefObject<HTMLElement | null>) => {
  const [focus, setFocus] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let armed = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // Mid-layout read (fonts/images still settling): keep the last good
      // target rather than dividing by zero, which would pin it at N-1.
      if (!r.height) return;
      const p = (0.7 * window.innerHeight - r.top) / (r.height * SWEEP_STRETCH);
      setFocus(Math.min(N - 1, Math.max(0, Math.floor(p * N))));
    };
    const schedule = () => {
      if (armed && !raf) raf = requestAnimationFrame(update);
    };
    // The target starts at state 0 and stays there until the visitor's first
    // real input gesture. Scroll events alone can't arm it: Chrome fires one
    // when it restores the scroll position after a reload, which would seed a
    // mid-section focus on a page the visitor hasn't touched yet.
    const arm = () => {
      armed = true;
      schedule();
    };
    const ARM_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    ARM_EVENTS.forEach((e) => window.addEventListener(e, arm, { passive: true, once: true }));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      ARM_EVENTS.forEach((e) => window.removeEventListener(e, arm));
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return focus;
};

/* Settle time: the scroll-derived focus above is only a target. A fast flick
   snaps that target across several states at once; the displayed focus walks
   toward it one state at a time with a minimum dwell per step, so every
   crossfade plays out visibly no matter how hard the visitor scrolls. Slow
   scrolling is unaffected — single-step changes apply immediately (the dwell
   since the last step has long elapsed). */
const STEP_MIN_MS = 450;

const useSettledFocus = (target: number) => {
  // Always open on State 01 — never seed from the incoming target, which can
  // be nonzero before the visitor has scrolled (restored scroll positions).
  const [display, setDisplay] = useState(0);
  const lastStep = useRef(-Infinity);
  useEffect(() => {
    if (display === target) return;
    const step = () => {
      lastStep.current = performance.now();
      setDisplay((d) => d + Math.sign(target - d));
    };
    const wait = STEP_MIN_MS - (performance.now() - lastStep.current);
    if (wait <= 0) {
      step();
      return;
    }
    const t = window.setTimeout(step, wait);
    return () => window.clearTimeout(t);
  }, [display, target]);
  return display;
};

/* Natural flow on every width — no pin, so the section joins its neighbours
   with the page's standard 64px rhythm and focus advances as the cards cross
   the reading line. */
const FlowSweep = () => {
  const ref = useRef<HTMLElement>(null);
  const target = useScrollFocus(ref);
  const focus = useSettledFocus(target);
  return (
    <section ref={ref} className="section section--rule" id="how-it-works">
      <Stage focus={focus} />
    </section>
  );
};

/* Reduced motion: the plain static grid — no pin, no scroll-linking, no dimming. */
const StaticHowItWorks = () => (
  <section className="section section--rule" id="how-it-works">
    <div className="container">
      <SectionHead />
      <div className="states">
        {CARD_DATA.map((_, i) => (
          <StateCard key={i} index={i} status="static" />
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <StaticHowItWorks /> : <FlowSweep />;
};

export default HowItWorks;
