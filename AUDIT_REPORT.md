# HABTA — Relatório Consolidado de Auditoria

**Data:** 2026-03-05
**Fontes:** 5 agentes independentes (ARCH, PERF, SEC, DATA, UX-CODE)
**Total de achados únicos:** 48 (após deduplicação)

---

## Resumo Executivo

| Severidade | Quantidade |
|------------|-----------|
| CRITICO    | 12        |
| IMPORTANTE | 22        |
| MELHORIA   | 14        |

Problemas mais urgentes: **RLS aberta no Supabase** (qualquer pessoa lê/escreve dados), **endpoints admin sem autenticação**, e **151 MB de imagens sem compressão** a prejudicar performance.

---

## FASE A — Fazer AGORA (criticos de seguranca + quick wins)

| # | Achado | Sev. | Esforco | Dominio | Acao |
|---|--------|------|---------|---------|------|
| A1 | RLS policies com `USING(true)` + `WITH CHECK(true)` — qualquer anon user pode ler/escrever TODOS os contacts/leads | CRITICO | MEDIO | SEC | Reescrever RLS policies para restringir acesso por role (`authenticated`, `service_role`). Testar com anon. |
| A2 | Admin endpoints da edge function (subscribers GET/DELETE) e header `x-admin-request` forjavel — qualquer pessoa pode agir como admin | CRITICO | MEDIO | SEC | Implementar verificacao JWT + role check server-side. Remover confianca em headers do browser. |
| A3 | CORS com `Access-Control-Allow-Origin: *` na edge function | CRITICO | RAPIDO | SEC | Restringir origin para `habta.eu` e subdomains. |
| A4 | Sem rate limiting em APIs publicas (newsletter, contact) — spam/DoS | CRITICO | MEDIO | SEC | Adicionar rate limiting via Cloudflare WAF rules ou middleware (ex: 5 req/min por IP). |
| A5 | API Routes (`/api/insights`, `/api/projects`, `/api/testimonials`) retornam STUB DATA hardcoded — nao consultam Supabase | CRITICO | MEDIO | DATA | Implementar queries reais ao Supabase ou remover endpoints se nao estao em uso. |
| A6 | TypeScript `ignoreBuildErrors: true` e ESLint `ignoreDuringBuilds: true` no next.config.ts | CRITICO | RAPIDO | ARCH | Desativar ambos os flags. Corrigir erros de build que surgirem. |
| A7 | Schema sem foreign keys — integridade referencial inexistente | CRITICO | GRANDE | DATA | Criar migration com ALTER TABLE ADD CONSTRAINT para todas as relacoes. Testar com dados existentes. |
| A8 | Queries N+1 em ControloManager — 5 chamadas HTTP sequenciais por projeto | CRITICO | MEDIO | DATA | Consolidar em 1-2 queries com joins ou RPC. |
| A9 | 151 MB de JPEGs em `/public/images/velask/` sem AVIF | CRITICO | MEDIO | PERF | Converter para AVIF/WebP com `next/image`. Esperado: ~15 MB (reducao de 90%). |
| A10 | `motion/react` importado em 36 arquivos — 40-60 KB JS extra | CRITICO | GRANDE | PERF | Remover motion ou isolar em poucos componentes com `dynamic()`. Usar CSS animations onde possivel. |
| A11 | 42 arquivos .md na pasta `src/` poluindo o codebase | CRITICO | RAPIDO | ARCH | Mover todos para `/docs` ou eliminar. Nao pertencem a `src/`. |
| A12 | Duplicacao de rota `/portfolio` em `sitemap.ts:88` | CRITICO | RAPIDO | UX | Remover entrada duplicada do sitemap. |

---

## FASE B — Fazer esta semana (importantes com alto impacto)

