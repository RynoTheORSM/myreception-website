const HowItWorks = () => (
  <section className="section section--rule" id="how-it-works">
    <div className="container">
      <div className="section-head">
        <h2 className="kicker">How it works</h2>
        <span className="section-head__note">From ring to lead in one flow.</span>
      </div>
      <div className="states">
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
        </div>
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
        </div>
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
        </div>
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
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
