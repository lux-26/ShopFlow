import { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import "./Toast.css";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = "info") => {
    setToast({ title, message, type });

    // Disparition automatique après 3 secondes
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Icône dynamique selon le type de message
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return faCircleCheck;
      case "error":
        return faTriangleExclamation;
      default:
        return faCircleInfo;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast &&
        ReactDOM.createPortal(
          <div className={`custom-toast-notification toast-${toast.type}`}>
            <div className="toast-icon-wrapper">
              <FontAwesomeIcon icon={getIcon(toast.type)} />
            </div>
            <div className="toast-content">
              <span className="toast-title">{toast.title}</span>
              <p className="toast-message">{toast.message}</p>
            </div>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
