const DashboardShowcase = () => (
  <section className="section">
    <div className="container">
      <div className="see-head">
        <div>
          <h2 className="kicker">You see everything</h2>
          <p className="see-head__claim">Your calls. Your data. Your dashboard.</p>
        </div>
        <p className="see-head__copy">Every call is recorded and transcribed, and every lead is logged. Your dashboard shows what was said, what it's worth, and what the month is costing — down to the minute.</p>
      </div>
      <div className="dash">
        <div className="dash__bar">
          <div className="dash__brand">
            <img src="/logo/mark-blue.svg" alt="" />
            <span>Dashboard<span className="mobile-hide"> — Dave's Plumbing</span></span>
          </div>
          <span className="dash__badge">Example data</span>
        </div>
        <div className="dash__body">
          <div className="dash__side">
            <div className="active">Overview</div>
            <div>Calls</div>
            <div>Leads</div>
            <div>Billing</div>
          </div>
          <div className="dash__main">
            <div className="stats">
              <div className="stat">
                <div className="stat__label">Calls answered</div>
                <div className="stat__value">24</div>
              </div>
              <div className="stat">
                <div className="stat__label">Leads captured</div>
                <div className="stat__value">19</div>
              </div>
              <div className="stat">
                <div className="stat__label">Revenue protected</div>
                <div className="stat__value stat__value--blue">$8,550</div>
              </div>
              <div className="stat">
                <div className="stat__label">Month to date</div>
                <div className="stat__value">$92.80</div>
                <div className="stat__note">$79 plan + 46 min</div>
              </div>
            </div>
            <div className="dash-table">
              <div className="dash-row">
                <span className="dash-row__time">9:41 am</span>
                <span className="dash-row__name">Sarah M. · Thornbury</span>
                <span className="dash-row__job">Hot water — no heat</span>
                <span className="dash-row__badges"><span>Transcript</span><span>Recording</span></span>
                <span className="dash-row__status"><span className="tick" />Texted + emailed</span>
              </div>
              <div className="dash-row">
                <span className="dash-row__time">11:07 am</span>
                <span className="dash-row__name">Greg T. · Preston</span>
                <span className="dash-row__job">Blocked drain, kitchen</span>
                <span className="dash-row__badges"><span>Transcript</span><span>Recording</span></span>
                <span className="dash-row__status"><span className="tick" />Texted + emailed</span>
              </div>
              <div className="dash-row dash-row--extra">
                <span className="dash-row__time">2:18 pm</span>
                <span className="dash-row__name">Anita R. · Northcote</span>
                <span className="dash-row__job">Quote — bathroom reno</span>
                <span className="dash-row__badges"><span>Transcript</span><span>Recording</span></span>
                <span className="dash-row__status"><span className="tick" />Texted + emailed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cta-banner cta-banner--dash">
        <p className="cta-banner__lead">Personal setup, and a real test call before you go live.</p>
        <a className="btn btn--lg" href="https://app.myreception.com.au/onboard">Set up your own agent and dashboard</a>
      </div>
    </div>
  </section>
);

export default DashboardShowcase;
