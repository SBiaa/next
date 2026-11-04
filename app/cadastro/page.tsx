import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { SignupWizard } from "@/components/SignupWizard";
import "./cadastro.css";

export const metadata: Metadata = {
  title: "Conta pra gente sobre o seu negócio — Next",
  description: "Leva 2 minutinhos. Conta do seu negócio e a Next prepara uma ideia pra você.",
};

export default function CadastroPage() {
  return (
    <div className="cad">
      <header className="cad-header">
        <a href="/" className="brand">
          <Logo label="Logo Next" />
          <span>next</span>
        </a>
        <p>Leva uns 2 minutinhos · pode pular o que quiser</p>
      </header>
      <main className="cad-main">
        <SignupWizard />
      </main>
    </div>
  );
}
