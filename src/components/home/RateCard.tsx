const RateCard = () => (
  <div className="rates__card">
    <h2 className="kicker">The rate card</h2>
    <div className="rate-row">
      <span className="rate-row__label">Monthly</span>
      <span className="rate-row__value">$79</span>
    </div>
    <div className="rate-row">
      <span className="rate-row__label">Calls</span>
      <span className="rate-row__value">$0.30 <small>per minute</small></span>
    </div>
    <div className="rate-row">
      <span className="rate-row__label">Setup</span>
      <span className="rate-row__value">$0</span>
    </div>
    <div className="rate-row">
      <span className="rate-row__label">Contract</span>
      <span className="rate-row__value rate-row__value--sm">None — leave any month</span>
    </div>
    <p className="rates__note">Published rates, no quotes to chase.</p>
  </div>
);

export default RateCard;
