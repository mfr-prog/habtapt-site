# 🔍 Debug: Upload de Imagem Fechando Modal

## 🐛 Problema Relatado

Quando o usuário tenta trocar uma imagem usando o componente `ImageUpload`, após selecionar a imagem, o modal fecha inesperadamente.

## 🛠️ Correções Aplicadas

### 1. **Propagação de Eventos - ImageUpload.tsx**

Adicionado `stopPropagation()` e `preventDefault()` em todos os handlers de eventos:

```tsx
// Handler principal de seleção de arquivo
const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();        // ✅ Previne comportamento default
  e.stopPropagation();       // ✅ Para propagação do evento
  
  const file = e.target.files?.[0];
  // ... resto do código
};

// Handler de click para abrir file selector
const handleClick = (e?: React.MouseEvent) => {
  e?.preventDefault();       // ✅ Previne comportamento default
  e?.stopPropagation();      // ✅ Para propagação do evento
  fileInputRef.current?.click();
};

// Handler de remover imagem
const handleRemove = (e?: React.MouseEvent) => {
  e?.preventDefault();       // ✅ Previne comportamento default
  e?.stopPropagation();      // ✅ Para propagação do evento
  setPreview(null);
  onChange('');
  // ...
};
```

### 2. **Input File com stopPropagation**

```tsx
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleFileSelect}
  onClick={(e) => e.stopPropagation()}  // ✅ Adicionado
  disabled={disabled || isUploading}
  style={{ display: 'none' }}
/>
```

### 3. **Botão "Trocar Imagem"**

```tsx
<AnimatedButton
  onClick={(e) => handleClick(e)}  // ✅ Passa evento para handler
  disabled={isUploading}
  variant="secondary"
  icon={Upload}
>
  {isUploading ? 'Enviando...' : 'Trocar Imagem'}
</AnimatedButton>
```

### 4. **Logs de Debug Adicionados**

**ImageUpload.tsx:**
```tsx
console.log('[ImageUpload] File selected:', file.name, file.type, file.size);
console.log('[ImageUpload] Starting upload to bucket:', bucket);
console.log('[ImageUpload] Preview set');
console.log('[ImageUpload] Upload response:', data);
console.log('[ImageUpload] Calling onChange with URL:', data.url);
```

**TestimonialsManager.tsx:**
```tsx
console.log('[TestimonialsManager] Closing modal');
console.log('[TestimonialsManager] Image uploaded, URL:', url);
```

---

## 🔬 Como Diagnosticar

### Passos para Testar:

1. **Abrir o Console do Browser** (F12)
2. **Ir para o Admin Panel** → Depoimentos
3. **Clicar em "Novo Depoimento"**
4. **Clicar na área de upload ou no botão "Trocar Imagem"**
5. **Selecionar uma imagem**
6. **Observar os logs no console:**

```
[ImageUpload] File selected: foto.jpg image/jpeg 245678
[ImageUpload] Starting upload to bucket: testimonials
[ImageUpload] Preview set
[ImageUpload] Upload response: { url: "https://..." }
[ImageUpload] Calling onChange with URL: https://...
[TestimonialsManager] Image uploaded, URL: https://...
```

### ❌ Se o Modal Fechar, Procurar por:

1. **Log de "Closing modal"** - Indica que `handleCloseModal()` foi chamado
2. **Erros de upload** - Indicam problema na comunicação com o servidor
3. **Eventos não parados** - Click propagando para o backdrop

---

## 🎯 Possíveis Causas Restantes

Se o problema persistir após as correções acima, verificar:

### 1. **Modal Backdrop Click**
```tsx
// Verificar se o backdrop está com onClick correto
<motion.div
  onClick={handleCloseModal}  // ← Isso fecha o modal
  style={{ position: 'fixed', zIndex: 999998 }}
/>
```

**Solução:** O modal principal deve ter `onClick={(e) => e.stopPropagation()}` ✅

### 2. **React Portal**
O modal está sendo renderizado via Portal no `document.body`, o que garante:
- ✅ Escape da hierarquia do AdminLayout
- ✅ Z-index funciona corretamente
- ✅ Eventos não conflitam com containers pais

### 3. **AnimatePresence**
O componente está envolvido em AnimatePresence, que gerencia a animação de saída.
Se `isModalOpen` mudar para `false`, o modal será animado para fora.

