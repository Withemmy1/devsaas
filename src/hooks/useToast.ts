import { useContext } from 'react';
import { ToasterContext } from '../components/ui/Toaster';

export const useToast = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToast must be used within a ToasterProvider');
  }
  return context;
};