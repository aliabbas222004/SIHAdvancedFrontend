import React, { useEffect, useState } from "react";

const ToastMessage = ({ message, type = "info", onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;

    const duration = 2000;
    const intervalTime = 40;
    const step = 100 / (duration / intervalTime);

    setProgress(100);

    const timer = setInterval(() => {
      setProgress(prev => Math.max(prev - step, 0));
    }, intervalTime);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, [message, onClose]);

  if (!message) return null;

  const allowedTypes = [
    "success",
    "danger",
    "warning",
    "info",
    "primary",
    "secondary",
    "dark"
  ];

  const toastType = allowedTypes.includes(type)
    ? type
    : "info";

  return (
    <div
      className="position-fixed start-50 translate-middle-x start-md-0 ms-md-3"
      style={{
        bottom: "20px",
        zIndex: 9999,
        width: "min(90vw, 350px)"
      }}
    >
      <div
        className={`toast show border-0 shadow bg-${toastType} text-white`}
      >
        <div className="toast-body py-2">
          {message}
        </div>

        <div
          style={{
            height: "3px",
            width: `${progress}%`,
            background: "rgba(255,255,255,0.85)",
            transition: "width 30ms linear"
          }}
        />
      </div>
    </div>
  );
};

export default ToastMessage;