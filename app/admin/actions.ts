"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { STATUSES } from "@/lib/options";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // freia tentativa de adivinhar senha
    redirect("/admin/login?erro=1");
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function updateLead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  if (!STATUSES.some((s) => s.key === status)) return;
  await sql`UPDATE leads SET status = ${status}, notes = ${notes || null}, updated_at = now() WHERE id = ${id}::uuid`;
  revalidatePath(`/admin/clientes/${id}`);
  revalidatePath("/admin/clientes");
  revalidatePath("/admin");
}
