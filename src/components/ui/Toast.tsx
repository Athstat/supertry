import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-100 dark:bg-green-900"
      : type === "error"
      ? "bg-red-100 dark:bg-red-900"
      : "bg-blue-100 dark:bg-blue-900";

  const textColor =
    type === "success"
      ? "text-green-800 dark:text-green-300"
      : type === "error"
      ? "text-red-800 dark:text-red-300"
      : "text-blue-800 dark:text-blue-300";

  const Icon =
    type === "success" ? CheckCircle : type === "error" ? AlertCircle : Info;

  return (
    <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={`${bgColor} ${textColor} rounded-lg shadow-lg p-4 max-w-md w-full flex items-center pointer-events-auto`}
      >
        <Icon size={20} className="flex-shrink-0 mr-3" />
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className={`ml-3 ${textColor} hover:opacity-75`}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
