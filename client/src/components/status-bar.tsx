import { useEffect, useState } from "react";

export default function StatusBar() {
  // Keep time updated every minute
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((x) => x + 1), 60_000);
    return () => clearInterval(id);
  }, []);
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  });

  return (
    <div className="bg-white dark:bg-gray-900 px-6 pt-3 pb-1 flex justify-between items-center text-sm font-medium text-black dark:text-white">
      <span>{currentTime}</span>
      <div className="flex items-center space-x-1">
        <i className="fas fa-signal text-xs"></i>
        <i className="fas fa-wifi text-xs"></i>
        <i className="fas fa-battery-full text-xs"></i>
      </div>
    </div>
  );
}
