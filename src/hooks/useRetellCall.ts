import { useCallback, useEffect, useRef, useState } from "react";
// Type-only: the SDK bundles livekit (~550 kB min), so the real import is
// deferred to start() — visitors who never start a call never download it.
import type { RetellWebClient } from "retell-client-js-sdk";

export type CallStatus = "idle" | "connecting" | "live" | "ended" | "error";
export type CallErrorKind = "mic_denied" | "rate_limited" | "connect_failed";

/** Thrown by the createWebCall callback so specific failures (e.g. the per-IP
    rate limit) surface as their own UI state instead of a generic error. */
export class WebCallError extends Error {
  kind: CallErrorKind;
  constructor(kind: CallErrorKind) {
    super(kind);
    this.kind = kind;
  }
}

/** The demo agent hangs up at 2 minutes (enforced server-side by Retell). */
export const CALL_CAP_SECONDS = 120;
// A call_ended this close to the cap is assumed to *be* the cap, so the UI
// can say "that's the time limit" instead of a generic "call ended".
const CAP_MARGIN_SECONDS = 10;

/** Drives a Retell browser voice call end-to-end: mic preflight, token
    retrieval via `createWebCall`, SDK lifecycle, and a 1s elapsed timer.
    Mic permission is checked *before* createWebCall so a denied mic never
    consumes a Turnstile token or a slot in the per-IP rate limit. */
const useRetellCall = (createWebCall: () => Promise<string>) => {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [errorKind, setErrorKind] = useState<CallErrorKind | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [endedAtLimit, setEndedAtLimit] = useState(false);
  const [agentTalking, setAgentTalking] = useState(false);

  const clientRef = useRef<RetellWebClient | null>(null);
  const timerRef = useRef<number | null>(null);
  const elapsedSecRef = useRef(0); // event handlers need the value synchronously
  // Kept in a ref so the SDK event handlers never call a stale closure
  // (the Turnstile token inside createWebCall changes between renders).
  const createWebCallRef = useRef(createWebCall);
  createWebCallRef.current = createWebCall;

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const teardownClient = useCallback(() => {
    const client = clientRef.current;
    clientRef.current = null;
    if (!client) return;
    client.removeAllListeners();
    try {
      client.stopCall();
    } catch {
      // Already disconnected — nothing to stop.
    }
  }, []);

  useEffect(() => () => {
    stopTimer();
    teardownClient();
  }, [stopTimer, teardownClient]);

  const start = useCallback(async () => {
    if (clientRef.current) return; // connecting or live — ignore double-clicks

    setStatus("connecting");
    setErrorKind(null);
    setEndedAtLimit(false);
    setAgentTalking(false);
    elapsedSecRef.current = 0;
    setElapsedSec(0);

    const fail = (kind: CallErrorKind) => {
      teardownClient();
      stopTimer();
      setErrorKind(kind);
      setStatus("error");
    };

    // Fetch the SDK chunk while the visitor reads the permission prompt.
    const sdkPromise = import("retell-client-js-sdk");
    // If the mic preflight bails first, the rejection would be unhandled.
    sdkPromise.catch(() => {});

    // Mic preflight: prompt for permission before anything costs quota.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error("microphone unavailable", err);
      fail("mic_denied");
      return;
    }

    let client: RetellWebClient;
    try {
      client = new (await sdkPromise).RetellWebClient();
    } catch (err) {
      console.error("retell sdk failed to load", err);
      fail("connect_failed");
      return;
    }

    let accessToken: string;
    try {
      accessToken = await createWebCallRef.current();
    } catch (err) {
      fail(err instanceof WebCallError ? err.kind : "connect_failed");
      return;
    }

    clientRef.current = client;

    client.on("call_started", () => {
      const startedAt = Date.now();
      stopTimer();
      timerRef.current = window.setInterval(() => {
        const sec = Math.min(CALL_CAP_SECONDS, Math.floor((Date.now() - startedAt) / 1000));
        elapsedSecRef.current = sec;
        setElapsedSec(sec);
      }, 500);
      setStatus("live");
    });

    client.on("agent_start_talking", () => setAgentTalking(true));
    client.on("agent_stop_talking", () => setAgentTalking(false));

    client.on("call_ended", () => {
      stopTimer();
      teardownClient();
      setAgentTalking(false);
      setEndedAtLimit(elapsedSecRef.current >= CALL_CAP_SECONDS - CAP_MARGIN_SECONDS);
      // An error state (with its explanation) beats a generic "ended" —
      // the SDK emits call_ended after error during teardown.
      setStatus((prev) => (prev === "error" ? prev : "ended"));
    });

    client.on("error", (err) => {
      console.error("retell web client error", err);
      fail("connect_failed");
    });

    try {
      await client.startCall({ accessToken });
    } catch (err) {
      console.error("retell startCall failed", err);
      fail("connect_failed");
    }
  }, [stopTimer, teardownClient]);

  const hangUp = useCallback(() => {
    // stopCall triggers the SDK's call_ended event, which settles the state.
    clientRef.current?.stopCall();
  }, []);

  return { status, errorKind, elapsedSec, endedAtLimit, agentTalking, start, hangUp };
};

export default useRetellCall;
