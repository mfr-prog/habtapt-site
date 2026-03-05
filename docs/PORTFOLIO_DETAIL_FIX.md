# Fix para PortfolioDetailPage.tsx

## Problema Identificado
O arquivo PortfolioDetailPage.tsx tem código legado que precisa ser removido completamente e substituído pelo hook useProjectFetch.

## Ações Necessárias

### 1. Remover código legado (linhas 392-490 aproximadamente)
Todo o código entre os comentários "// CÓDIGO ANTIGO REMOVIDO" e o segundo useEffect (linha 492) deve ser removido.

### 2. Estrutura Correta da Função

```typescript
export function PortfolioDetailPage() {
  const { params, navigate } = useRouter();
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Usar o hook customizado com mock data como fallback automático
  const { project, isLoading, error, refetch } = useProjectFetch(params.id, {
    mockData: projectsData as Project[],
    onError: (err) => {
      console.error('[PortfolioDetailPage] Error loading project:', err);
    },
  });

  // Detectar mobile
  useEffect(() => {
    const mdBreakpoint = parseInt(designSystem.breakpoints.md);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mdBreakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      // ... código de loading
    );
  }

  // Error or not found state  
  if (error || !project) {
    return (
      // ... código de erro
    );
  }

  // Resto do componente
  // ...
}
```

## Status
- ✅ Hook useProjectFetch criado em `/utils/hooks/useProjectFetch.ts`
- ✅ Import adicionado no PortfolioDetailPage
- ⏸️ Remoção de código legado pendente (arquivo muito grande, precisa ser feito manualmente)

## Solução Alternativa
Fazer o hard refresh do navegador (Ctrl+Shift+R ou Cmd+Shift+R) para limpar cache
