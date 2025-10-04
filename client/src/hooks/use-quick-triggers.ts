import { useEffect, useRef } from "react";

interface UseQuickTriggersOptions {
  enabled?: boolean;
  onTriggerAudio: () => void;
  onTriggerVideo?: () => void;
  tripleTapWindowMs?: number;
  shakeThreshold?: number; // approximate g-force change threshold
  shakeWindowMs?: number;
}

export function useQuickTriggers({
  enabled = true,
  onTriggerAudio,
  onTriggerVideo,
  tripleTapWindowMs = 600,
  shakeThreshold = 15, // m/s^2 magnitude delta
  shakeWindowMs = 1000,
}: UseQuickTriggersOptions) {
  const tapTimestampsRef = useRef<number[]>([]);
  const lastShakeTimeRef = useRef<number>(0);
  const shakeCountRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handlePointer = () => {
      const now = Date.now();
      tapTimestampsRef.current.push(now);
      // keep only recent taps
      tapTimestampsRef.current = tapTimestampsRef.current.filter((t) => now - t <= tripleTapWindowMs);
      if (tapTimestampsRef.current.length >= 3) {
        tapTimestampsRef.current = [];
        if ("vibrate" in navigator) navigator.vibrate([50, 50, 50]);
        onTriggerAudio();
      }
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!event.accelerationIncludingGravity) return;
      const { x = 0, y = 0, z = 0 } = event.accelerationIncludingGravity as any;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      // Rough shake detection; when magnitude spikes above threshold
      if (magnitude > shakeThreshold) {
        const now = Date.now();
        if (now - lastShakeTimeRef.current > 200) {
          lastShakeTimeRef.current = now;
          shakeCountRef.current += 1;
        }
        // If multiple shakes in a window, trigger
        if (now - lastShakeTimeRef.current <= shakeWindowMs && shakeCountRef.current >= 2) {
          shakeCountRef.current = 0;
          if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
          onTriggerAudio();
        }
      }
    };

    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("devicemotion", handleMotion as EventListener, { passive: true } as any);

    return () => {
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("devicemotion", handleMotion as EventListener);
    };
  }, [enabled, onTriggerAudio, onTriggerVideo, tripleTapWindowMs, shakeThreshold, shakeWindowMs]);
}
