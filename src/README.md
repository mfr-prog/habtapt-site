# HABTA - Real Estate Intelligence

## 🏢 Sobre

HABTA é uma empresa portuguesa de reabilitação urbana e investimento imobiliário inteligente. Transformamos património urbano em oportunidades rentáveis através de análise financeira, reabilitação sustentável e design premium.

## ⚡ Performance

**Site otimizado para máxima velocidade:**
- ✅ Initial Load: < 1.5s (70% faster)
- ✅ Cache inteligente (5 min TTL)
- ✅ Skeleton loading states
- ✅ Lazy loading de imagens
- ✅ React.memo() + useMemo()
- ✅ Lighthouse Score: 90+

📊 Ver detalhes: [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)  
🔍 Como testar: [PERFORMANCE_MONITORING.md](./PERFORMANCE_MONITORING.md)

## 🎯 Proposta de Valor

- **Metodologia validada**: Processo testado e comprovado
- **Análise técnica + design**: Dados e estética em harmonia
- **Gestão completa**: Do investimento ao retorno
- **ROI médio 30%**: Retorno anualizado consistente
- **100% transparência**: Clareza total em cada etapa

## 📐 Estrutura do Site

### 1. Hero Section
- Headline impactante sobre transformação de património
- Sub-headline destacando análise financeira + reabilitação + design
- CTAs: "Ver nossos projetos" e "Agendar consultoria"
- Indicadores-chave: 10+ projetos, ROI 30%, 100% transparência
- Badge: "Real Estate Intelligence"
- Diferenciais rápidos (3 cards)

### 2. Serviços - "Do Investimento ao Lucro"
**Compra Estratégica**
- Análise de mercado e comparáveis
- Due diligence técnica e jurídica
- Negociação e aquisição otimizada
- Projeção de ROI validada

**Reforma Premium**
- Design arquitetônico contemporâneo
- Materiais de alta qualidade
- Gestão total de obra e prazos
- Certificações de sustentabilidade

**Venda Otimizada**
- Posicionamento de mercado estratégico
- Home staging e fotografia premium
- Marketing multicanal integrado
- Distribuição transparente de lucros

### 3. Processo - 7 Etapas Estruturadas
1. **Prospecção**: Identificação com inteligência de dados
2. **Avaliação**: Due diligence completa + projeção ROI
3. **Aquisição**: Negociação estratégica
4. **Reforma**: Execução premium com gestão
5. **Marketing**: Campanha 360° + home staging
6. **Venda**: Comercialização otimizada
7. **Distribuição de Lucros**: Transparência total

### 4. Portfólio
**Filtros**: Todos | Em Análise | Em Reforma | Concluídos

**Cards incluem**:
- Foto/render de alta qualidade
- ROI % destacado
- Localização (Lisboa, Cascais, Porto)
- m², quartos, banheiros
- Investimento vs Valor Final
- Timeline do projeto
- Status visual (badge colorido)

### 5. Depoimentos
- **Investidores**: Histórias de ROI real
- **Proprietários**: Experiências de venda otimizada
- **Parceiros**: Casos de parceria estratégica
- +150 clientes satisfeitos
- Logos de parceiros e certificações

### 6. Contato
**Formulário completo**:
- Nome completo
- Email
- Telefone
- Interesse (dropdown): Investir | Vender Propriedade | Parceria Estratégica | Outro
- Mensagem

**Informações laterais**:
- 📧 contato@habta.pt
- ☎️ +351 (a definir)
- 📍 Lisboa / Cascais, Portugal
- 🕘 Segunda a Sexta, 9h–18h

**CTA Card**: Benefícios de consultoria gratuita

## 🎨 Design System

### Cores
```css
/* Primary - Azul Petróleo */
--primary: #1A3E5C
--primary-hover: #142f47
--primary-light: #234d6f

/* Secondary - Verde Acinzentado */
--secondary: #4C7766
--secondary-hover: #3d6052
--secondary-light: #5a8874

/* Accent - Cinza Claro */
--accent: #F5F6F8
--muted: #F5F6F8

/* Text */
--foreground: #0f1729
--muted-foreground: #64748b
```

