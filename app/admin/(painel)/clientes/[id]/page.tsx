import Link from "next/link";
import { notFound } from "next/navigation";
import { updateLead } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { productLabel, STATUSES } from "@/lib/options";
import { fmtDate, StatusPill } from "../../ui";

type Lead = Record<string, unknown> & {
  id: string;
  name: string | null;
  whatsapp: string | null;
  email: string | null;
  business_name: string | null;
  instagram: string | null;
  website_url: string | null;
  interests: string[];
  status: string;
  completed: boolean;
  last_step: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ClienteDetalhe({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const rows = await sql`SELECT * FROM leads WHERE id = ${id}::uuid`;
  const l = rows[0] as Lead | undefined;
  if (!l) notFound();

  const phone = l.whatsapp?.replace(/\D/g, "");
  const first = l.name?.split(" ")[0] ?? "";
  const waText = encodeURIComponent(
    `Oi${first ? `, ${first}` : ""}! Aqui é da Next. Vi seu cadastro${l.business_name ? ` do ${l.business_name}` : ""} e queria conversar sobre suas ideias 🙂`,
  );
  const insta = l.instagram?.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
  const site = l.website_url ? (/^https?:\/\//.test(l.website_url) ? l.website_url : `https://${l.website_url}`) : null;
  const yn = (v: unknown) => (v === true ? "Sim" : v === false ? "Não" : "—");

  return (
    <>
      <Link href="/admin/clientes" className="adm-back">
        ← Clientes
      </Link>
      <div className="adm-head">
        <div>
          <h1>{l.name || "Sem nome"}</h1>
          <p className="adm-head-sub">
            {l.business_name || "Negócio não informado"}
            {l.city ? ` · ${l.city}` : ""} · cadastrado em {fmtDate(l.created_at)}
          </p>
        </div>
        <div className="adm-head-actions">
          {!l.completed && <span className="adm-partial">parou no passo {l.last_step}</span>}
          <StatusPill status={l.status} />
        </div>
      </div>

      <section className="adm-grid two wide-left">
        <div className="adm-stack">
          <div className="adm-card">
            <h2>Contato</h2>
            <dl className="adm-dl">
              <dt>WhatsApp</dt>
              <dd>
                {phone ? (
                  <a href={`https://wa.me/${phone.length <= 11 ? "55" : ""}${phone}?text=${waText}`} target="_blank" rel="noreferrer">
                    {l.whatsapp} ↗
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt>E-mail</dt>
              <dd>{l.email ? <a href={`mailto:${l.email}`}>{l.email}</a> : "—"}</dd>
              <dt>Melhor horário</dt>
              <dd>{(l.best_contact_time as string) || "—"}</dd>
            </dl>
          </div>

          <div className="adm-card">
            <h2>Negócio</h2>
            <dl className="adm-dl">
              <dt>Área</dt>
              <dd>{(l.segment as string) || "—"}</dd>
              <dt>Tem site?</dt>
              <dd>
                {yn(l.has_website)}
                {site && (
                  <>
                    {" · "}
                    <a href={site} target="_blank" rel="noreferrer">
                      {l.website_url} ↗
                    </a>
                  </>
                )}
              </dd>
              <dt>Instagram?</dt>
              <dd>
                {yn(l.has_instagram)}
                {insta && (
                  <>
                    {" · "}
                    <a href={`https://instagram.com/${encodeURIComponent(insta)}`} target="_blank" rel="noreferrer">
                      @{insta} ↗
                    </a>
                  </>
                )}
              </dd>
              <dt>Cartão de visita?</dt>
              <dd>{yn(l.has_business_card)}</dd>
              <dt>No Google Maps?</dt>
              <dd>{yn(l.has_google_business)}</dd>
            </dl>
          </div>

          <div className="adm-card">
            <h2>O que procura</h2>
            {l.interests.length ? (
              <div className="adm-lead-tags big">
                {l.interests.map((k) => (
                  <span key={k} className="adm-tag">
                    {productLabel(k)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="adm-empty">Não marcou nenhum.</p>
            )}
            <dl className="adm-dl">
              <dt>Objetivo</dt>
              <dd className="adm-pre">{(l.goal as string) || "—"}</dd>
              <dt>Investimento</dt>
              <dd>{(l.budget as string) || "—"}</dd>
            </dl>
          </div>
        </div>

        <div className="adm-stack">
          <form key={String(l.updated_at)} action={updateLead} className="adm-card adm-form">
            <h2>Acompanhamento</h2>
            <input type="hidden" name="id" value={l.id} />
            <label>
              <span>Status</span>
              <select name="status" defaultValue={l.status}>
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Anotações do time</span>
              <textarea name="notes" rows={8} defaultValue={l.notes ?? ""} placeholder="Ex.: liguei dia 05, pediu proposta de Reels…" />
            </label>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
            <p className="adm-muted">Última atualização: {fmtDate(l.updated_at)}</p>
          </form>

          <div className="adm-card">
            <h2>Origem</h2>
            <dl className="adm-dl">
              <dt>Indicação (ref)</dt>
              <dd>{(l.ref as string) || "—"}</dd>
              <dt>Campanha</dt>
              <dd>{[l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(" / ") || "—"}</dd>
              <dt>Veio do site</dt>
              <dd>{(l.referrer as string) || "—"}</dd>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
