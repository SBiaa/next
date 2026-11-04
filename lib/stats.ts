import "server-only";
import { sql } from "@/lib/db";

const TZ = "America/Sao_Paulo";

type Row = { label: string; n: number };

export async function getStats(days: number) {
  const [kpis, daily, origins, leadOrigins, pages, devices, interests, presence, funnel, pipeline, recent] =
    await Promise.all([
      sql`
        SELECT
          (SELECT count(*) FROM page_views WHERE created_at >= now() - make_interval(days => ${days}))::int AS views,
          (SELECT count(DISTINCT visitor_id) FROM page_views WHERE created_at >= now() - make_interval(days => ${days}))::int AS visitors,
          (SELECT count(*) FROM leads WHERE created_at >= now() - make_interval(days => ${days}))::int AS leads,
          (SELECT count(*) FROM leads WHERE completed AND created_at >= now() - make_interval(days => ${days}))::int AS completed,
          (SELECT count(DISTINCT coalesce(visitor_id, id::text)) FROM leads WHERE created_at >= now() - make_interval(days => ${days}))::int AS lead_people,
          (SELECT count(*) FROM leads WHERE status = 'novo')::int AS to_contact`,
      sql`
        WITH d AS (
          SELECT generate_series(
            (now() AT TIME ZONE ${TZ})::date - (${days}::int - 1),
            (now() AT TIME ZONE ${TZ})::date, interval '1 day')::date AS day
        )
        SELECT to_char(d.day, 'YYYY-MM-DD') AS day,
          (SELECT count(DISTINCT visitor_id) FROM page_views p WHERE (p.created_at AT TIME ZONE ${TZ})::date = d.day)::int AS visitors,
          (SELECT count(*) FROM leads l WHERE (l.created_at AT TIME ZONE ${TZ})::date = d.day)::int AS leads
        FROM d ORDER BY d.day`,
      sql`
        WITH first_visit AS (
          SELECT DISTINCT ON (visitor_id) coalesce(ref, utm_source, referrer, 'Direto / WhatsApp') AS label
          FROM page_views WHERE created_at >= now() - make_interval(days => ${days})
          ORDER BY visitor_id, created_at
        )
        SELECT label, count(*)::int AS n FROM first_visit GROUP BY 1 ORDER BY 2 DESC LIMIT 8`,
      sql`
        SELECT coalesce(ref, utm_source, referrer, 'Direto / WhatsApp') AS label, count(*)::int AS n
        FROM leads WHERE created_at >= now() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 2 DESC LIMIT 8`,
      sql`
        SELECT path AS label, count(*)::int AS n FROM page_views
        WHERE created_at >= now() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 2 DESC LIMIT 6`,
      sql`
        SELECT coalesce(device, '?') AS label, count(DISTINCT visitor_id)::int AS n FROM page_views
        WHERE created_at >= now() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 2 DESC`,
      sql`
        SELECT k AS label, count(*)::int AS n FROM leads, unnest(interests) AS k
        WHERE created_at >= now() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 2 DESC`,
      sql`
        SELECT
          count(*) FILTER (WHERE has_website = false)::int AS no_site,
          count(*) FILTER (WHERE has_website IS NOT NULL)::int AS site_answered,
          count(*) FILTER (WHERE has_instagram = false)::int AS no_insta,
          count(*) FILTER (WHERE has_instagram IS NOT NULL)::int AS insta_answered,
          count(*) FILTER (WHERE has_business_card = false)::int AS no_card,
          count(*) FILTER (WHERE has_business_card IS NOT NULL)::int AS card_answered,
          count(*) FILTER (WHERE has_google_business = false)::int AS no_google,
          count(*) FILTER (WHERE has_google_business IS NOT NULL)::int AS google_answered
        FROM leads WHERE created_at >= now() - make_interval(days => ${days})`,
      sql`
        SELECT (props->>'step')::int AS step, count(DISTINCT visitor_id)::int AS n
        FROM events WHERE name = 'form_step' AND created_at >= now() - make_interval(days => ${days})
        GROUP BY 1
        UNION ALL
        SELECT 99, count(DISTINCT visitor_id)::int
        FROM events WHERE name = 'form_complete' AND created_at >= now() - make_interval(days => ${days})
        ORDER BY 1`,
      sql`SELECT status AS label, count(*)::int AS n FROM leads GROUP BY 1`,
      sql`
        SELECT id, name, business_name, interests, status, completed, ref, created_at
        FROM leads ORDER BY created_at DESC LIMIT 6`,
    ]);

  return {
    kpis: kpis[0] as { views: number; visitors: number; leads: number; completed: number; lead_people: number; to_contact: number },
    daily: daily as { day: string; visitors: number; leads: number }[],
    origins: origins as Row[],
    leadOrigins: leadOrigins as Row[],
    pages: pages as Row[],
    devices: devices as Row[],
    interests: interests as Row[],
    presence: presence[0] as Record<string, number>,
    funnel: funnel as { step: number; n: number }[],
    pipeline: pipeline as Row[],
    recent: recent as RecentLead[],
  };
}

export type RecentLead = {
  id: string;
  name: string | null;
  business_name: string | null;
  interests: string[];
  status: string;
  completed: boolean;
  ref: string | null;
  created_at: string;
};
