import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
      >
        ×
      </button>
    </div>
  );
};

interface ToasterState {
  toasts: Array<{
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
  }>;
}

export const ToasterContext = React.createContext<{
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}>({
  showToast: () => {},
});

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<ToasterState>({ toasts: [] });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setState((prev) => ({
      toasts: [...prev.toasts, { id, message, type }],
    }));

    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000);
  };

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {state.toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => {
              setState((prev) => ({
                toasts: prev.toasts.filter((t) => t.id !== toast.id),
              }));
            }}
          />
        ))}
      </div>
    </ToasterContext.Provider>
  );
};

export const Toaster: React.FC = () => {
  const toasts = React.useContext(ToasterContext);
  return null;
};