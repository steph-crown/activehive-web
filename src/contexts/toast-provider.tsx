"use client";

import { type ReactNode, useCallback, useState } from "react";
import { ToastContext } from "./toast-context";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  console.log({ toasts });

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after duration (default 5 seconds)
      const duration = toast.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (title: string, message: string, duration?: number) => {
      addToast({ type: "success", title, message, duration });
    },
    [addToast]
  );

  const showError = useCallback(
    (title: string, message: string, duration?: number) => {
      addToast({ type: "error", title, message, duration });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number) => {
      addToast({ type: "info", title, message, duration });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}
