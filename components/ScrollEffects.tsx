"use client";

import { useEffect, useRef } from "react";

// Elementos que entram com animação ao rolar. `v` escolhe a direção da entrada.
const TARGETS: { sel: string; v?: "left" | "right" | "zoom" }[] = [
  { sel: ".problem-copy > *" },
  { sel: ".photo-square", v: "zoom" },
  { sel: ".how .eyebrow, .how .h2" },
  { sel: ".step" },
  { sel: ".services .eyebrow, .services .h2" },
  { sel: ".service", v: "zoom" },
  { sel: ".backstage-head" },
  { sel: ".shot", v: "zoom" },
  { sel: ".imagine .h2" },
  { sel: ".idea" },
  { sel: ".imagine-cta" },
  { sel: ".team-head > div", v: "left" },
  { sel: ".team-head > p", v: "right" },
  { sel: ".member" },
  { sel: ".contact h2, .contact-lead, .contact .btn" },
];

const STAGGER_MS = 90;
const MAX_DELAY_MS = 450;

export function ScrollEffects() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 1) Entrada dos blocos: só esconde o que ainda está abaixo da dobra.
    const pending: HTMLElement[] = [];
    for (const { sel, v } of TARGETS) {
      const perParent = new Map<Element, number>();
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        const parent = el.parentElement!;
        const i = perParent.get(parent) ?? 0;
        perParent.set(parent, i + 1);
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.classList.add("rv");
        if (v) el.dataset.rv = v;
        el.style.setProperty("--d", `${Math.min(i * STAGGER_MS, MAX_DELAY_MS)}ms`);
        pending.push(el);
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    pending.forEach((el) => io.observe(el));

    // 2) Barra de progresso + parallax leve, num único listener com rAF.
    const heroVisual = document.querySelector<HTMLElement>(".hero-visual");
    const mark = document.querySelector<HTMLElement>(".contact-mark");
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--p", String(max > 0 ? Math.min(y / max, 1) : 0));

      if (heroVisual && y < window.innerHeight * 1.2) {
        heroVisual.style.transform = `translate3d(0, ${(y * -0.08).toFixed(1)}px, 0)`;
      }
      if (mark) {
        const r = mark.parentElement!.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const t = (r.top + r.height / 2 - window.innerHeight / 2) * 0.12;
          mark.style.translate = `0 ${t.toFixed(1)}px`;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
