"use client";

import { createPortal } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "./toast";
import { useEffect, useState } from "react";

export function ToastContainer() {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div className="fixed right-4 top-4 z-[100] w-full max-w-sm space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body
  );
}
