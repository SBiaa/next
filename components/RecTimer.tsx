"use client";

import { useEffect, useState } from "react";

/** Contador "REC 00:00:12" que roda de verdade. */
export function RecTimer({ start = 12 }: { start?: number }) {
  const [seconds, setSeconds] = useState(start);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <div className="rec">
      <span className="rec-dot" />
      REC {pad(h)}:{pad(m)}:{pad(s)}
    </div>
  );
}
