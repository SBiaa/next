-- Estrutura do banco (Neon, projeto "next-site"). Já foi aplicada; fica aqui de referência.

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edit_token text NOT NULL,            -- permite ao cliente continuar o cadastro sem login
  status text NOT NULL DEFAULT 'novo', -- novo | em_contato | proposta | fechado | perdido
  completed boolean NOT NULL DEFAULT false,
  last_step int NOT NULL DEFAULT 0,
  name text, whatsapp text, email text,
  business_name text, segment text, city text,
  interests text[] NOT NULL DEFAULT '{}',
  has_website boolean, website_url text,
  has_instagram boolean, instagram text,
  has_business_card boolean,
  has_google_business boolean,
  goal text, budget text, best_contact_time text,
  ref text, utm_source text, utm_medium text, utm_campaign text, referrer text,
  visitor_id text,
  notes text,                          -- anotações internas do time
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);

CREATE TABLE page_views (
  id bigserial PRIMARY KEY,
  path text NOT NULL,
  referrer text, ref text, utm_source text, utm_medium text, utm_campaign text,
  visitor_id text, device text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_at_idx ON page_views (created_at DESC);

CREATE TABLE events (
  id bigserial PRIMARY KEY,
  name text NOT NULL,                  -- form_step | form_complete
  visitor_id text,
  props jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX events_name_created_idx ON events (name, created_at DESC);
