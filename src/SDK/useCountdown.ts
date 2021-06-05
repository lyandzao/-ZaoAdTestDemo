import { useEffect, useRef, useState, useCallback } from 'react';

interface Props {
  timer: number;
  interval?: number;
  autostart?: boolean;
  expireImmediate?: boolean;
  onExpire: () => void;
  onReset?: () => void;
}

export function useCountdown({
  timer,
  interval = 1000,
  autostart = false,
  expireImmediate = false,
  onExpire,
  onReset = () => {},
}: Props) {
  const [countdown, setCountdown] = useState(timer);
  const [canStart, setCanStart] = useState(autostart);

  function start() {
    setCanStart(true);
  }

  const reset = useCallback(() => {
    setCanStart(false);
    setCountdown(timer);
    if (onReset && typeof onReset === 'function') {
      onReset();
    }
  }, [timer, onReset]);

  const expire = useCallback(() => {
    setCanStart(false);
    setCountdown(timer);
    if (onExpire && typeof onExpire === 'function') {
      onExpire();
    }
  }, [timer, onExpire]);

  const isExpired = useRef(false);
  useEffect(() => {
    isExpired.current = countdown / 1000 <= 0 ? true : false;
  }, [countdown]);

  useEffect(() => {
    function tick() {
      console.log('ticking');
      if (isExpired.current) {
        expire();
      } else {
        setCountdown((prev) => {
          if (expireImmediate && (prev - interval) / 1000 <= 0) {
            expire();
          }
          return prev - interval;
        });
      }
    }

    if (canStart) {
      const id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expire, canStart, interval]);

  return {
    countdown,
    start,
    reset,
  };
}
