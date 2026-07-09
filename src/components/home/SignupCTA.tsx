import { FormEvent, useEffect, useState } from "react";
import Toast from "@/components/Toast";

const TOAST_MS = 6000;

const SignupCTA = () => {
  const [sent, setSent] = useState(false);
  // Bumped on every submit so a re-submit restarts the auto-dismiss timer.
  const [toastKey, setToastKey] = useState(0);

  useEffect(() => {
    if (!sent) return;
    const id = window.setTimeout(() => setSent(false), TOAST_MS);
    return () => clearTimeout(id);
  }, [sent, toastKey]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setToastKey((k) => k + 1);
  };

  return (
    <section className="cta" id="get-started">
      <div className="container">
        <div>
          <h2>Now accepting new clients — we set up every client personally.</h2>
          <p className="cta__copy">Every client goes through a personal setup and a real test call before going live. And you get a direct line to the people building Lauren.</p>
          <p className="cta__fine">Founding pricing still applies — locked in for as long as you stay.</p>
        </div>
        <div className="cta__form">
          {/* No backend wired yet — submit shows the design-system Toast. */}
          <form onSubmit={onSubmit} noValidate>
            <div className="cta__form-row">
              <label className="field">
                <span>Your name</span>
                <input name="name" placeholder="Dave Nguyen" autoComplete="name" />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" placeholder="dave@davesplumbing.com.au" autoComplete="email" />
              </label>
            </div>
            <div className="cta__form-row">
              <label className="field field--select">
                <span>Trade</span>
                <select name="trade">
                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>Builder</option>
                  <option>Landscaper</option>
                  <option>Other trade</option>
                </select>
                <span className="chevron" />
              </label>
              <label className="field">
                <span>Suburb</span>
                <input name="suburb" placeholder="Thornbury, VIC" />
              </label>
            </div>
            <button className="btn btn--lg btn--block" type="submit">Get Lauren on your phones</button>
            <p className="cta__form-note">No spam. We'll only email you about your setup.</p>
          </form>
        </div>
      </div>
      {sent && (
        <Toast
          key={toastKey}
          message="Sorted."
          detail="We’ll only email you about your setup."
          onDismiss={() => setSent(false)}
        />
      )}
    </section>
  );
};

export default SignupCTA;
