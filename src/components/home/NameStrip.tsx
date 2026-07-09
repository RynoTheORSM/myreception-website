import { useEffect, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { STRIP_NAMES } from "@/lib/scenarios";

let measureCtx: CanvasRenderingContext2D | null = null;

/** Measure the name's width in em (Archivo 700) so the slot animates
    smoothly between names without shifting the rest of the sentence
    more than needed. */
const measureNameEm = (nm: string): number => {
  if (!measureCtx) measureCtx = document.createElement("canvas").getContext("2d");
  measureCtx!.font = "700 100px Archivo, sans-serif";
  return measureCtx!.measureText(nm + ".").width / 100 - 0.02;
};

const NameStrip = () => {
  const reducedMotion = useReducedMotion();
  const [nameIdx, setNameIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    let id: number | undefined;
    let cancelled = false;
    // Wait for Archivo so the measured slot width is right from the first frame.
    const start = () => {
      if (cancelled) return;
      setStarted(true);
      id = window.setInterval(() => setNameIdx((i) => i + 1), 2200);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }
    return () => {
      cancelled = true;
      if (id !== undefined) clearInterval(id);
    };
  }, [reducedMotion]);

  const nm = reducedMotion ? STRIP_NAMES[0] : STRIP_NAMES[nameIdx % STRIP_NAMES.length];

  return (
    <section className="name-strip">
      <div className="container">
        <div className="name-strip__heading">
          Meet{" "}
          <span id="strip-name" style={started ? { width: `${measureNameEm(nm).toFixed(3)}em` } : undefined}>
            <span key={nm}>{nm}.</span>
          </span>
          {/* The space must precede the hidden <br> — a space after it collapses
              at the (suppressed) line start on desktop. */}
          {" "}
          <br className="name-strip__br" />
          Your personalised, business receptionist.
        </div>
        <p className="name-strip__sub">Pick the receptionist name that suits your business.</p>
      </div>
    </section>
  );
};

export default NameStrip;
