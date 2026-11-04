import { sql } from "@/lib/db";

const s = (v: unknown, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

function device(ua: string) {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "celular";
  return "computador";
}

const BOT = /bot|crawl|spider|preview|headless|lighthouse/i;

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const vid = s(body.vid, 64);

  if (body.type === "pageview") {
    const path = s(body.path, 300);
    if (!path || path.startsWith("/admin")) return new Response(null, { status: 204 });
    await sql`
      INSERT INTO page_views (path, referrer, ref, utm_source, utm_medium, utm_campaign, visitor_id, device)
      VALUES (${path}, ${s(body.referrer, 300)}, ${s(body.ref, 60)}, ${s(body.utm_source, 100)},
              ${s(body.utm_medium, 100)}, ${s(body.utm_campaign, 100)}, ${vid}, ${device(ua)})`;
  } else if (body.type === "event") {
    const name = s(body.name, 40);
    if (!name || !["form_step", "form_complete"].includes(name)) return new Response(null, { status: 204 });
    const props = typeof body.props === "object" && body.props ? JSON.stringify(body.props).slice(0, 1000) : "{}";
    await sql`INSERT INTO events (name, visitor_id, props) VALUES (${name}, ${vid}, ${props}::jsonb)`;
  }

  return new Response(null, { status: 204 });
}
