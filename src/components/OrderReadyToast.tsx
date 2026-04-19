import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { toast } from 'sonner';

const OrderReadyToast = () => {
  const { orderReadyEvents } = useApp();
  const { playNotificationSound } = useNotificationSound();
  const prevCount = useRef(orderReadyEvents);

  useEffect(() => {
    if (orderReadyEvents > prevCount.current) {
      playNotificationSound();
      toast('🎉 Order Ready!', {
        description: 'Your order is ready for pickup! Head to the counter.',
        duration: 8000,
        className: 'animate-bounce-in',
        style: {
          background: 'linear-gradient(135deg, hsl(142, 71%, 45%), hsl(152, 60%, 42%))',
          color: 'white',
          border: 'none',
          fontWeight: 'bold',
        },
      });
    }
    prevCount.current = orderReadyEvents;
  }, [orderReadyEvents, playNotificationSound]);

  return null;
};

export default OrderReadyToast;
