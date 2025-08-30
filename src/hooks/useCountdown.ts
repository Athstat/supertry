import { useEffect, useState } from 'react';

/** Hook that provides a count down! */
export function useCountdown(startMillis: number) {
  const [timeLeft, setTimeLeft] = useState(Math.floor(startMillis / 1000)); // total seconds

  const isCountdownFinished = timeLeft <= 0;

  useEffect(() => {
    
    if (timeLeft <= 0) {
      clearInterval(timeLeft);
    };

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timeLeft);
    };


    return () => clearInterval(timer);
  }, [timeLeft, startMillis]);

  const days = !isCountdownFinished ? Math.floor(timeLeft / (60 * 60 * 24)) : 0;
  const hours = !isCountdownFinished ? Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60)) : 0;
  const minutes = !isCountdownFinished ? Math.floor((timeLeft % (60 * 60)) / 60) : 0;
  const seconds = !isCountdownFinished ? timeLeft % 60 : 0;



  return { days, hours, minutes, seconds, isCountdownFinished };
}
