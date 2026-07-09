const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div>
        <img className="site-footer__logo" src="/logo/lockup-on-dark.svg" alt="MyReception" />
        <p className="site-footer__tag">Australian owned and run.</p>
        <p className="site-footer__contact">hello@myreception.com.au · ABN 00 000 000 000</p>
      </div>
      <div className="site-footer__links">
        <a href="#how-it-works">How it works</a>
        <a href="#pricing">Pricing</a>
        <a className="login" href="https://app.myreception.com.au/login">Client Login</a>
      </div>
    </div>
  </footer>
);

export default Footer;
