import { CALL_CAP_SECONDS, type CallErrorKind, type CallStatus } from "@/hooks/useRetellCall";

interface LiveCallBarProps {
  status: Exclude<CallStatus, "idle">;
  errorKind: CallErrorKind | null;
  elapsedSec: number;
  endedAtLimit: boolean;
  agentTalking: boolean;
  onHangUp: () => void;
}

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

const EmailFallback = () => (
  <a href="mailto:hello@myreception.com.au">hello@myreception.com.au</a>
);

const ERROR_COPY: Record<CallErrorKind, JSX.Element> = {
  mic_denied: (
    <>Lauren needs mic access to talk — check your browser&apos;s permissions and try again.</>
  ),
  rate_limited: (
    <>That&apos;s the demo limit for today — email <EmailFallback /> and we&apos;ll set up a proper call.</>
  ),
  connect_failed: (
    <>Couldn&apos;t connect the call — give it another go in a moment, or email <EmailFallback />.</>
  ),
};

/** Status strip under the Talk to Lauren button: connecting spinner, live
    call with timer + hang-up, and ended/error states with the email fallback. */
const LiveCallBar = ({ status, errorKind, elapsedSec, endedAtLimit, agentTalking, onHangUp }: LiveCallBarProps) => (
  <div className="live-call" role="status">
    {status === "connecting" && (
      <>
        <span className="live-call__spinner" aria-hidden="true" />
        <span className="live-call__text">Connecting you to Lauren…</span>
      </>
    )}
    {status === "live" && (
      <>
        <span
          className={`live-call__dot${agentTalking ? " live-call__dot--talking" : ""}`}
          aria-hidden="true"
        />
        <span className="live-call__text">Live with Lauren</span>
        <span className="live-call__timer">
          {fmt(elapsedSec)} <span className="live-call__cap">/ {fmt(CALL_CAP_SECONDS)} max</span>
        </span>
        <button type="button" className="btn btn--sm live-call__hangup" onClick={onHangUp}>
          Hang up
        </button>
      </>
    )}
    {status === "ended" && (
      <span className="live-call__text">
        {endedAtLimit ? (
          <>That&apos;s the demo time limit — want to book a real call to hear more? Email <EmailFallback />.</>
        ) : (
          <>Call ended — thanks for trying Lauren. Have another go, or email <EmailFallback />.</>
        )}
      </span>
    )}
    {status === "error" && (
      <span className="live-call__text">{ERROR_COPY[errorKind ?? "connect_failed"]}</span>
    )}
  </div>
);

export default LiveCallBar;
