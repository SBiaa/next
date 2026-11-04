import { isAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { productLabel, statusInfo } from "@/lib/options";

const COLS: [string, string][] = [
  ["created_at", "Data"],
  ["status", "Status"],
  ["completed", "Completo"],
  ["name", "Nome"],
  ["whatsapp", "WhatsApp"],
  ["email", "E-mail"],
  ["business_name", "Negócio"],
  ["segment", "Área"],
  ["city", "Cidade"],
  ["interests", "Interesses"],
  ["has_website", "Tem site"],
  ["website_url", "Site"],
  ["has_instagram", "Tem Instagram"],
  ["instagram", "Instagram"],
  ["has_business_card", "Tem cartão"],
  ["has_google_business", "No Google"],
  ["goal", "Objetivo"],
  ["budget", "Investimento"],
  ["best_contact_time", "Horário"],
  ["ref", "Indicação"],
  ["utm_source", "utm_source"],
  ["utm_campaign", "utm_campaign"],
  ["referrer", "Veio de"],
  ["notes", "Anotações"],
];

function cell(key: string, v: unknown) {
  let s: string;
  if (v === null || v === undefined) s = "";
  else if (key === "interests") s = (v as string[]).map(productLabel).join(", ");
  else if (key === "status") s = statusInfo(String(v)).label;
  else if (typeof v === "boolean") s = v ? "Sim" : "Não";
  else if (v instanceof Date) s = v.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  else if (key === "created_at") s = new Date(String(v)).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  else s = String(v);
  // evita que o Excel trate texto como fórmula
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Não autorizado", { status: 401 });
  const u = new URL(req.url).searchParams;
  const q = u.get("q")?.trim() || null;
  const status = u.get("status") || null;
  const ref = u.get("ref") || null;

  const rows = await sql`
    SELECT * FROM leads
    WHERE (${q}::text IS NULL OR concat_ws(' ', name, business_name, whatsapp, email, instagram, city) ILIKE '%' || ${q} || '%')
      AND (${status}::text IS NULL OR status = ${status})
      AND (${ref}::text IS NULL OR ref = ${ref})
    ORDER BY created_at DESC`;

  const lines = [
    COLS.map(([, h]) => `"${h}"`).join(";"),
    ...rows.map((r) => COLS.map(([k]) => cell(k, r[k])).join(";")),
  ];
  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clientes-next-${date}.csv"`,
    },
  });
}
