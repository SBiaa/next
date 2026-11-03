"use client";

import { useEffect, useState } from "react";

const MEMBERS = [
  { name: "Bia Siqueira", role: "Head criativa" },
  { name: "Deka", role: "Comercial" },
  { name: "Peterson", role: "Filmmaker" },
  { name: "[NOME]", role: "Edição" },
  { name: "[NOME]", role: "Criador / YouTube" },
  { name: "Miguel", role: "Financeiro" },
];

export function Team() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % MEMBERS.length), 2500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="members"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {MEMBERS.map(({ name, role }, i) => (
        <button
          key={role}
          type="button"
          className={`member${i === active ? " active" : ""}`}
          aria-label={`Ver ${name === "[NOME]" ? role : `${name}, ${role}`}`}
          aria-pressed={i === active}
          onClick={() => setActive(i)}
          onFocus={() => setActive(i)}
        >
          <div className="member-photo">
            <span className="placeholder-text">[FOTO]</span>
          </div>
          <div>
            <p className="member-name">{name}</p>
            <p className="member-role">{role}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
