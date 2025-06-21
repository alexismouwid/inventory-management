// utils/useDelayedLoading.js
import { useState, useEffect } from 'react';

export const useDelayedLoading = (delay = 1500) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
};

