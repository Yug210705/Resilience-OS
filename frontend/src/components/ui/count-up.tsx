'use client';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export function CountUp({ end, prefix = '', suffix = '', duration = 1500, isCurrency = false }: { end: number, prefix?: string, suffix?: string, duration?: number, isCurrency?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeOut * end);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formatted = isCurrency 
    ? formatCurrency(count)
    : Math.floor(count).toLocaleString();

  return <>{prefix}{formatted}{suffix}</>;
}
