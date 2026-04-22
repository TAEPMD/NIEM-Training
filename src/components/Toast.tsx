'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
  success: <CheckCircle className="w-[18px] h-[18px] text-[var(--accent-deep)] dark:text-[var(--accent)]" strokeWidth={1.6} />,
  error: <AlertCircle className="w-[18px] h-[18px] text-rose-500" strokeWidth={1.6} />,
  info: <Info className="w-[18px] h-[18px] text-[var(--text-primary)]" strokeWidth={1.6} />,
  warning: <AlertTriangle className="w-[18px] h-[18px] text-[var(--accent-deep)] dark:text-[var(--accent)]" strokeWidth={1.6} />,
};

const leftAccent = {
  success: 'before:bg-[var(--accent)]',
  error: 'before:bg-rose-500',
  info: 'before:bg-[var(--text-primary)]',
  warning: 'before:bg-[var(--accent)]',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      hideToast(id);
    }, 4000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`relative flex items-center gap-3 pl-5 pr-3 py-3.5 rounded-2xl border border-[var(--rule-strong)] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] bg-[var(--bg-secondary)] backdrop-blur-sm before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full ${leftAccent[toast.type]} animate-fade-in-up min-w-[280px]`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium text-[var(--text-primary)] pr-2 tracking-tight">{toast.message}</p>
            <button
              onClick={() => hideToast(toast.id)}
              className="ml-auto p-1.5 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" strokeWidth={1.8} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
