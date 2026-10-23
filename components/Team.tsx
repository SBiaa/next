"use client";

import { useEffect, useState } from "react";

const ROLES = ["Head criativa", "Comercial", "Filmmaking", "Edição", "Criador / YouTube", "[FUNÇÃO]"];

export function Team() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % ROLES.length), 2500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="members"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {ROLES.map((role, i) => (
        <button
          key={role}
          type="button"
          className={`member${i === active ? " active" : ""}`}
          aria-label={`Ver ${role}`}
          aria-pressed={i === active}
          onClick={() => setActive(i)}
          onFocus={() => setActive(i)}
        >
          <div className="member-photo">
            <span className="placeholder-text">[FOTO]</span>
          </div>
          <div>
            <p className="member-name">[NOME]</p>
            <p className="member-role">{role}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
