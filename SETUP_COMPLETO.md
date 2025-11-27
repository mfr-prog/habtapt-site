# ✅ Setup Completo - HABTA Site

## 🎉 O que está funcionando

### Frontend (Cloudflare Pages)
- ✅ Site no ar: https://habtapt-site.pages.dev/
- ✅ Formulário de newsletter funcionando
- ✅ Formulário de contato funcionando
- ✅ Agendamento de reunião (leads) funcionando
- ✅ Painel admin com autenticação

### Backend (Supabase Edge Functions)
Todas deployadas em: https://supabase.com/dashboard/project/qasiruoxclggeromagiw/functions

1. **newsletter** - POST para cadastrar emails
2. **subscribers** - GET/DELETE para gerenciar newsletter
3. **contact** - POST para formulário de contato
4. **contacts** - GET/POST/PATCH/DELETE para gerenciar contatos
5. **leads** - POST para agendamento de reunião
6. **projects** - GET/POST/PATCH/DELETE para portfólio
7. **insights** - GET/POST/PATCH/DELETE para blog
8. **testimonials** - GET/POST/PATCH/DELETE para depoimentos

### Tabelas no Supabase
- ✅ `newsletter_subscribers` (emails da newsletter)
- ✅ `contacts` (contatos + leads com pipeline)
- ✅ `projects` (portfólio)
- ✅ `insights` (blog)
- ✅ `testimonials` (depoimentos)

## 📋 Como usar o painel admin

### Acessar
1. Vá em: https://habtapt-site.pages.dev/#login
2. Faça login (credenciais do sistema)
3. Acesse: https://habtapt-site.pages.dev/#admin

### Funcionalidades

#### Newsletter (Subscribers)
- ✅ Ver todos os emails cadastrados
- ✅ Deletar subscribers
- ✅ Exportar lista

#### Contatos
- ✅ Ver mensagens enviadas pelo formulário
- ✅ Marcar como atendido
- ✅ Ver detalhes completos (nome, email, telefone, mensagem)

#### Leads (Pipeline)
- ✅ Ver interessados em imóveis
- ✅ Mover entre estágios do funil
- ✅ Adicionar notas e preferências
- ✅ Qualificar leads

#### Projetos
- ✅ Criar novos projetos
- ✅ Editar projetos existentes
- ✅ Deletar projetos
- ✅ Publicar/despublicar
- ✅ Upload de imagens

#### Insights (Blog)
- ✅ Criar artigos
- ✅ Editar artigos
- ✅ Deletar artigos
- ✅ Publicar/despublicar

#### Depoimentos
- ✅ Criar depoimentos
- ✅ Editar depoimentos
- ✅ Deletar depoimentos
- ✅ Publicar/despublicar

## 🔧 Variáveis de ambiente

### Cloudflare Pages (Production)
```
NEXT_PUBLIC_SUPABASE_URL=https://qasiruoxclggeromagiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhc2lydW94Y2xnZ2Vyb21hZ2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDQ0ODIsImV4cCI6MjA3OTgyMDQ4Mn0.YjzTlI6UO_hWHvIPxU9u7GLdBZq0GHHtAVQrve0qGpA
```

### Supabase Functions (Secrets)
```
PROJECT_URL=https://qasiruoxclggeromagiw.supabase.co
SERVICE_ROLE_KEY=sb_secret_voMRChGPzjwCthubWLQOLw_NdI6u02b
```

## 🚀 Deploy

### Frontend (automático)
```bash
git push origin main
```

### Backend (Supabase Functions)
```bash
export SUPABASE_PROJECT_REF="qasiruoxclggeromagiw"
npm run supabase:deploy:functions
```

## 📊 Estrutura das tabelas

### newsletter_subscribers
- id (UUID)
- email (TEXT, UNIQUE)
- name (TEXT, opcional)
- subscribed_at (TIMESTAMPTZ)

### contacts
- id (UUID)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- interest (TEXT)
- message (TEXT)
- created_at (TIMESTAMPTZ)
- pipeline_stage (TEXT) - para leads
- desired_locations (TEXT[])
- max_budget (TEXT)
- typology (TEXT)
- notes (TEXT)

### projects
- id (UUID)
- title (TEXT)
- description (TEXT)
- image_url (TEXT)
- category (TEXT)
- location (TEXT)
- area (TEXT)
- status (TEXT)
- year (INTEGER)
- client (TEXT)
- images (TEXT[])
- features (TEXT[])
- published (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)

### insights
- id (UUID)
- title (TEXT)
- summary (TEXT)
- content (TEXT)
- category (TEXT)
- image_url (TEXT)
- author (TEXT)
- published (BOOLEAN)
- views (INTEGER)
- created_at, updated_at (TIMESTAMPTZ)

### testimonials
- id (UUID)
- name (TEXT)
- role (TEXT)
- company (TEXT)
- text (TEXT)
- rating (INTEGER 1-5)
- image_url (TEXT)
- published (BOOLEAN)
- created_at (TIMESTAMPTZ)

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Service Role Key apenas nas Edge Functions (server-side)
- ✅ Anon Key apenas no frontend (client-side)
- ✅ CORS configurado corretamente
- ✅ Validação de JWT desabilitada para funções públicas

## ✨ Próximos passos

1. **Cadastrar conteúdo** pelo painel admin:
   - Adicionar projetos do portfólio
   - Escrever insights/artigos
   - Adicionar depoimentos de clientes

2. **Testar fluxo completo:**
   - Formulário de newsletter
   - Formulário de contato
   - Agendamento de reunião em projetos
   - Visualização no site público

3. **Monitorar:**
   - Novos contatos/leads no painel
   - Subscribers da newsletter
   - Analytics (se configurado)

