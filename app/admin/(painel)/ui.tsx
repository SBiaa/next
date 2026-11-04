import Link from "next/link";
import { productLabel, statusInfo } from "@/lib/options";

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export function StatusPill({ status }: { status: string }) {
  const s = statusInfo(status);
  return (
    <span className="adm-pill" style={{ ["--c" as string]: s.color }}>
      {s.label}
    </span>
  );
}

/** Lista com barras horizontais (origens, interesses, páginas…). */
export function BarList({
  rows,
  empty = "Sem dados ainda.",
  format = (l: string) => l,
}: {
  rows: { label: string; n: number }[];
  empty?: string;
  format?: (label: string) => string;
}) {
  if (!rows.length) return <p className="adm-empty">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.n));
  return (
    <ul className="adm-bars">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="adm-bar" style={{ width: `${(r.n / max) * 100}%` }} />
          <span className="adm-bar-label">{format(r.label)}</span>
          <span className="adm-bar-n">{r.n}</span>
        </li>
      ))}
    </ul>
  );
}

/** Colunas por dia. */
export function DayChart({ data, label }: { data: { day: string; n: number }[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  const total = data.reduce((s, d) => s + d.n, 0);
  const short = (day: string) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;
  return (
    <figure className="adm-daychart" aria-label={`${label}: ${total} no período`}>
      <div className="adm-cols">
        {data.map((d) => (
          <div key={d.day} className="adm-col" title={`${short(d.day)} — ${d.n}`}>
            <div style={{ height: `${(d.n / max) * 100}%` }} className={d.n ? "" : "zero"} />
          </div>
        ))}
      </div>
      <figcaption>
        <span>{short(data[0]?.day ?? "")}</span>
        <span>máx. {max}/dia</span>
        <span>{short(data[data.length - 1]?.day ?? "")}</span>
      </figcaption>
    </figure>
  );
}

export function LeadRowLink({
  lead,
}: {
  lead: { id: string; name: string | null; business_name: string | null; interests: string[]; status: string; completed: boolean; created_at: string; ref: string | null };
}) {
  return (
    <Link href={`/admin/clientes/${lead.id}`} className="adm-lead">
      <div className="adm-lead-main">
        <strong>{lead.name || "Sem nome"}</strong>
        <span>{lead.business_name || "—"}</span>
      </div>
      <div className="adm-lead-tags">
        {lead.interests.slice(0, 3).map((k) => (
          <span key={k} className="adm-tag">
            {productLabel(k)}
          </span>
        ))}
        {lead.interests.length > 3 && <span className="adm-tag">+{lead.interests.length - 3}</span>}
      </div>
      <div className="adm-lead-meta">
        {!lead.completed && <span className="adm-partial">incompleto</span>}
        {lead.ref && <span className="adm-tag">via {lead.ref}</span>}
        <StatusPill status={lead.status} />
        <time>{fmtDate(lead.created_at)}</time>
      </div>
    </Link>
  );
}
