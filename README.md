## Deploy em 1 clique (Cloudflare Pages + Supabase)

Siga este passo‑a‑passo uma única vez. Depois, cada push no repositório faz deploy automático.

1) Suba este projeto para um repositório no GitHub (ou conecte um já existente).

2) No painel Cloudflare → Pages → Create project → Connect to Git, escolha o repositório.

3) Configure:
   - Framework preset: Next.js
   - Build command: `npm run cf:build`
   - Output directory: `.vercel/output/static`
   - (Advanced → Functions) Functions directory: `.vercel/output/functions`

4) Variáveis de ambiente (Project > Settings > Environment Variables):
   - `SUPABASE_URL` = URL do seu projeto Supabase
   - `SUPABASE_ANON_KEY` = chave anônima (opcional se usar apenas server)
   - `SUPABASE_SERVICE_ROLE_KEY` = service role key (apenas no servidor)

5) Clique em "Save and Deploy". O Pages vai instalar, buildar e publicar.

Notas:
- O formulário de newsletter usa a rota `POST /api/newsletter` (server), que grava em `newsletter_subscribers` via Supabase (Service Role Key).
- Ajuste o schema no Supabase conforme necessário (colunas: `id uuid pk`, `email text unique not null`, `name text`, `subscribed_at timestamptz default now()`).
- Se preferir Edge Functions no Supabase, crie funções com nomes simples (ex.: `newsletter`) e invoque com `supabase.functions.invoke('newsletter')`.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
