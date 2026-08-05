'use client';

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
  return (
    <ToastProvider>
      <div className="fixed bottom-0 right-0 flex flex-col gap-2 p-4 sm:bottom-4 sm:right-4 z-[100]">
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}