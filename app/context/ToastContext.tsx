"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { MdClose } from "react-icons/md";

type ToastType = "info" | "success" | "error" | "warning";

interface Toast {
  id: number;
  message: any;
  type: ToastType;
}

type ToastContextType = (message: any, type: ToastType) => void;

const ToastContext = createContext<ToastContextType>(() => {
  console.error("useToast must be used within a ToastProvider");
});

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const addToast = useCallback(
    (message: any, type: ToastType = "info") => {
      const id = Date.now();
      setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  const translateType = (type: ToastType) => {
    switch (type) {
      case "info":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
    }
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast toast-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert ${translateType(
              toast.type
            )} shadow-lg rounded-lg`}
          >
            <span className="flex flex-col md:flex-row items-center">
              {toast.message}{" "}
              <button
                onClick={() => removeToast(toast.id)}
                className="btn btn-ghost float-right"
              >
                <MdClose className="h-full w-4" />
              </button>
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
