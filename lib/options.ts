// Listas usadas no formulário de cadastro e no painel.

export const PRODUCTS = [
  { key: "video", label: "Vídeos e Reels" },
  { key: "social", label: "Gestão de Instagram" },
  { key: "campanhas", label: "Campanhas e datas comemorativas" },
  { key: "anuncios", label: "Anúncios pagos (Instagram / Google)" },
  { key: "identidade", label: "Logo e identidade visual" },
  { key: "impressos", label: "Cartão de visita e impressos" },
  { key: "site", label: "Site ou loja virtual" },
  { key: "foto", label: "Fotos profissionais" },
  { key: "sistema", label: "Sistema / automação (WhatsApp, agenda…)" },
  { key: "nao_sei", label: "Ainda não sei — quero uma ideia" },
] as const;

export const SEGMENTS = [
  "Loja / varejo",
  "Alimentação",
  "Beleza e estética",
  "Saúde",
  "Serviços",
  "Educação",
  "Outro",
];

export const BUDGETS = [
  "Até R$ 500/mês",
  "R$ 500 a 1.500/mês",
  "R$ 1.500 a 3.000/mês",
  "Acima de R$ 3.000/mês",
  "Prefiro conversar",
];

export const CONTACT_TIMES = ["Manhã", "Tarde", "Noite", "Qualquer horário"];

export const STATUSES = [
  { key: "novo", label: "Novo", color: "#ff8a3d" },
  { key: "em_contato", label: "Em contato", color: "#ffb37a" },
  { key: "proposta", label: "Proposta enviada", color: "#7ab8ff" },
  { key: "fechado", label: "Fechado", color: "#5fd38a" },
  { key: "perdido", label: "Perdido", color: "#8f8a82" },
] as const;

export const productLabel = (key: string) => PRODUCTS.find((p) => p.key === key)?.label ?? key;
export const statusInfo = (key: string) => STATUSES.find((s) => s.key === key) ?? STATUSES[0];
