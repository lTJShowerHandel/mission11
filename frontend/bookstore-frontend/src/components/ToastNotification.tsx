interface ToastNotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export function ToastNotification({ message, show, onClose }: ToastNotificationProps) {
  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      <div className={`toast align-items-center text-bg-success border-0${show ? ' show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