| # | Achado | Sev. | Esforco | Dominio | Acao |
|---|--------|------|---------|---------|------|
| B1 | Sem security headers HTTP (CSP, X-Frame-Options, HSTS, Permissions-Policy) | IMPORTANTE | MEDIO | SEC | Adicionar headers em `next.config.ts` ou `_middleware.ts`. |
| B2 | Upload de imagens sem validacao server-side de magic bytes | IMPORTANTE | MEDIO | SEC | Validar magic bytes no server antes de aceitar upload. |
| B3 | Newsletter sem unsubscribe, sem compliance GDPR (consent, IP, timestamp) | IMPORTANTE | MEDIO | SEC | Guardar consent + IP + timestamp. Implementar link de unsubscribe. |
| B4 | Sem validacao de email confirmado no middleware admin | IMPORTANTE | RAPIDO | SEC | Verificar `email_confirmed_at` na sessao antes de permitir acesso. |
| B5 | Validacao de input na edge function sem limite de tamanho de string (DoS) | IMPORTANTE | RAPIDO | SEC | Limitar body size e comprimento de campos (ex: 1000 chars). |
| B6 | Supabase Storage sem RLS policies documentadas | IMPORTANTE | MEDIO | SEC | Auditar e documentar policies de Storage. Restringir upload a authenticated. |
| B7 | Leaflet (160 KB) carregado sincronamente em VelaskLocation | IMPORTANTE | RAPIDO | PERF | Usar `dynamic(() => import(...), { ssr: false })`. |
| B8 | Apenas 5 de 17 `@radix-ui/*` em `optimizePackageImports` — faltam 12 (ate 180 KB extra) | IMPORTANTE | RAPIDO | PERF | Adicionar todos os 12 pacotes restantes ao array em `next.config.ts`. |
| B9 | Sem `revalidate`/ISR em paginas estaticas — cada request faz fetch ao Supabase | IMPORTANTE | MEDIO | PERF | Adicionar `export const revalidate = 3600` nas paginas estaticas. |
| B10 | Velask hero nao pre-carregado (LCP 2-3s potencial) | IMPORTANTE | RAPIDO | PERF | Adicionar `priority` ao `<Image>` do hero e `<link rel="preload">`. |
| B11 | Newsletter INSERT sem ON CONFLICT — permite duplicatas | IMPORTANTE | RAPIDO | DATA | Adicionar `ON CONFLICT (email) DO NOTHING` ou `DO UPDATE`. |
| B12 | 4 ficheiros Supabase client diferentes (ARCH tambem reportou duplicacao em `/lib` e `/utils`) | IMPORTANTE | MEDIO | DATA | Consolidar em 1 client por contexto (browser/server). Remover duplicatas. |
| B13 | Inconsistencia em data fetching (SSR fetch, CSR useEffect, supabaseFetch) | IMPORTANTE | GRANDE | DATA | Padronizar: Server Components com fetch + revalidate, client com React Query ou SWR. |
| B14 | Cache manual em `useProjectFetch` sem TTL | IMPORTANTE | RAPIDO | DATA | Adicionar TTL ao cache ou migrar para React Query/SWR. |
| B15 | Fallback data hardcoded de 2024 em ImoveisContent | IMPORTANTE | RAPIDO | DATA | Remover ou atualizar dados de fallback. Usar skeleton/loading state. |
| B16 | Multiplas definicoes de `Project` interface nao sincronizadas | IMPORTANTE | MEDIO | DATA | Criar tipo unico em `types/project.ts`. Re-exportar de la. |
| B17 | Error handling generico sem logging — impossivel debugar em prod | IMPORTANTE | MEDIO | DATA | Integrar logger (Sentry, LogFlare, ou Supabase logs). |
| B18 | Velask `page.tsx` inteira como `'use client'` — prejudica SEO/SSR | IMPORTANTE | MEDIO | ARCH | Separar em Server Component pai + children `'use client'`. |
| B19 | 4 componentes orfaos nunca importados: LogoPatternSelector, PatternSelector, PalettePreview, CursorEffect | IMPORTANTE | RAPIDO | ARCH | Apagar os 4 ficheiros. |
| B20 | `clsx` e `tailwind-merge` com versao `"*"` no package.json | IMPORTANTE | RAPIDO | ARCH | Fixar versoes (ex: `"^2.1.0"`). Correr `npm install`. |
| B21 | `@types/leaflet` duplicado em dependencies E devDependencies | IMPORTANTE | RAPIDO | ARCH | Remover de `dependencies`. Manter apenas em `devDependencies`. |
| B22 | Cor dourada `#B8956A` sobre branco com contraste insuficiente WCAG | IMPORTANTE | RAPIDO | UX | Substituir por `#8f7350` para passar WCAG AA (4.5:1). |
| B23 | Heading hierarchy incorreta (Portfolio cards h3 sem h2 pai, Contact sem h1) | IMPORTANTE | RAPIDO | UX | Corrigir hierarquia de headings para ser sequencial. |
| B24 | 3 formularios de contacto diferentes (Contact, VelaskContactForm, VelaskForm) | IMPORTANTE | MEDIO | UX | Consolidar num unico componente parametrizavel. |
| B25 | Grid Contact sem breakpoint `md:` — salta de 1col mobile para 2col desktop | IMPORTANTE | RAPIDO | UX | Adicionar `md:grid-cols-2` ao grid. |
| B26 | CookieConsent `dynamic()` sem `ssr: false` — hydration mismatch | IMPORTANTE | RAPIDO | ARCH | Adicionar `{ ssr: false }` ao `dynamic()`. |

---

## FASE C — Fazer depois (melhorias e baixo impacto)

