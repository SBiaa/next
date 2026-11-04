import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { productLabel, STATUSES } from "@/lib/options";
import { getStats } from "@/lib/stats";
import { BarList, DayChart, LeadRowLink, pct } from "./ui";

const PERIODS = [7, 30, 90];
const STEP_NAMES = ["Quem é você", "Negócio", "Interesses", "Presença hoje", "Objetivo"];

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  await requireAdmin();
  const d = Number((await searchParams).d);
  const days = PERIODS.includes(d) ? d : 30;
  const s = await getStats(days);
  const k = s.kpis;
  const p = s.presence;

  const funnelStart = s.funnel.find((f) => f.step === 1)?.n ?? 0;
  const funnelRows = [
    ...STEP_NAMES.map((name, i) => ({ name: `${i + 1}. ${name}`, n: s.funnel.find((f) => f.step === i + 1)?.n ?? 0 })),
    { name: "Enviou", n: s.funnel.find((f) => f.step === 99)?.n ?? 0 },
  ];

  return (
    <>
      <div className="adm-head">
        <h1>Visão geral</h1>
        <div className="adm-seg" role="group" aria-label="Período">
          {PERIODS.map((n) => (
            <Link key={n} href={`/admin?d=${n}`} aria-current={n === days ? "true" : undefined}>
              {n} dias
            </Link>
          ))}
        </div>
      </div>

      <section className="adm-kpis">
        <Kpi label="Visitantes" value={k.visitors} sub={`${k.views} páginas vistas`} />
        <Kpi label="Cadastros" value={k.leads} sub={`${k.completed} completos`} />
        <Kpi label="Conversão" value={`${Math.min(100, pct(k.lead_people, k.visitors))}%`} sub="dos visitantes se cadastraram" />
        <Kpi label="Pra chamar" value={k.to_contact} sub="clientes com status “Novo”" accent href="/admin/clientes?status=novo" />
      </section>

      <section className="adm-grid two">
        <Card title="Visitantes por dia">
          <DayChart label="Visitantes" data={s.daily.map((r) => ({ day: r.day, n: r.visitors }))} />
        </Card>
        <Card title="Cadastros por dia">
          <DayChart label="Cadastros" data={s.daily.map((r) => ({ day: r.day, n: r.leads }))} />
        </Card>
      </section>

      <section className="adm-grid three">
        <Card title="Quem trouxe cadastro" hint="pelo link ?ref= (ex.: /cadastro?ref=teca)">
          <BarList rows={s.leadOrigins} empty="Nenhum cadastro no período." />
        </Card>
        <Card title="De onde vêm as visitas" hint="pela primeira visita de cada pessoa">
          <BarList rows={s.origins} />
        </Card>
        <Card title="O que mais interessa">
          <BarList rows={s.interests} format={productLabel} empty="Nenhum interesse marcado ainda." />
        </Card>
      </section>

      <section className="adm-grid three">
        <Card title="Funil do formulário" hint={`de ${funnelStart} que abriram`}>
          <ul className="adm-funnel">
            {funnelRows.map((r) => (
              <li key={r.name}>
                <span>{r.name}</span>
                <div className="adm-funnel-track">
                  <div style={{ width: `${pct(r.n, funnelStart)}%` }} />
                </div>
                <span className="adm-bar-n">{pct(r.n, funnelStart)}%</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Oportunidades" hint="entre quem respondeu">
          <ul className="adm-opps">
            <Opp label="Sem site" a={p.no_site} b={p.site_answered} />
            <Opp label="Sem Instagram" a={p.no_insta} b={p.insta_answered} />
            <Opp label="Sem cartão de visita" a={p.no_card} b={p.card_answered} />
            <Opp label="Fora do Google Maps" a={p.no_google} b={p.google_answered} />
          </ul>
        </Card>
        <Card title="Visitas por aparelho">
          <BarList rows={s.devices} />
          <h3 className="adm-subhead">Páginas mais vistas</h3>
          <BarList rows={s.pages} />
        </Card>
      </section>

      <section className="adm-grid two wide-left">
        <Card title="Últimos cadastros" action={<Link href="/admin/clientes">Ver todos →</Link>}>
          {s.recent.length ? (
            <div className="adm-leads">
              {s.recent.map((l) => (
                <LeadRowLink key={l.id} lead={l} />
              ))}
            </div>
          ) : (
            <p className="adm-empty">
              Nenhum cadastro ainda. Mande o link <code>/cadastro?ref=seunome</code> pros clientes.
            </p>
          )}
        </Card>
        <Card title="Funil de vendas" hint="todos os clientes">
          <BarList
            rows={STATUSES.map((st) => ({ label: st.key, n: s.pipeline.find((r) => r.label === st.key)?.n ?? 0 }))}
            format={(key) => STATUSES.find((st) => st.key === key)?.label ?? key}
          />
        </Card>
      </section>
    </>
  );
}

function Kpi({
  label,
  value,
  sub,
  accent,
  href,
}: {
  label: string;
  value: number | string;
  sub: string;
  accent?: boolean;
  href?: string;
}) {
  const body = (
    <>
      <span className="adm-kpi-label">{label}</span>
      <strong>{value}</strong>
      <span className="adm-kpi-sub">{sub}</span>
    </>
  );
  return href ? (
    <Link href={href} className={`adm-kpi${accent ? " accent" : ""}`}>
      {body}
    </Link>
  ) : (
    <div className={`adm-kpi${accent ? " accent" : ""}`}>{body}</div>
  );
}

function Card({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="adm-card">
      <div className="adm-card-head">
        <h2>{title}</h2>
        {hint && <span>{hint}</span>}
        {action && <div className="adm-card-action">{action}</div>}
      </div>
      {children}
    </div>
  );
}

function Opp({ label, a, b }: { label: string; a: number; b: number }) {
  return (
    <li>
      <strong>{pct(a, b)}%</strong>
      <span>
        {label} <em>({a} de {b})</em>
      </span>
    </li>
  );
}
