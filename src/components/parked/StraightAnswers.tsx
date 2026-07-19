/* PARKED — not rendered anywhere. Removed from the homepage (July 2026) to
   reduce front-page density; reserved for a future trust/FAQ page. Copy is
   preserved exactly — do not edit without checking the design source.
   Original home: pricing section aside, alongside RateCard in the .rates grid
   (styles: .rates__aside / .aside-card in globals.css, kept in place). */
const StraightAnswers = () => (
  <div className="rates__aside">
    <div className="aside-card aside-card--tint">
      <div className="aside-card__label">On the record</div>
      <p className="aside-card__lead">In testing, 2 of 110 callers picked that Lauren wasn't human.</p>
      <p className="aside-card__fine">Scripted trade-call scenarios, May–June 2026. It's the only number we quote, and we'll always tell you where it came from.</p>
    </div>
    <div className="aside-card">
      <div className="aside-card__label">Straight answers</div>
      <p className="aside-card__body">If a caller asks Lauren whether she's a real person, she tells them straight. Honesty keeps the caller — and keeps your name good.</p>
    </div>
  </div>
);

export default StraightAnswers;
