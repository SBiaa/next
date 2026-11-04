"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { currentAttr, firstAttr, send } from "@/lib/track";

let lastPath = ""; // evita contar duas vezes a mesma visita (StrictMode no dev)

/** Registra uma visita por página (fora do /admin). */
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname === lastPath) return;
    lastPath = pathname;
    firstAttr(); // memoriza a origem da primeira visita
    send({ type: "pageview", path: pathname, ...currentAttr() });
  }, [pathname]);

  return null;
}
