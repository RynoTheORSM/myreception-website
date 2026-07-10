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
   listeners — nothing can capture the scroll. */
const useScrollFocus = (ref: RefObject<HTMLElement | null>) => {
  const [focus, setFocus] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (0.7 * window.innerHeight - r.top) / r.height;
      setFocus(Math.min(N - 1, Math.max(0, Math.floor(p * N))));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return focus;
};

/* Natural flow on every width — no pin, so the section joins its neighbours
   with the page's standard 64px rhythm and focus advances as the cards cross
   the reading line. */
const FlowSweep = () => {
  const ref = useRef<HTMLElement>(null);
  const focus = useScrollFocus(ref);
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
