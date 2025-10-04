import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface StealthContextValue {
  isStealth: boolean;
  enableStealth: () => void;
  disableStealth: () => void;
  toggleStealth: () => void;
  getMaskedLabel: (normal: string, masked: string) => string;
}

const StealthContext = createContext<StealthContextValue | undefined>(undefined);

export function StealthModeProvider({ children }: { children: React.ReactNode }) {
  const [isStealth, setIsStealth] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("stealth-mode");
      return stored === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("stealth-mode", isStealth ? "1" : "0");
    } catch {
      // ignore persistence issues
    }
  }, [isStealth]);

  const value = useMemo<StealthContextValue>(() => ({
    isStealth,
    enableStealth: () => setIsStealth(true),
    disableStealth: () => setIsStealth(false),
    toggleStealth: () => setIsStealth((s) => !s),
    getMaskedLabel: (normal: string, masked: string) => (isStealth ? masked : normal),
  }), [isStealth]);

  return (
    <StealthContext.Provider value={value}>{children}</StealthContext.Provider>
  );
}

export function useStealthMode(): StealthContextValue {
  const ctx = useContext(StealthContext);
  if (!ctx) throw new Error("useStealthMode must be used within StealthModeProvider");
  return ctx;
}
