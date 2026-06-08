"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      expand
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast: "archive-toast",
          title: "archive-toast-title",
          description: "archive-toast-description",
          actionButton: "archive-toast-action",
          cancelButton: "archive-toast-cancel",
        },
      }}
    />
  );
}
