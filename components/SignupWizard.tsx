"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { saveLead, type LeadDraft } from "@/app/cadastro/actions";
import { BUDGETS, CONTACT_TIMES, PRODUCTS, SEGMENTS } from "@/lib/options";
import { firstAttr, trackEvent, visitorId } from "@/lib/track";

const STEPS = [
  { title: "Pra começar, quem é você?", sub: "Só pra gente saber com quem vai conversar." },
  { title: "Conta do seu negócio", sub: "Nome, área e onde fica." },
  { title: "O que te interessa?", sub: "Marque quantos quiser. Não sabe ainda? Tudo bem também." },
  { title: "Como seu negócio aparece hoje?", sub: "Assim a gente já chega sabendo de onde partir." },
  { title: "Qual é o objetivo?", sub: "Conta com suas palavras. Pode ser curtinho." },
];

const KEY = "nx_cadastro";

type Saved = { draft: LeadDraft; step: number; id?: string; token?: string };

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function persist(s: Saved | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {}
}

export function SignupWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<LeadDraft>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ids = useRef<{ id?: string; token?: string }>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // retoma um cadastro que ficou pela metade
  useEffect(() => {
    const s = load();
    if (s) {
      setDraft(s.draft ?? {});
      setStep(Math.min(s.step ?? 0, STEPS.length - 1));
      ids.current = { id: s.id, token: s.token };
    }
  }, []);

  useEffect(() => {
    if (done) return;
    trackEvent("form_step", { step: step + 1 });
    if (firstRender.current) firstRender.current = false;
    else heading.current?.focus();
  }, [step, done]);

  const set = <K extends keyof LeadDraft>(k: K, v: LeadDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  async function save(nextStep: number, completed: boolean) {
    setSaving(true);
    setError("");
    try {
      const a = firstAttr();
      const res = await saveLead({
        ...ids.current,
        step: Math.max(step + 1, nextStep),
        completed,
        draft,
        attribution: { ...a, vid: visitorId() },
        honeypot: honeypot.current?.value,
      });
      if (res.id) ids.current = { id: res.id, token: res.token };
      return true;
    } catch {
      setError("Não conseguimos salvar agora. Confere sua internet e tenta de novo?");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function go(next: number) {
    const last = next >= STEPS.length;
    if (!(await save(next, last))) return;
    if (last) {
      trackEvent("form_complete");
      persist(null);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    persist({ draft, step: next, ...ids.current });
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    persist({ draft, step: step - 1, ...ids.current });
    setStep(step - 1);
  }

  if (done) {
    const first = draft.name?.split(" ")[0];
    return (
      <div className="wiz-card wiz-done">
        <div className="wiz-check" aria-hidden="true">✓</div>
        <h1 tabIndex={-1}>{first ? `Valeu, ${first}!` : "Valeu!"}</h1>
        <p>
          Recebemos suas informações. Alguém do time da Next vai chamar você
          {draft.best_contact_time && draft.best_contact_time !== "Qualquer horário"
            ? ` de ${draft.best_contact_time.toLowerCase()}`
            : ""}{" "}
          pra conversar sobre o próximo nível do seu negócio.
        </p>
        <a href="/" className="btn btn-primary">
          Voltar pro site
        </a>
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <form
      className="wiz-card"
      onSubmit={(e) => {
        e.preventDefault();
        go(step + 1);
      }}
    >
      <div className="wiz-progress">
        <span>
          Passo {step + 1} de {STEPS.length}
        </span>
        <div className="wiz-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h1 ref={heading} tabIndex={-1}>
        {STEPS[step].title}
      </h1>
      <p className="wiz-sub">{STEPS[step].sub}</p>

      {/* campo invisível: só robô preenche */}
      <input ref={honeypot} name="empresa_site" tabIndex={-1} autoComplete="off" className="wiz-hp" aria-hidden="true" />

      <div className="wiz-fields">
        {step === 0 && (
          <>
            <Field label="Seu nome">
              <input value={draft.name ?? ""} onChange={(e) => set("name", e.target.value)} autoComplete="name" autoFocus />
            </Field>
            <Field label="WhatsApp" hint="Com DDD">
              <input
                value={draft.whatsapp ?? ""}
                onChange={(e) => set("whatsapp", maskPhone(e.target.value))}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                value={draft.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Nome do negócio">
              <input
                value={draft.business_name ?? ""}
                onChange={(e) => set("business_name", e.target.value)}
                autoComplete="organization"
              />
            </Field>
            <Group label="Área">
              <Chips options={SEGMENTS} value={draft.segment} onChange={(v) => set("segment", v)} />
            </Group>
            <Field label="Cidade">
              <input value={draft.city ?? ""} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
            </Field>
          </>
        )}

        {step === 2 && (
          <div className="wiz-products">
            {PRODUCTS.map((p) => {
              const on = draft.interests?.includes(p.key) ?? false;
              return (
                <label key={p.key} className={`wiz-product${on ? " on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      set(
                        "interests",
                        on ? (draft.interests ?? []).filter((k) => k !== p.key) : [...(draft.interests ?? []), p.key],
                      )
                    }
                  />
                  <span className="box" aria-hidden="true">
                    {on ? "✓" : ""}
                  </span>
                  {p.label}
                </label>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <>
            <YesNo label="Já tem site?" value={draft.has_website} onChange={(v) => set("has_website", v)}>
              <Field label="Endereço do site">
                <input
                  value={draft.website_url ?? ""}
                  onChange={(e) => set("website_url", e.target.value)}
                  inputMode="url"
                  placeholder="www.seunegocio.com.br"
                />
              </Field>
            </YesNo>
            <YesNo label="Tem Instagram?" value={draft.has_instagram} onChange={(v) => set("has_instagram", v)}>
              <Field label="@ do Instagram">
                <input
                  value={draft.instagram ?? ""}
                  onChange={(e) => set("instagram", e.target.value)}
                  placeholder="@seunegocio"
                  autoCapitalize="none"
                />
              </Field>
            </YesNo>
            <YesNo
              label="Tem cartão de visita?"
              value={draft.has_business_card}
              onChange={(v) => set("has_business_card", v)}
            />
            <YesNo
              label="Aparece no Google Maps?"
              value={draft.has_google_business}
              onChange={(v) => set("has_google_business", v)}
            />
          </>
        )}

        {step === 4 && (
          <>
            <Field label="O que você quer alcançar?">
              <textarea
                rows={4}
                value={draft.goal ?? ""}
                onChange={(e) => set("goal", e.target.value)}
                placeholder="Ex.: vender mais no Natal, lançar um produto, ser mais conhecido na cidade…"
              />
            </Field>
            <Group label="Quanto pensa em investir?">
              <Chips options={BUDGETS} value={draft.budget} onChange={(v) => set("budget", v)} />
            </Group>
            <Group label="Melhor horário pra gente te chamar">
              <Chips options={CONTACT_TIMES} value={draft.best_contact_time} onChange={(v) => set("best_contact_time", v)} />
            </Group>
          </>
        )}
      </div>

      {error && (
        <p className="wiz-error" role="alert">
          {error}
        </p>
      )}

      <div className="wiz-actions">
        {step > 0 ? (
          <button type="button" className="wiz-link" onClick={back} disabled={saving}>
            ← Voltar
          </button>
        ) : (
          <span />
        )}
        <div className="wiz-actions-right">
          <button type="button" className="wiz-skip" onClick={() => go(step + 1)} disabled={saving}>
            {isLast ? "Pular e enviar" : "Pular"}
          </button>
          <button type="submit" className="btn btn-primary wiz-next" disabled={saving}>
            {saving ? "Salvando…" : isLast ? "Enviar" : "Continuar"}
          </button>
        </div>
      </div>
    </form>
  );
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="wiz-field">
      <span className="wiz-label">
        {label} {hint && <em>{hint}</em>}
      </span>
      {children}
    </label>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="wiz-field">
      <legend className="wiz-label">{label}</legend>
      {children}
    </fieldset>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value?: string; onChange: (v?: string) => void }) {
  return (
    <div className="wiz-chips">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          className={value === o ? "on" : ""}
          onClick={() => onChange(value === o ? undefined : o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value?: boolean | null;
  onChange: (v: boolean | null) => void;
  children?: ReactNode;
}) {
  return (
    <div className="wiz-yesno">
      <Group label={label}>
        <div className="wiz-chips">
          {[
            [true, "Sim"],
            [false, "Não"],
          ].map(([v, l]) => (
            <button
              key={String(v)}
              type="button"
              aria-pressed={value === v}
              className={value === v ? "on" : ""}
              onClick={() => onChange(value === v ? null : (v as boolean))}
            >
              {l as string}
            </button>
          ))}
        </div>
      </Group>
      {value === true && children}
    </div>
  );
}
