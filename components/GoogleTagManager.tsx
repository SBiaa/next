"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Container do Google Tag Manager. O Google Analytics é ligado lá dentro.
const GTM_ID = "GTM-ML7B67HZ";

/** Carrega o Google Tag Manager nas páginas públicas (fora do /admin). */
export function GoogleTagManager() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
