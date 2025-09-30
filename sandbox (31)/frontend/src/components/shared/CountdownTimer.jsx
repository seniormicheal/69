import { useEffect, useState } from "react";

export default function CountdownTimer({ expiryTimestamp }) {
  // Helper function to calculate time remains the same
  const calculateTimeLeft = () => {
    const diff = expiryTimestamp - new Date().getTime();
    if (diff <= 0) return null; // Return null to make expiry checks easier
    return {
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  // Initialize state once
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    // 1. Set up an interval that runs every second
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // 2. Clean up the interval when the component is removed from the screen
    // This is crucial to prevent memory leaks
    return () => {
      clearInterval(timerId);
    };

    // 3. The dependency array is empty. This means the effect runs ONLY ONCE
    // when the component first mounts. It sets up the timer and that's it.
  }, []); // <--- KEY CHANGE: Empty dependency array

  // If timeLeft is null, it means the timer has expired
  if (!timeLeft) {
    return <span className="text-red-500 font-semibold">منقضی شد</span>;
  }

  return (
    <div className="font-mono text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
      {String(timeLeft.minutes).padStart(2, "0")}:
      {String(timeLeft.seconds).padStart(2, "0")}
    </div>
  );
}