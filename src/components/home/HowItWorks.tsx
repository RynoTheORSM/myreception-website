import { Fragment, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import useReducedMotion from "@/hooks/useReducedMotion";

/* The four state cards, exactly as designed. Shared by the static
   (reduced-motion) grid and the pinned scroll sequence. */
const CARDS: ReactNode[] = [
  <div className="state-card">
    <div className="state-card__head">
      <span className="state-card__label">State 01</span>
      <span className="state-card__dots"><span className="on" /><span /><span /></span>
    </div>
    <h3>The phone rings</h3>
    <div className="mini">
      <div className="mini__title">Incoming call</div>
      <div className="mini__line">0412 555 ···</div>
      <div className="mini__status"><span className="dot" /><span>Ringing…</span></div>
    </div>
    <p className="state-card__desc">You're mid-job. After a few rings, the line hands to Lauren.</p>
  </div>,
  <div className="state-card">
    <div className="state-card__head">
      <span className="state-card__label">State 02</span>
      <span className="state-card__dots"><span className="on" /><span className="on" /><span /></span>
    </div>
    <h3>She takes the job</h3>
    <div className="mini-chat">
      <div>G'day, you've reached Dave's Plumbing.</div>
      <div>Hot water's died — can someone come out?</div>
    </div>
    <p className="state-card__desc">The transcript types on as the call plays out.</p>
  </div>,
  <div className="state-card">
    <div className="state-card__head">
      <span className="state-card__label">State 03</span>
      <span className="state-card__dots"><span className="on" /><span className="on" /><span className="on" /></span>
    </div>
    <h3>The lead assembles</h3>
    <div className="mini-lead">
      <div><span>Name</span><span>Sarah M.</span></div>
      <div><span>Number</span><span>0412 555 ···</span></div>
      <div><span>Suburb</span><span>Thornbury</span></div>
      <div><span>Job</span><span>Hot water — no heat</span></div>
    </div>
    <p className="state-card__desc">Lead fields fill in one by one, straight from the call.</p>
  </div>,
  <div className="state-card">
    <div className="state-card__head">
      <span className="state-card__label">State 04</span>
      <span className="state-card__tick" />
    </div>
    <h3>The lead reaches you</h3>
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
    <p className="state-card__desc">The text and the email land, the dashboard ticks up — and the dots become the tick.</p>
  </div>,
];

const SectionHead = () => (
  <div className="section-head">
    <h2 className="kicker">How it works</h2>
    <span className="section-head__note">From ring to lead in one flow.</span>
  </div>
);

/* Reduced motion: the original static four-across grid. */
const StaticHowItWorks = () => (
  <section className="section section--rule" id="how-it-works">
    <div className="container">
      <SectionHead />
      <div className="states">
        {CARDS.map((card, i) => (
          <Fragment key={i}>{card}</Fragment>
        ))}
      </div>
    </div>
  </section>
);

const SEG = 1 / CARDS.length;
/* Half-width of the crossfade window around each state boundary,
   as a fraction of the section's scroll range. */
const FADE = 0.05;

const PinnedCard = ({ progress, index, children }: {
  progress: MotionValue<number>;
  index: number;
  children: ReactNode;
}) => {
  const isFirst = index === 0;
  const isLast = index === CARDS.length - 1;
  const enter = index * SEG;
  const leave = (index + 1) * SEG;
  // Framer drives these through WAAPI ScrollTimeline where available, so the
  // keyframes must explicitly cover offsets 0 and 1 — otherwise the browser
  // inserts implicit keyframes at the element's base value and hidden cards
  // drift back to full opacity.
  const range = [
    ...(isFirst ? [0] : [0, enter - FADE, enter + FADE]),
    ...(isLast ? [1] : [leave - FADE, leave + FADE, 1]),
  ];
  const opacity = useTransform(progress, range, [
    ...(isFirst ? [1] : [0, 0, 1]),
    ...(isLast ? [1] : [1, 0, 0]),
  ]);
  const y = useTransform(progress, range, [
    ...(isFirst ? [0] : [28, 28, 0]),
    ...(isLast ? [0] : [0, -28, -28]),
  ]);

  return (
    <motion.div className="hiw-stage__item" style={{ opacity, y }}>
      {children}
    </motion.div>
  );
};

/* Full motion: the section is a tall scroll track; a sticky viewport-high
   stage pins while scroll progress crossfades the four states in sequence.
   Scrolling is never captured — the pin is pure position: sticky, so the
   visitor can always scroll straight through. */
const PinnedHowItWorks = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(CARDS.length - 1, Math.max(0, Math.floor(v * CARDS.length))));
  });

  return (
    <section ref={ref} className="section section--rule hiw-pin" id="how-it-works">
      <div className="hiw-pin__sticky">
        <div className="container">
          <SectionHead />
          <div className="hiw-stage">
            {CARDS.map((card, i) => (
              <PinnedCard key={i} progress={scrollYProgress} index={i}>
                {card}
              </PinnedCard>
            ))}
          </div>
          <div className="hiw-steps" aria-hidden="true">
            {CARDS.map((_, i) => (
              <span key={i} className={i <= active ? "on" : undefined}>
                0{i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <StaticHowItWorks /> : <PinnedHowItWorks />;
};

export default HowItWorks;
