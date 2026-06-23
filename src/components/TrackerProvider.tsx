"use client";

import { useEffect } from "react";
import { initPixel, captureUTMs } from "@/lib/tracking";

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Capture UTMs from URL on first load
    captureUTMs();
    // Initialize Meta Pixel
    initPixel();
  }, []);

  return <>{children}</>;
}