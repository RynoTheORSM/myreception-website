import { FormEvent, useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";

const TOAST_MS = 6000;

const TRADE_OPTIONS = ["Plumber", "Electrician", "Builder", "Landscaper", "Other trade"];

/* Stored lowercase to match the clients.trade_type convention. */
const tradeValue = (label: string) => (label === "Other trade" ? "other" : label.toLowerCase());

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ToastState = { message: string; detail: string } | null;

const SignupCTA = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState(TRADE_OPTIONS[0]);
  const [suburb, setSuburb] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  // Bumped on every submit so a re-submit restarts the auto-dismiss timer.
  const [toastKey, setToastKey] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(id);
  }, [toast, toastKey]);

  const showToast = (message: string, detail: string) => {
    setToast({ message, detail });
    setToastKey((k) => k + 1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Native required/type=email covers the UI; this guards the insert itself.
    if (!name.trim() || !suburb.trim() || !EMAIL_RE.test(email.trim())) return;
    setSubmitting(true);
    const { error } = await supabase.from("launch_subscribers").insert({
      name: name.trim(),
      email: email.trim(),
      trade: tradeValue(trade),
      suburb: suburb.trim(),
      source: "homepage_signup",
    });
    setSubmitting(false);
    if (error) {
      showToast("Something went wrong.", "Try again, or email hello@myreception.com.au directly.");
      return;
    }
    setName("");
    setEmail("");
    setTrade(TRADE_OPTIONS[0]);
    setSuburb("");
    showToast("Sorted.", "We’ll only email you about your setup.");
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
          <form onSubmit={onSubmit}>
            <div className="cta__form-row">
              <label className="field">
                <span>Your name</span>
                <input
                  name="name"
                  placeholder="Dave Nguyen"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="dave@davesplumbing.com.au"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="cta__form-row">
              <label className="field field--select">
                <span>Trade</span>
                <select name="trade" value={trade} onChange={(e) => setTrade(e.target.value)}>
                  {TRADE_OPTIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <span className="chevron" />
              </label>
              <label className="field">
                <span>Suburb</span>
                <input
                  name="suburb"
                  placeholder="Thornbury, VIC"
                  required
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                />
              </label>
            </div>
            <button className="btn btn--lg btn--block" type="submit" disabled={submitting}>
              Get Lauren on your phones
            </button>
            <p className="cta__form-note">No spam. We'll only email you about your setup.</p>
          </form>
        </div>
      </div>
      {toast && (
        <Toast
          key={toastKey}
          message={toast.message}
          detail={toast.detail}
          onDismiss={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default SignupCTA;