| # | Achado | Sev. | Esforco | Dominio | Acao |
|---|--------|------|---------|---------|------|
| C1 | Sem MFA/2FA no login admin | IMPORTANTE | GRANDE | SEC | Ativar MFA via Supabase Auth settings. |
| C2 | Sem audit logging de operacoes sensiveis | MELHORIA | GRANDE | SEC | Criar tabela `audit_log` e trigger/RPC para log de acoes. |
| C3 | Sem backup automatico documentado | MELHORIA | MEDIO | SEC | Configurar Supabase Point-in-Time Recovery ou pg_dump agendado. |
| C4 | Process/Services/Testimonials carregados assincronamente acima-fold | IMPORTANTE | MEDIO | PERF | Remover lazy loading destes componentes above-fold. |
| C5 | ImageWithFallback sem `width`/`height` — CLS minor | MELHORIA | RAPIDO | PERF | Adicionar props `width`/`height` ao componente. |
| C6 | AdminPanelNew.tsx com 86 KB — ficheiro unico | MELHORIA | GRANDE | PERF | Dividir em sub-componentes por tab com code-splitting. |
| C7 | Wrangler.toml sem cache rules explicitas | MELHORIA | RAPIDO | PERF | Adicionar `Cache-Control` rules para assets estaticos. |
| C8 | Sem optimistic updates no admin — 2-3s delay por save | IMPORTANTE | MEDIO | DATA | Implementar optimistic updates com rollback on error. |
| C9 | Seed data em loops sequenciais sem rollback | IMPORTANTE | MEDIO | DATA | Agrupar seeds em transacao com rollback. |
| C10 | Sem on-demand ISR (webhook para revalidacao) | MELHORIA | MEDIO | DATA | Criar `/api/revalidate?tag=X` com secret token. |
| C11 | Tipos `any` em admin components — sem type safety | IMPORTANTE | GRANDE | DATA | Substituir por tipos proprios. Desbloquear com A6 (TypeScript strict). |
| C12 | 56+ componentes `'use client'` — alguns poderiam ser Server Components | IMPORTANTE | GRANDE | ARCH | Auditar e migrar componentes que nao usam hooks/interatividade. |
| C13 | JSON-LD inline no root layout | MELHORIA | RAPIDO | ARCH | Extrair para `utils/schema.ts`. |
| C14 | Toaster inconsistente entre layouts (site dynamic, standalone direto) | MELHORIA | RAPIDO | ARCH | Padronizar estrategia de Toaster em ambos os layouts. |
| C15 | `dynamic()` desnecessario em ScrollProgress e BackToTop | MELHORIA | RAPIDO | ARCH | Remover `dynamic()`. Importar diretamente. |
| C16 | Supabase clients duplicados em `/lib` e `/utils` | MELHORIA | MEDIO | ARCH | Consolidar (coberto por B12 para data, aqui para imports). |
| C17 | Barrel file para `utils/styles` (imports repetitivos em admin) | MELHORIA | RAPIDO | ARCH | Criar `index.ts` com re-exports. |
| C18 | Footer headings sem `aria-label` descritivo | MELHORIA | RAPIDO | UX | Adicionar `aria-label` aos headings do footer. |
| C19 | Tabelas cookies/privacidade sem `overflow-x` em mobile | MELHORIA | RAPIDO | UX | Envolver tabelas em `<div class="overflow-x-auto">`. |
| C20 | Blog article JSON-LD sem autor especifico | MELHORIA | RAPIDO | UX | Adicionar campo `author` ao JSON-LD dos artigos. |
| C21 | Migration changelog nao documentado | MELHORIA | RAPIDO | DATA | Criar ficheiro `CHANGELOG.md` para migrations. |

---

## Metricas de Impacto Estimado

| Metrica | Antes (estimado) | Depois (estimado) | Achados |
|---------|-------------------|--------------------| --------|
| JS Bundle | ~350 KB | ~250 KB | A10, B7, B8, C6 |
| Imagens | 151 MB | ~15 MB | A9 |
| LCP (Velask) | 2-3s | < 1.5s | A9, B10 |
| Vulnerabilidades criticas | 5 | 0 | A1-A4, A5 |
| Build safety | Nenhuma | TS + ESLint ativos | A6 |

---

## Dependencias entre Achados

- **A6 desbloqueia C11** — so faz sentido tipar `any` depois de ativar TypeScript strict.
- **B12 cobre parcialmente C16** — consolidar Supabase clients resolve ambos.
- **A1 + A2** devem ser feitos juntos — ambos envolvem auth/RLS no Supabase.
- **B13 depende de B12** — padronizar fetching apos consolidar clients.

---

## Ordem de Execucao Recomendada (Fase A)

1. A1 + A2 (RLS + admin auth) — risco maximo, resolver primeiro
2. A3 + A4 (CORS + rate limit) — complementam seguranca
3. A6 (TS/ESLint) — expoe erros escondidos para o resto
4. A11 + A12 (limpeza rapida)
5. A5 (stub data)
6. A9 + A10 (performance)
7. A7 + A8 (schema + N+1)
