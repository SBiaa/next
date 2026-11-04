import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="adm-top">
        <a href="/admin" className="brand">
          <Logo label="Logo Next" width={26} height={31} />
          <span>next</span>
          <small>painel</small>
        </a>
        <AdminNav />
        <form action={logout}>
          <button type="submit" className="adm-ghost">
            Sair
          </button>
        </form>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
