"use server";

import { randomBytes } from "node:crypto";
import { sql } from "@/lib/db";
import { BUDGETS, CONTACT_TIMES, PRODUCTS } from "@/lib/options";

export type LeadDraft = {
  name?: string;
  whatsapp?: string;
  email?: string;
  business_name?: string;
  segment?: string;
  city?: string;
  interests?: string[];
  has_website?: boolean | null;
  website_url?: string;
  has_instagram?: boolean | null;
  instagram?: string;
  has_business_card?: boolean | null;
  has_google_business?: boolean | null;
  goal?: string;
  budget?: string;
  best_contact_time?: string;
};

export type Attribution = {
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  vid?: string;
};

const txt = (v: unknown, max = 200) => {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t || null;
};
const bool = (v: unknown) => (typeof v === "boolean" ? v : null);
const oneOf = (v: unknown, list: readonly string[]) => (typeof v === "string" && list.includes(v) ? v : null);

function clean(d: LeadDraft) {
  const keys = PRODUCTS.map((p) => p.key as string);
  return {
    name: txt(d.name),
    whatsapp: txt(d.whatsapp, 40),
    email: txt(d.email),
    business_name: txt(d.business_name),
    segment: txt(d.segment, 80),
    city: txt(d.city, 120),
    interests: Array.isArray(d.interests) ? d.interests.filter((k) => keys.includes(k)) : [],
    has_website: bool(d.has_website),
    website_url: txt(d.website_url, 300),
    has_instagram: bool(d.has_instagram),
    instagram: txt(d.instagram, 120),
    has_business_card: bool(d.has_business_card),
    has_google_business: bool(d.has_google_business),
    goal: txt(d.goal, 3000),
    budget: oneOf(d.budget, BUDGETS),
    best_contact_time: oneOf(d.best_contact_time, CONTACT_TIMES),
  };
}

const isEmpty = (c: ReturnType<typeof clean>) =>
  Object.values(c).every((v) => v === null || (Array.isArray(v) && v.length === 0));

type SaveInput = {
  id?: string;
  token?: string;
  step: number;
  completed: boolean;
  draft: LeadDraft;
  attribution?: Attribution;
  honeypot?: string;
};

/**
 * Salva o cadastro a cada passo. O primeiro save cria a linha e devolve id+token;
 * os seguintes atualizam a mesma linha (só quem tem o token consegue).
 */
export async function saveLead(input: SaveInput): Promise<{ id?: string; token?: string; ok: boolean }> {
  if (input.honeypot) return { ok: true }; // robô: finge que deu certo
  const c = clean(input.draft ?? {});
  const step = Math.max(0, Math.min(10, Math.floor(Number(input.step) || 0)));
  const completed = input.completed === true;

  if (input.id && input.token) {
    const rows = await sql`
      UPDATE leads SET
        name = ${c.name}, whatsapp = ${c.whatsapp}, email = ${c.email},
        business_name = ${c.business_name}, segment = ${c.segment}, city = ${c.city},
        interests = ${c.interests},
        has_website = ${c.has_website}, website_url = ${c.website_url},
        has_instagram = ${c.has_instagram}, instagram = ${c.instagram},
        has_business_card = ${c.has_business_card}, has_google_business = ${c.has_google_business},
        goal = ${c.goal}, budget = ${c.budget}, best_contact_time = ${c.best_contact_time},
        last_step = GREATEST(last_step, ${step}),
        completed = completed OR ${completed},
        updated_at = now()
      WHERE id = ${input.id} AND edit_token = ${input.token}
      RETURNING id`;
    if (rows.length) return { ok: true, id: input.id, token: input.token };
    // token inválido/antigo: cai pro insert abaixo
  }

  if (isEmpty(c)) return { ok: true };

  const a = input.attribution ?? {};
  const token = randomBytes(24).toString("base64url");
  const rows = await sql`
    INSERT INTO leads (
      edit_token, name, whatsapp, email, business_name, segment, city, interests,
      has_website, website_url, has_instagram, instagram, has_business_card, has_google_business,
      goal, budget, best_contact_time, last_step, completed,
      ref, utm_source, utm_medium, utm_campaign, referrer, visitor_id
    ) VALUES (
      ${token}, ${c.name}, ${c.whatsapp}, ${c.email}, ${c.business_name}, ${c.segment}, ${c.city}, ${c.interests},
      ${c.has_website}, ${c.website_url}, ${c.has_instagram}, ${c.instagram}, ${c.has_business_card}, ${c.has_google_business},
      ${c.goal}, ${c.budget}, ${c.best_contact_time}, ${step}, ${completed},
      ${txt(a.ref, 60)}, ${txt(a.utm_source, 100)}, ${txt(a.utm_medium, 100)}, ${txt(a.utm_campaign, 100)},
      ${txt(a.referrer, 300)}, ${txt(a.vid, 64)}
    ) RETURNING id`;
  return { ok: true, id: rows[0].id as string, token };
}
