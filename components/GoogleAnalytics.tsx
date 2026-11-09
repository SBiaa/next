"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Google Analytics da Next (conta on.nextdigital@outlook.com).
const GA_ID = "G-4RHDG64J77";

/** Carrega o Google Analytics nas páginas públicas (fora do /admin). */
export function GoogleAnalytics() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
