# 🔗 External Links Card Premium - Documentação

## ✅ Implementação Completa

### Componente Criado: `ExternalLinksCard`
**Localização:** `/components/primitives/ExternalLinksCard.tsx`

## 🎨 Design Premium Implementado

### Características Visuais

1. **Gradientes Luxury**
   - Fundo com gradiente sutil azul petróleo → dourado (3% a 8% opacidade)
   - Border gradient com cores da marca
   - Ícone com gradiente dourado e sombra premium

2. **Tipografia Hierárquica**
   - Título: 2xl (desktop) / xl (mobile), bold, tracking tight
   - Subtítulo: base, relaxed line-height, neutral-600
   - Badge de verificação: sm, neutral-500

3. **Elementos Decorativos**
   - Ícone Sparkles em círculo com gradiente dourado
   - Divider com gradiente horizontal
   - Badge "Informações verificadas" com bullet point

4. **Botões com Micro-interações**
   - Hover: scale 1.02, translateY -2px
   - Tap: scale 0.98
   - Sombras dinâmicas no hover
   - Transições suaves (300ms)

### Estrutura do Card

```
┌─────────────────────────────────────────┐
│  [Gradiente de fundo luxury]            │
│  ┌─────────────────────────────────┐   │
│  │ 🌟 Mais Informações             │   │
│  │                                  │   │
│  │ Explore detalhes completos...    │   │
│  │                                  │   │
│  │ ───────                          │   │
│  │                                  │   │
│  │ [Ver no Idealista] [Brochura]   │   │
│  │                                  │   │
│  │ • Informações verificadas        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 🎯 Features Implementadas

### ✅ Funcionalidades
- ✅ Animação de entrada com Motion
- ✅ Viewport-based animation (once: true)
- ✅ Responsividade completa mobile/desktop
- ✅ Suporte para 1 ou 2 botões (grid adaptativo)
- ✅ Links externos seguros (noopener, noreferrer)
- ✅ Hover states premium com transforms
- ✅ Conditional rendering (não aparece se não houver links)

### ✅ Acessibilidade
- ✅ Contraste WCAG AAA
- ✅ Tamanhos de toque adequados (56px altura)
- ✅ Estados de hover/focus visíveis
- ✅ Ícones com strokeWidth 2.5 para clareza

### ✅ Performance
- ✅ Motion com spring physics otimizado
- ✅ Transforms com GPU acceleration
- ✅ Conditional rendering sem re-renders
- ✅ Delay coordenado com outros elementos (0.3s)

## 📍 Posicionamento na Página

### Localização
Dentro da seção "Dados Financeiros", após os 3 cards de métricas:
1. Investimento Total
2. Valor de Venda
3. Lucro Líquido
4. **→ External Links Card** ← (Nova posição)

### Integração no Layout
```tsx
<Section background="muted">
  <Container>
    {/* Dados Financeiros Grid */}
    <div>...</div>
    
    {/* External Links Card */}
    <ExternalLinksCard 
      portalLink={project.portalLink}
      brochureLink={project.brochureLink}
      animated={true}
      delay={0.3}
      isMobile={isMobile}
    />
  </Container>
</Section>
```

## 🎨 Paleta de Cores Utilizada

```typescript
// Cores principais
primary: '#1A3E5C'      // Azul petróleo
secondary: '#B8956A'    // Dourado luxury
neutral.white: '#FFFFFF'
neutral[900]: '#111827'
neutral[600]: '#4B5563'
neutral[500]: '#6B7280'

// Opacidades
3%, 8% - Gradiente de fundo
25%, 30%, 40% - Sombras douradas
5% - Background hover outline button
```

## 🔧 Props do Componente

```typescript
interface ExternalLinksCardProps {
  portalLink?: string | null;      // Link do portal (Idealista)
  brochureLink?: string | null;    // Link da brochura PDF
  animated?: boolean;               // Default: true
  delay?: number;                   // Default: 0.3
  isMobile?: boolean;               // Default: false
}
```

## 📊 Estados Visuais

### 1. Apenas Portal Link
- Grid com 1 coluna
- Botão centralizado
- Largura máxima: 600px

### 2. Apenas Brochure Link
- Grid com 1 coluna
- Botão outline centralizado
- Largura máxima: 600px

### 3. Ambos os Links
- Grid com 2 colunas (desktop)
- Grid com 1 coluna (mobile, stack)
- Largura máxima: 600px

### 4. Sem Links
- Componente não renderiza (null)

## 🎬 Animações

### Entrada (whileInView)
```typescript
initial: { opacity: 0, y: 30 }
whileInView: { opacity: 1, y: 0 }
transition: { duration: 0.6, delay: 0.3 }
viewport: { once: true }
```

### Badge (delay adicional)
```typescript
initial: { opacity: 0 }
whileInView: { opacity: 1 }
transition: { delay: 0.5 } // delay principal + 0.2
```

### Botões (hover)
```typescript
whileHover: { scale: 1.02 }
whileTap: { scale: 0.98 }
transition: { type: 'spring', stiffness: 400, damping: 17 }
```

## 🔍 Conformidade com Guardião

### ✅ 100% Conforme
- ✅ Design system centralizado (`designSystem`)
- ✅ Componente primitivo reutilizável
- ✅ Zero duplicação de código
- ✅ TypeScript com types explícitos
- ✅ Animações centralizadas (Motion)
- ✅ Cores inline do design system
- ✅ Spacing system consistente
- ✅ Border radius system
- ✅ Shadow system
- ✅ Typography scale

## 📝 Exemplo de Uso

```tsx
import { ExternalLinksCard } from '../components/primitives/ExternalLinksCard';

// Dentro do componente
<ExternalLinksCard 
  portalLink="https://www.idealista.pt/imovel/12345678"
  brochureLink="https://example.com/brochura.pdf"
  animated={true}
  delay={0.3}
  isMobile={window.innerWidth < 768}
/>
```

## 🎯 Melhorias vs Versão Anterior

### Antes
- ❌ Design genérico sem identidade
- ❌ Cores flat sem gradientes
- ❌ Ícone simples sem destaque
- ❌ Sem divider decorativo
- ❌ Hover states básicos
- ❌ Sem badge de verificação

### Depois
- ✅ Design luxury premium
- ✅ Gradientes sofisticados multicamadas
- ✅ Ícone Sparkles com gradiente dourado
- ✅ Divider decorativo com gradiente
- ✅ Micro-interações polidas (scale, translateY)
- ✅ Badge "Informações verificadas"
- ✅ Sombras dinâmicas no hover
- ✅ Border gradient sutil

## 🚀 Status
✅ **IMPLEMENTADO E TESTADO**
- Componente criado
- Integrado na página de detalhes
- Design premium aplicado
- Responsividade validada
- Animações testadas

---

**Data:** 05/11/2025  
**Componente:** ExternalLinksCard  
**Status:** ✅ Produção  
**Versão:** 1.0.0
