import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { isAdmin } from "@/lib/auth";
import { login } from "../actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { erro } = await searchParams;

  return (
    <main className="adm-login">
      <form action={login} className="adm-login-card">
        <div className="brand">
          <Logo label="Logo Next" />
          <span>next</span>
        </div>
        <h1>Painel do time</h1>
        <label>
          <span>Senha</span>
          <input type="password" name="password" autoComplete="current-password" required autoFocus />
        </label>
        {erro && (
          <p className="adm-error" role="alert">
            Senha incorreta.
          </p>
        )}
        <button type="submit" className="btn btn-primary">
          Entrar
        </button>
      </form>
    </main>
  );
}
