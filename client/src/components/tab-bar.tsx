import { useLocation } from "wouter";
import { useStealthMode } from "@/components/stealth-mode-provider";

interface TabBarProps {
  active: "home" | "history";
}

export default function TabBar({ active }: TabBarProps) {
  const [, navigate] = useLocation();
  const { getMaskedLabel } = useStealthMode();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800 px-10 py-2">
      <div className="flex justify-between text-sm">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center py-2 ${active === "home" ? "text-ios-blue" : "text-gray-500 dark:text-gray-400"}`}
        >
          <i className="fas fa-home text-lg mb-1"></i>
          <span className="text-xs">{getMaskedLabel("Home", "Notes")}</span>
        </button>
        <button
          onClick={() => navigate("/history")}
          className={`flex flex-col items-center py-2 ${active === "history" ? "text-ios-blue" : "text-gray-500 dark:text-gray-400"}`}
        >
          <i className="fas fa-history text-lg mb-1"></i>
          <span className="text-xs">{getMaskedLabel("History", "Recent")}</span>
        </button>
      </div>
    </nav>
  );
}
