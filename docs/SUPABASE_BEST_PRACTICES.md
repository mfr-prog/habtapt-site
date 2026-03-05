# Boas Práticas - Supabase Integration

## ✅ Arquitetura Implementada

### 1. Configuração Centralizada
Toda a configuração do Supabase está centralizada em:
- `/utils/supabase/info.tsx` - Credenciais (gerado automaticamente)
- `/utils/supabase/client.ts` - Cliente e helpers

### 2. Helper Seguro: `supabaseFetch`

**✅ SEMPRE USE:**
```typescript
import { supabaseFetch } from '../utils/supabase/client';

// GET request
const response = await supabaseFetch('projects');

// POST request
const response = await supabaseFetch('newsletter', {
  method: 'POST',
  body: JSON.stringify({ email }),
});

// DELETE request
const response = await supabaseFetch(`projects/${id}`, {
  method: 'DELETE',
});
```

**❌ NUNCA FAÇA:**
```typescript
// ❌ Não use variáveis de ambiente diretamente
const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

// ❌ Não construa URLs manualmente
const url = `https://${projectId}.supabase.co/functions/v1/...`;

// ❌ Não adicione headers manualmente
fetch(url, {
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
  }
});
```

## 🔒 Validação de Segurança

O arquivo `/utils/supabase/client.ts` já contém:

1. **Validação automática** de credenciais no carregamento
2. **Logs detalhados** para debugging
3. **Error handling** padronizado
4. **Type safety** com TypeScript

## 📝 Como Adicionar Novas Chamadas API

### Exemplo: Nova rota de insights

```typescript
// 1. Import o helper
import { supabaseFetch } from '../utils/supabase/client';

// 2. Use em uma função async
const fetchInsights = async () => {
  try {
    const response = await supabaseFetch('insights');
    
    if (!response.ok) {
      throw new Error('Erro ao buscar insights');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
};
```

## 🛡️ Error Boundary

O projeto tem um `ErrorBoundary` component em `/components/ErrorBoundary.tsx`:

- Captura erros de renderização
- Mostra UI amigável ao usuário
- Exibe detalhes técnicos em desenvolvimento
- Oferece opções de recuperação

## 🔍 Debugging

### Logs Automáticos
O `supabaseFetch` já loga automaticamente:
```
[Supabase Fetch] GET https://xxx.supabase.co/functions/v1/make-server-4b2936bc/projects
[Supabase Fetch] Response status: 200
```

### Verificar Configuração
```typescript
import { supabaseConfig } from '../utils/supabase/client';

console.log('Supabase Config:', {
  projectId: supabaseConfig.projectId,
  url: supabaseConfig.url,
  // NÃO logue a chave em produção
});
```

## 📋 Checklist antes de Commit

- [ ] Usei `supabaseFetch` em vez de `fetch` manual?
- [ ] Não acessei `import.meta.env` diretamente?
- [ ] Não construí URLs manualmente?
- [ ] Adicionei tratamento de erros adequado?
- [ ] Testei em desenvolvimento antes do commit?

## 🚨 Troubleshooting

### Erro: "Cannot read properties of undefined"
**Causa**: Tentando acessar variáveis de ambiente diretamente  
**Solução**: Use `supabaseFetch` ou `supabaseConfig`

### Erro: "ERR_NAME_NOT_RESOLVED"
**Causa**: URL malformada (falta projectId)  
**Solução**: Verifique se está usando `supabaseFetch` corretamente

### Erro: "Failed to fetch"
**Causa**: Servidor offline ou CORS  
**Solução**: Verifique logs do servidor e configuração CORS

## 🔄 Migration de Código Legado

Se encontrar código antigo, atualize assim:

```typescript
// ANTES ❌
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-4b2936bc/endpoint`,
  {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  }
);

// DEPOIS ✅
const response = await supabaseFetch('endpoint');
```

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Error Handling Best Practices](https://kentcdodds.com/blog/use-error-boundary)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Última atualização**: 2024-11-03  
**Mantido por**: Equipe HABTA
