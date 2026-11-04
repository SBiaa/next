"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/clientes", label: "Clientes" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="adm-nav" aria-label="Painel">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}>
            {l.label}
          </Link>
        );
      })}
      <a href="/cadastro" target="_blank" rel="noreferrer">
        Ver formulário ↗
      </a>
    </nav>
  );
}