### Tipografia
- Font: **Inter** (system)
- Fluid typography com `clamp()`
- Headings: 900 weight, tracking -0.02em
- Body: 400 weight, line-height 1.7

### Componentes
- Botões com gradientes
- Cards com hover effects (y: -8, scale: 1.02)
- Bordas arredondadas (rounded-3xl predominante)
- Sombras suaves e em camadas
- Glass effects com backdrop-blur

### Animações
- Motion/Framer Motion para todas as transições
- Stagger animations em grids
- Scroll-triggered reveals
- Micro-interações em hover/tap
- Pulse effects em badges

## 🚀 Funcionalidades

### ✅ Implementado
- [x] Design responsivo mobile-first
- [x] Animações suaves com Motion
- [x] Skeleton loaders realistas
- [x] Filtros de portfólio com transições
- [x] Formulário de contato funcional
- [x] WhatsApp flutuante com tooltip
- [x] Navegação smooth scroll
- [x] Toast notifications
- [x] SEO-friendly structure
- [x] Logos SVG importados
- [x] Sistema de ícones centralizado (lucide-react)

### 🔮 Futuro
- [ ] Blog/Insights para SEO e autoridade
- [ ] Integração com Typeform/Make/Airtable
- [ ] Sistema de CRM para leads
- [ ] Dashboard de investidores
- [ ] Calculadora de ROI interativa
- [ ] Tour virtual 360° de propriedades

## 📱 Features Especiais

### WhatsApp Button
- Aparece após scroll de 300px
- Animação de pulso
- Tooltip no hover
- Link direto para WhatsApp com mensagem pré-preenchida

### Sistema de Filtros (Portfolio)
- Animações de transição suaves
- Estados visuais claros
- Badges coloridos por status
- Empty state elegante

### Formulário Inteligente
- Validação em tempo real
- Loading states
- Toast de confirmação
- Dropdown de interesses categorizados

## 🏗️ Arquitetura

```
/
├── components/
│   ├── Hero.tsx              # Seção principal
│   ├── Services.tsx          # 3 serviços principais
│   ├── Process.tsx           # 7 etapas do processo
│   ├── Portfolio.tsx         # Projetos com filtros
│   ├── Testimonials.tsx      # Depoimentos + stats
│   ├── Contact.tsx           # Formulário completo
│   ├── Header.tsx            # Navegação responsiva
│   ├── Footer.tsx            # Links + sociais
│   ├── WhatsAppButton.tsx    # Botão flutuante
│   ├── Logo.tsx              # Componente de logo
│   ├── icons.tsx             # Sistema centralizado
│   └── ui/                   # Primitivos Shadcn
├── imports/
│   ├── LogoWhite.tsx         # Logo para fundos escuros
│   ├── LogoBlack.tsx         # Logo para fundos claros
│   └── svg-*.ts              # Paths SVG
├── styles/
│   └── globals.css           # Tokens + utilities
└── App.tsx                   # Entry point
```

## 🎯 Tom de Comunicação

**Elegante • Estratégico • Confiante**

O site comunica como uma **boutique de investimento imobiliário**, não como uma imobiliária tradicional.

- Nada genérico
- Cada palavra comunica precisão e valor
- Foco em ROI e resultados financeiros
- Transparência como diferencial
- Expertise técnica + visão de design

## 📊 Métricas de Sucesso

- **10+ projetos** em execução
- **30% ROI** médio anualizado
- **100% transparência** financeira
- **€12M+** volume investido
- **45+ projetos** concluídos
- **98% satisfação** dos clientes
- **+150 parceiros** satisfeitos

## 🌿 Sustentabilidade

- Certificações de sustentabilidade
- Reabilitação urbana consciente
- Materiais certificados
- Eficiência energética

## 📞 Contato

- **Email**: contato@habta.pt
- **Localização**: Lisboa / Cascais, Portugal
- **Horário**: Segunda a Sexta, 9h–18h

## 🛠️ Stack Tecnológico

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Modern icons
- **Sonner** - Toast notifications
- **Vite** - Build tool

## 📝 Licença

© 2024 HABTA. Todos os direitos reservados.

---

**HABTA** - Every Home, Productized.
*Transformando património urbano em oportunidades rentáveis.*
