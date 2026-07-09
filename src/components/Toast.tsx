/* Design-system Toast (deep navy, tick icon, dismissible). */

interface ToastProps {
  message: string;
  detail?: string;
  onDismiss: () => void;
}

const Toast = ({ message, detail, onDismiss }: ToastProps) => (
  <div className="toast" role="status">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.15)" />
      <path d="M5 9.3 7.8 12 13 6.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <strong>{message}</strong>
      {detail && <> <span>{detail}</span></>}
    </div>
    <button type="button" aria-label="Dismiss" onClick={onDismiss}>×</button>
  </div>
);

export default Toast;
