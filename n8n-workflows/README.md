# 📅 N8N Workflows para Agendamento HABTA

## 🚀 Como importar os workflows

### 1. Acesse seu N8N:
https://mferro.app.n8n.cloud/home/workflows

### 2. Importe cada workflow:

#### **Workflow 1: Calendar Available Slots**
1. Clique em **"Add workflow"** → **"Import from File"**
2. Selecione: `1-calendar-available-slots.json`
3. **Configure a credencial do Google Calendar:**
   - Clique no node "Google Calendar - Get Busy Times"
   - Em "Credential to connect with", clique em "Create New"
   - Siga o fluxo OAuth do Google
   - Selecione seu calendário principal
4. **Ative o workflow** (toggle no canto superior direito)
5. **Copie a URL do webhook** (aparece no node "Webhook")
   - Exemplo: `https://mferro.app.n8n.cloud/webhook/abc123...`

#### **Workflow 2: Schedule Meeting**
1. Clique em **"Add workflow"** → **"Import from File"**
2. Selecione: `2-schedule-meeting.json`
3. **Use a mesma credencial** do Google Calendar (workflow 1)
4. **Ative o workflow**
5. **Copie a URL do webhook**

---

## 📝 URLs que você precisa me enviar:

Depois de importar e ativar os 2 workflows, me envie:

```
WEBHOOK_CALENDAR_SLOTS=https://mferro.app.n8n.cloud/webhook/...
WEBHOOK_SCHEDULE_MEETING=https://mferro.app.n8n.cloud/webhook/...
```

---

## ⚙️ Configurações personalizáveis

### No Workflow 1 (Available Slots):

No node "Generate Available Slots", você pode ajustar:

```javascript
const workHours = { start: 9, end: 18 }; // Horário de trabalho
const slotDuration = 60; // Duração da reunião (minutos)
const workDays = [1, 2, 3, 4, 5]; // Dias úteis (0=Dom, 6=Sáb)
const breakTime = { start: 13, end: 14 }; // Horário de almoço
```

### No Workflow 2 (Schedule Meeting):

No node "Google Calendar - Create Event":
- **Summary:** Título do evento
- **Description:** Detalhes do cliente
- **Send Updates:** `all` (envia email para você e cliente)
- **Conference Data:** `hangoutsMeet` (cria link do Google Meet automaticamente)

---

## 🧪 Testar os workflows:

### Teste 1: Buscar slots disponíveis
```bash
curl "https://SEU_WEBHOOK_URL/calendar-slots?startDate=2025-11-28&endDate=2025-12-05"
```

Deve retornar:
```json
{
  "slots": [
    {
      "start": "2025-11-28T09:00:00.000Z",
      "end": "2025-11-28T10:00:00.000Z",
      "date": "2025-11-28",
      "time": "09:00",
      "label": "qui, 28 nov às 09:00"
    },
    ...
  ],
  "count": 45
}
```

### Teste 2: Agendar reunião
```bash
curl -X POST "https://SEU_WEBHOOK_URL/schedule-meeting" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@exemplo.com",
    "phone": "+351912345678",
    "interest": "Investimento",
    "message": "Teste de agendamento",
    "startTime": "2025-11-28T10:00:00.000Z",
    "endTime": "2025-11-28T11:00:00.000Z",
    "sourceTitle": "Projeto Chiado"
  }'
```

Deve retornar:
```json
{
  "ok": true,
  "eventId": "abc123...",
  "eventLink": "https://calendar.google.com/...",
  "meetLink": "https://meet.google.com/...",
  "message": "Reunião agendada com sucesso!"
}
```

---

## 🔒 Segurança:

Os webhooks do N8N são públicos, mas:
- ✅ Só você tem acesso ao N8N para ver/editar workflows
- ✅ Google Calendar API requer OAuth (já autenticado)
- ✅ Dados sensíveis (email, telefone) são enviados via HTTPS
- ✅ Você pode adicionar autenticação básica nos webhooks se quiser

---

## 📊 Próximos passos:

1. Importe os 2 workflows
2. Configure Google Calendar OAuth
3. Ative os workflows
4. Me envie as 2 URLs dos webhooks
5. Eu crio a Supabase Function e o modal no frontend

🎉 Depois disso, o botão "Agendar Reunião" vai:
- Mostrar horários disponíveis do seu Google Calendar
- Cliente escolhe horário
- Cria evento no Google Calendar
- Envia email de confirmação automático
- Salva lead no Supabase com tracking completo


