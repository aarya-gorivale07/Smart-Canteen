import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { toast } from 'sonner';

const AdminNewOrderToast = () => {
  const { newOrderEvents } = useApp();
  const { playNotificationSound } = useNotificationSound();
  const prevCount = useRef(newOrderEvents);

  useEffect(() => {
    if (newOrderEvents > prevCount.current) {
      playNotificationSound();
      toast('📦 New Order Received!', {
        description: 'A new order has been placed. Check the order queue.',
        duration: 6000,
        className: 'animate-bounce-in',
        style: {
          background: 'linear-gradient(135deg, hsl(35, 92%, 50%), hsl(25, 95%, 45%))',
          color: 'white',
          border: 'none',
          fontWeight: 'bold',
        },
      });
    }
    prevCount.current = newOrderEvents;
  }, [newOrderEvents, playNotificationSound]);

  return null;
};

export default AdminNewOrderToast;
