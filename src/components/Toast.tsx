
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define toast types and structure
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

// Create context
const ToastContext = createContext<ToastContextType | null>(null);

// Toast provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show toast method
  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => 
        prevToasts.filter(toast => toast.id !== id)
      );
    }, 5000);
  };

  // Get background color based on toast type
  const getBackgroundColor = (type: ToastType): string => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`${getBackgroundColor(toast.type)} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between max-w-md animate-in slide-in-from-right-5 fade-in duration-300`}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => setToasts((prev) => prev.filter(t => t.id !== toast.id))}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
};