**Verificar:**
```tsx
{typeof document !== 'undefined' && createPortal(
  <AnimatePresence>
    {isModalOpen && (  // ← Se isto vira false, modal fecha
      // ... modal content
    )}
  </AnimatePresence>,
  document.body
)}
```

### 4. **Estado formData**
Quando `onChange` é chamado:
```tsx
onChange={(url) => {
  console.log('[TestimonialsManager] Image uploaded, URL:', url);
  setFormData({ ...formData, image: url });  // ← Re-render
}}
```

Este `setFormData` causa um re-render, mas **NÃO deveria fechar o modal**.

**Verificar se:**
- `isModalOpen` está no estado local do componente ✅
- Não há useEffect que fecha o modal baseado em formData ✅

---

## 🧪 Testes de Validação

### Teste 1: Click no Backdrop Fecha?
- ✅ Deveria fechar (comportamento esperado)

### Teste 2: Click no Modal Fecha?
- ❌ NÃO deveria fechar (stopPropagation ativo)

### Teste 3: Upload de Imagem Fecha?
- ❌ NÃO deveria fechar (foco do problema)

### Teste 4: Botão "Trocar Imagem" Fecha?
- ❌ NÃO deveria fechar (stopPropagation adicionado)

### Teste 5: Botão X Fecha?
- ✅ Deveria fechar (comportamento esperado)

---

## 📊 Fluxo Esperado

```
1. Usuário clica em "Trocar Imagem"
   ↓
2. handleClick(e) é chamado
   - e.preventDefault() ✅
   - e.stopPropagation() ✅
   - fileInputRef.current.click() ✅
   ↓
3. File dialog abre
   ↓
4. Usuário seleciona imagem
   ↓
5. handleFileSelect(e) é chamado
   - e.preventDefault() ✅
   - e.stopPropagation() ✅
   - Validações ✅
   - Preview local ✅
   - Upload para servidor ✅
   ↓
6. Upload completa
   ↓
7. onChange(url) é chamado
   - setFormData({ ...formData, image: url }) ✅
   ↓
8. Re-render do componente
   ↓
9. Modal permanece aberto ✅
```

---

## 🚨 Se o Problema Persistir

### Verificar no Console:

1. **Logs aparecem na ordem correta?**
2. **Há algum erro entre os logs?**
3. **O log "Closing modal" aparece inesperadamente?**
4. **O upload retorna URL válida?**

### Próximos Passos:

1. **Adicionar mais logs:**
   ```tsx
   useEffect(() => {
     console.log('[TestimonialsManager] isModalOpen changed:', isModalOpen);
   }, [isModalOpen]);
   ```

2. **Verificar se há listeners globais:**
   - ESC key listener?
   - Click outside listener?
   - Router changes?

3. **Testar em outros gerenciadores:**
   - InsightsManager tem o mesmo problema?
   - ProjectsManager funciona?

---

## ✅ Status Atual

| Componente | stopPropagation | preventDefault | Logs | Portal |
|------------|----------------|----------------|------|--------|
| ImageUpload | ✅ | ✅ | ✅ | N/A |
| TestimonialsManager | ✅ | N/A | ✅ | ✅ |
| Modal Backdrop | ✅ | N/A | N/A | ✅ |
| AnimatedButton | ✅ | N/A | N/A | N/A |

---

## 📝 Notas Técnicas

### React Portal
```tsx
import { createPortal } from 'react-dom';

{typeof document !== 'undefined' && createPortal(
  <Content />,
  document.body
)}
```

**Vantagens:**
- Modal renderizado fora da hierarquia
- Z-index absoluto
- Eventos isolados

### Event Propagation
```
User Click
   ↓
Button (stopPropagation ✅)
   ↓ (stopped)
Modal Container (stopPropagation ✅)
   ↓ (stopped)
Backdrop (onClick: handleCloseModal) ← Não recebe o evento!
```

---

## 🎯 Conclusão

As correções aplicadas devem resolver o problema de propagação de eventos. Se o modal ainda estiver fechando, os logs no console vão indicar exatamente onde o `handleCloseModal` está sendo chamado.

**Próximo passo:** Testar e observar os logs para identificar a causa raiz.
