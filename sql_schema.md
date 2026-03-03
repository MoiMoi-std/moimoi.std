-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cash_flow_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  transaction_code character varying NOT NULL,
  title character varying NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  transaction_type character varying NOT NULL CHECK (transaction_type::text = ANY (ARRAY['income'::character varying, 'expense'::character varying]::text[])),
  description text,
  transaction_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT cash_flow_logs_pkey PRIMARY KEY (id),
  CONSTRAINT cash_flow_logs_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_code text NOT NULL UNIQUE,
  wedding_id uuid,
  package_id integer NOT NULL,
  amount integer NOT NULL,
  payment_method text DEFAULT 'bank_transfer'::text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'expired'::text, 'cancelled'::text])),
  payment_info jsonb DEFAULT '{}'::jsonb,
  transaction_id text,
  paid_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.package_templates (
  package_id bigint NOT NULL,
  template_id bigint NOT NULL,
  CONSTRAINT package_templates_pkey PRIMARY KEY (package_id, template_id),
  CONSTRAINT package_templates_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id),
  CONSTRAINT package_templates_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id)
);
CREATE TABLE public.packages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  duration_months integer NOT NULL,
  max_rsvps integer NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  promotion_end_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT packages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rsvps (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  wedding_id uuid NOT NULL,
  guest_name text NOT NULL,
  phone text,
  wishes text,
  is_attending boolean DEFAULT true,
  party_size integer DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT rsvps_pkey PRIMARY KEY (id),
  CONSTRAINT rsvps_wedding_id_fkey FOREIGN KEY (wedding_id) REFERENCES public.weddings(id)
);
CREATE TABLE public.templates (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  thumbnail_url text,
  repo_branch text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT templates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.transactions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  transaction_code character varying NOT NULL,
  customer character varying NOT NULL,
  service character varying NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  payment_gateway character varying NOT NULL,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['success'::character varying, 'failed'::character varying]::text[])),
  transaction_date date NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.weddings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL,
  template_id bigint,
  content jsonb DEFAULT '{}'::jsonb,
  slug text NOT NULL UNIQUE,
  deployment_status text DEFAULT 'draft'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  package_id bigint,
  CONSTRAINT weddings_pkey PRIMARY KEY (id),
  CONSTRAINT weddings_host_id_fkey FOREIGN KEY (host_id) REFERENCES auth.users(id),
  CONSTRAINT weddings_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id),
  CONSTRAINT weddings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id)
);