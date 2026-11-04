import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { STATUSES } from "@/lib/options";
import type { RecentLead } from "@/lib/stats";
import { LeadRowLink } from "../ui";

type SP = { q?: string; status?: string; ref?: string; completos?: string };

export default async function Clientes({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || null;
  const status = STATUSES.some((s) => s.key === sp.status) ? sp.status! : null;
  const ref = sp.ref?.trim() || null;
  const onlyComplete = !!sp.completos;

  const leads = (await sql`
    SELECT id, name, business_name, interests, status, completed, ref, created_at
    FROM leads
    WHERE (${q}::text IS NULL OR concat_ws(' ', name, business_name, whatsapp, email, instagram, city) ILIKE '%' || ${q} || '%')
      AND (${status}::text IS NULL OR status = ${status})
      AND (${ref}::text IS NULL OR ref = ${ref})
      AND (${onlyComplete}::boolean = false OR completed)
    ORDER BY created_at DESC
    LIMIT 300`) as RecentLead[];

  const exportQs = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]).toString();

  return (
    <>
      <div className="adm-head">
        <h1>Clientes</h1>
        <a className="adm-ghost" href={`/admin/exportar${exportQs ? `?${exportQs}` : ""}`}>
          Baixar planilha (CSV)
        </a>
      </div>

      <form className="adm-filters" role="search">
        <input type="search" name="q" defaultValue={q ?? ""} placeholder="Buscar nome, negócio, WhatsApp, @…" aria-label="Buscar" />
        <select name="status" defaultValue={status ?? ""} aria-label="Status">
          <option value="">Todos os status</option>
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        {ref && <input type="hidden" name="ref" value={ref} />}
        <label className="adm-check">
          <input type="checkbox" name="completos" value="1" defaultChecked={onlyComplete} />
          Só cadastros completos
        </label>
        <button type="submit" className="btn btn-primary">
          Filtrar
        </button>
        {(q || status || ref || onlyComplete) && (
          <Link href="/admin/clientes" className="adm-clear">
            Limpar
          </Link>
        )}
      </form>

      <p className="adm-count">
        {leads.length} {leads.length === 1 ? "cliente" : "clientes"}
        {ref && <> · indicados por <strong>{ref}</strong></>}
      </p>

      {leads.length ? (
        <div className="adm-leads adm-card">
          {leads.map((l) => (
            <LeadRowLink key={l.id} lead={l} />
          ))}
        </div>
      ) : (
        <p className="adm-empty adm-card">Nenhum cliente encontrado.</p>
      )}
    </>
  );
}
