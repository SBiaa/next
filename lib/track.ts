// Analytics próprio (roda no navegador). Guarda um id anônimo do visitante
// e a origem da primeira visita (?ref=teca, utm_*, site de onde veio).

export type Attr = {
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
};

function store<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
    const v = fallback();
    localStorage.setItem(key, JSON.stringify(v));
    return v;
  } catch {
    return fallback();
  }
}

export function visitorId(): string {
  return store("nx_vid", () => crypto.randomUUID());
}

/** Origem desta visita (lida da URL e do referrer). */
export function currentAttr(): Attr {
  const q = new URLSearchParams(location.search);
  let referrer: string | undefined;
  try {
    const r = document.referrer ? new URL(document.referrer) : null;
    if (r && r.host !== location.host) referrer = r.host.replace(/^www\./, "");
  } catch {}
  const a: Attr = {
    ref: q.get("ref") ?? undefined,
    utm_source: q.get("utm_source") ?? undefined,
    utm_medium: q.get("utm_medium") ?? undefined,
    utm_campaign: q.get("utm_campaign") ?? undefined,
    referrer,
  };
  return a;
}

/** Primeira origem conhecida desse visitante — é o que vai junto do cadastro. */
export function firstAttr(): Attr {
  const now = currentAttr();
  const hasAny = Object.values(now).some(Boolean);
  try {
    const saved = localStorage.getItem("nx_attr");
    if (saved) return JSON.parse(saved) as Attr;
    if (hasAny) localStorage.setItem("nx_attr", JSON.stringify(now));
  } catch {}
  return now;
}

export function send(payload: Record<string, unknown>) {
  const body = JSON.stringify({ ...payload, vid: visitorId() });
  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "text/plain" }))) return;
  } catch {}
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
}

export function trackEvent(name: string, props: Record<string, unknown> = {}) {
  send({ type: "event", name, props });
  // Também manda pro Google Analytics.
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", name, props);
  } catch {}
}
