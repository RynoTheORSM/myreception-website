const Nav = () => (
  <nav className="site-nav">
    <a href="/" aria-label="MyReception home">
      <img className="site-nav__logo" src="/logo/lockup-on-white.svg" alt="MyReception" />
    </a>
    <div className="site-nav__links">
      <a href="#how-it-works">How it works</a>
      <a href="#pricing">Pricing</a>
      <a className="login" href="https://app.myreception.com.au/login">Client Login</a>
      <a className="btn btn--sm btn--secondary" href="#get-started">Get started</a>
    </div>
    <div className="site-nav__mobile">
      <a className="site-nav__login-mobile" href="https://app.myreception.com.au/login">Client Login</a>
      <a className="btn btn--sm btn--secondary" href="#get-started">Get started</a>
    </div>
  </nav>
);

export default Nav;
