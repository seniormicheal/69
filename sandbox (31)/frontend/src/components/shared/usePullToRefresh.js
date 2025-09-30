import { useState, useEffect, useCallback } from 'react';

const PULL_THRESHOLD = 100; // Pixels the user must pull down

export default function usePullToRefresh(onRefresh) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStart, setPullStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setPullStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && pullStart > 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - pullStart;
      if (distance > 0) {
        e.preventDefault(); // Prevent browser's default overscroll behavior
        setPullDistance(distance);
      }
    }
  };

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > PULL_THRESHOLD) {
      setIsRefreshing(true);
      onRefresh().finally(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        setPullStart(0);
      });
    } else {
      setPullDistance(0);
      setPullStart(0);
    }
  }, [pullDistance, onRefresh]);


  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullStart, handleTouchEnd]); // Dependencies ensure the latest state is used

  return { isRefreshing, pullDistance };
}