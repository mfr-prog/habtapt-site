import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
const app = new Hono();

app.use('*', logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-4b2936bc/health", (c) => c.json({ status: "ok" }));

// CONTACTS
app.get("/make-server-4b2936bc/contacts", async (c) => {
  const contacts = await kv.getByPrefix("contact:");
  const sorted = contacts.sort((a: any, b: any) => b.timestamp - a.timestamp);
  const withStage = sorted.map((x: any) => ({ ...x, pipelineStage: x.pipelineStage || 'novo' }));
  return c.json({ success: true, contacts: withStage, count: withStage.length });
});

app.put("/make-server-4b2936bc/contacts/:id", async (c) => {
  const paramId = c.req.param("id");
  const contactKey = paramId.startsWith("contact:") ? paramId : `contact:${paramId}`;
  const existing = await kv.get(contactKey);
  if (!existing) return c.json({ error: "Contato não encontrado" }, 404);
  const body = await c.req.json();
  const {
    pipelineStage,
    notes,
    owner,
    lastActivityAt,
    followUpAt,
    desiredLocations,
    maxBudget,
    typology,
  } = body || {};
  const updated = {
    ...(existing as any),
    pipelineStage: pipelineStage || (existing as any).pipelineStage || 'novo',
    notes: notes !== undefined ? notes : (existing as any).notes || '',
    owner: owner !== undefined ? owner : (existing as any).owner || '',
    lastActivityAt: lastActivityAt || new Date().toISOString(),
    followUpAt: followUpAt || (existing as any).followUpAt || null,
    desiredLocations: Array.isArray(desiredLocations) ? desiredLocations : (existing as any).desiredLocations || [],
    maxBudget: maxBudget !== undefined ? maxBudget : (existing as any).maxBudget || '',
    typology: typology !== undefined ? typology : (existing as any).typology || '',
    updatedAt: new Date().toISOString(),
  };
  await kv.set(contactKey, updated);
  return c.json({ success: true, message: "Contato atualizado com sucesso!", contact: updated });
});

// SUBSCRIBERS (read + delete)
app.get("/make-server-4b2936bc/subscribers", async (c) => {
  const subscribers = await kv.getByPrefix("newsletter:");
  const sorted = subscribers.sort((a: any, b: any) => b.timestamp - a.timestamp);
  return c.json({ success: true, subscribers: sorted, count: sorted.length });
});
app.delete("/make-server-4b2936bc/subscribers/:id", async (c) => {
  const id = c.req.param("id");
  const key = `newsletter:${id}`;
  await kv.del(key);
  return c.json({ success: true, message: "Assinante excluído com sucesso" });
});

// The rest of endpoints (projects, insights, testimonials, uploads) can be added similarly if needed
// For now, we implement the minimum required for the AdminPanel

Deno.serve(app.fetch);


