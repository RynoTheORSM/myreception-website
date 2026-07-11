import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const LOAD_TIMEOUT_MS = 10_000;

/** Renders a Cloudflare Turnstile widget (Managed mode — invisible for most
    visitors) into the returned ref's element and tracks the current token.
    Tokens are single-use: call reset() after each verified request.
    `failed` goes true when the script can't load (blocked or timed out) so
    callers can show an explanation instead of a forever-disabled button. */
const useTurnstile = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!import.meta.env.VITE_TURNSTILE_SITE_KEY) {
      console.error("VITE_TURNSTILE_SITE_KEY is missing — Turnstile can't render; demo disabled.");
      setFailed(true);
      return;
    }

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current !== null) return; // already rendered (HMR remount)
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(null),
        "error-callback": () => setToken(null),
      });
    };

    if (window.turnstile) {
      render();
      return () => {
        cancelled = true;
      };
    }

    // Ad-blockers and locked-down networks block the Cloudflare script; fail
    // visibly rather than leaving the demo button disabled with no explanation.
    const fail = (why: string) => {
      if (cancelled) return;
      console.error(`Turnstile script failed to load (${why}) — demo disabled.`);
      setFailed(true);
    };
    const timeoutId = window.setTimeout(() => fail("timed out after 10s"), LOAD_TIMEOUT_MS);
    const onLoad = () => {
      clearTimeout(timeoutId);
      render();
    };
    const onError = () => {
      clearTimeout(timeoutId);
      fail("script error");
    };

    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    if (widgetIdRef.current !== null) window.turnstile?.reset(widgetIdRef.current);
  }, []);

  return { containerRef, token, reset, failed };
};

export default useTurnstile;
