import { useState } from "react";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-AU");

const MissedCallCalculator = () => {
  const [avg, setAvg] = useState("450");
  const [missed, setMissed] = useState("3");

  const weekly =
    Math.max(0, Number(avg) || 0) * Math.max(0, Number(missed) || 0);

  return (
    <section className="section">
      <div className="container calc">
        <div className="calc__left">
          <h2 className="kicker">What a missed call costs</h2>
          <p className="calc__claim">Every call you miss rings the next number on the list.</p>
          <p className="calc__note">A worked example, not a promise — your numbers, your maths.</p>
        </div>
        <div className="calc__card">
          <div className="calc__fields">
            <label className="field">
              <span>Average job value ($)</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={avg}
                onChange={(e) => setAvg(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Calls that ring out, per week</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={missed}
                onChange={(e) => setMissed(e.target.value)}
              />
            </label>
          </div>
          <div className="calc__result">
            <span className="calc__result-label">Gone to a competitor</span>
            <span className="calc__result-value" aria-live="polite" aria-atomic="true">{fmt(weekly)} <small>a week</small></span>
          </div>
          <div className="calc__cta">
            <p className="calc__cta-line">
              That's <strong>{fmt(weekly)}</strong> a week Lauren could be protecting.
            </p>
            <a className="btn btn--lg btn--block" href="#get-started">Answer every call. Never miss a job. Stay on the tools.</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissedCallCalculator;
