"use client";

import { AlertTriangle, X, Info, AlertCircle } from "lucide-react";
import Button from "../../components/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "text-red-600",
          buttonVariant: "heroDanger" as const,
          IconComponent: AlertTriangle,
        };
      case "warning":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: "text-orange-600",
          buttonVariant: "heroWarning" as const,
          IconComponent: AlertCircle,
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          buttonVariant: "hero" as const,
          IconComponent: Info,
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.IconComponent;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className={`${styles.bg} ${styles.border} border-b px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className={`w-6 h-6 ${styles.icon}`} />
              <h2 className="font-rubik text-xl font-bold text-gray-900">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/50 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="font-raleway text-gray-700 text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <Button variant="heroOutline" onClick={onClose} className="px-6 py-2">
            {cancelText}
          </Button>
          <Button
            variant={styles.buttonVariant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
