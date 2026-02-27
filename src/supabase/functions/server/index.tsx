import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-admin-request"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-4b2936bc/health", (c) => {
  return c.json({ status: "ok" });
});

// Contact form submission endpoint
app.post("/make-server-4b2936bc/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, interest, message } = body;

    // Validation
    if (!name || !email || !phone || !interest || !message) {
      console.log(`Contact form validation error: Missing required fields`);
      return c.json({ error: "Todos os campos são obrigatórios" }, 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`Contact form validation error: Invalid email format - ${email}`);
      return c.json({ error: "Email inválido" }, 400);
    }

    const timestamp = Date.now();
    const contactId = `contact:${timestamp}`;

    const contactData = {
      id: contactId,
      name,
      email,
      phone,
      interest,
      message,
      createdAt: new Date().toISOString(),
      timestamp,
    };

    await kv.set(contactId, contactData);
    console.log(`Contact form submitted successfully: ${contactId} - ${name} (${email})`);

    return c.json({ 
      success: true, 
      message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      id: contactId 
    });
  } catch (error) {
    console.log(`Contact form submission error: ${error}`);
    return c.json({ error: "Erro ao enviar mensagem. Tente novamente." }, 500);
  }
});

// Newsletter subscription endpoint
app.post("/make-server-4b2936bc/newsletter", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    // Validation
    if (!email) {
      console.log(`Newsletter subscription error: Email is required`);
      return c.json({ error: "Email é obrigatório" }, 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`Newsletter subscription error: Invalid email format - ${email}`);
      return c.json({ error: "Email inválido" }, 400);
    }

    const subscriberId = `newsletter:${email.toLowerCase()}`;

    // Check if already subscribed
    const existing = await kv.get(subscriberId);
    if (existing) {
      console.log(`Newsletter subscription: Already subscribed - ${email}`);
      return c.json({ 
        success: true, 
        message: "Este email já está inscrito na nossa newsletter.",
        alreadySubscribed: true 
      });
    }

    const subscriptionData = {
      id: subscriberId,
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    await kv.set(subscriberId, subscriptionData);
    console.log(`Newsletter subscription successful: ${email}`);

    return c.json({ 
      success: true, 
      message: "Subscrição confirmada! Verifique seu email.",
      id: subscriberId 
    });
  } catch (error) {
    console.log(`Newsletter subscription error: ${error}`);
    return c.json({ error: "Erro ao processar subscrição. Tente novamente." }, 500);
  }
});

// Get all contacts (admin endpoint)
app.get("/make-server-4b2936bc/contacts", async (c) => {
  try {
    const contacts = await kv.getByPrefix("contact:");
    const sortedContacts = contacts.sort((a: any, b: any) => b.timestamp - a.timestamp);
    console.log(`Retrieved ${contacts.length} contacts`);
    // Garantir campo de estágio padrão para pipeline de leads
    const withStage = sortedContacts.map((c: any) => ({
      ...c,
      pipelineStage: c.pipelineStage || 'novo',
    }));
    return c.json({ success: true, contacts: withStage, count: withStage.length });
  } catch (error) {
    console.log(`Error retrieving contacts: ${error}`);
    return c.json({ error: "Erro ao buscar contatos" }, 500);
  }
});

// Update contact (e.g., pipeline stage, notes, owner)
app.put("/make-server-4b2936bc/contacts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "ID do contato é obrigatório" }, 400);
    }
    const contactKey = id.startsWith("contact:") ? id : `contact:${id}`;
    const existing = await kv.get(contactKey);
    if (!existing) {
      console.log(`Contact update error: Contact not found - ${id}`);
      return c.json({ error: "Contato não encontrado" }, 404);
    }

    const body = await c.req.json();
    // Campos permitidos para atualização
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
      // Preferências do lead
      desiredLocations: Array.isArray(desiredLocations)
        ? desiredLocations
        : (existing as any).desiredLocations || [],
      maxBudget: maxBudget !== undefined ? maxBudget : (existing as any).maxBudget || '',
      typology: typology !== undefined ? typology : (existing as any).typology || '',
      updatedAt: new Date().toISOString(),
    };

    await kv.set(contactKey, updated);
    console.log(`Contact updated successfully: ${contactKey} -> stage=${updated.pipelineStage}`);
    return c.json({ success: true, message: "Contato atualizado com sucesso!", contact: updated });
  } catch (error) {
    console.log(`Contact update error: ${error}`);
    return c.json({ error: "Erro ao atualizar contato" }, 500);
  }
});

// Get all newsletter subscribers (admin endpoint)
app.get("/make-server-4b2936bc/subscribers", async (c) => {
  try {
    const subscribers = await kv.getByPrefix("newsletter:");
    const sortedSubscribers = subscribers.sort((a: any, b: any) => b.timestamp - a.timestamp);
    console.log(`Retrieved ${subscribers.length} newsletter subscribers`);
    return c.json({ success: true, subscribers: sortedSubscribers, count: subscribers.length });
  } catch (error) {
    console.log(`Error retrieving subscribers: ${error}`);
    return c.json({ error: "Erro ao buscar subscritos" }, 500);
  }
});

// Delete newsletter subscriber (admin endpoint)
app.delete("/make-server-4b2936bc/subscribers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    console.log(`[DELETE Subscriber] 🗑️ Recebida requisição para excluir subscriber com ID: "${id}"`);
    
    if (!id) {
      console.log("[DELETE Subscriber] ❌ Erro: ID não fornecido");
      return c.json({ error: "ID do assinante é obrigatório" }, 400);
    }

    const key = `newsletter:${id}`;
    console.log(`[DELETE Subscriber] 🔑 Tentando deletar chave KV: "${key}"`);
    
    // Verificar se existe antes de deletar
    const existingValue = await kv.get(key);
    console.log(`[DELETE Subscriber] 🔍 Subscriber existe?`, existingValue ? 'SIM' : 'NÃO', existingValue);
    
    // Delete from KV store
    await kv.del(key);
    
    console.log(`[DELETE Subscriber] ✅ Chave "${key}" deletada com sucesso`);
    return c.json({ success: true, message: "Assinante excluído com sucesso" });
  } catch (error) {
    console.log(`[DELETE Subscriber] ❌ Erro ao excluir: ${error}`);
    return c.json({ error: "Erro ao excluir assinante" }, 500);
  }
});

// ============================================
// PROJECTS CRUD ENDPOINTS
// ============================================

// Get all projects (with automatic migration of old status values)
app.get("/make-server-4b2936bc/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    
    // Auto-migrate old status values on-the-fly
    const statusMapping: Record<string, { newStatus: string; newLabel: string }> = {
      'analysis': { newStatus: 'in-progress', newLabel: 'Em Andamento' },
      'renovation': { newStatus: 'in-progress', newLabel: 'Em Andamento' },
      'completed': { newStatus: 'sold', newLabel: 'Vendido' },
    };
    
    let migratedCount = 0;
    const migratedProjects = await Promise.all(projects.map(async (project: any) => {
      const oldStatus = project.status;
      
      // Check if status needs migration
      if (oldStatus === 'analysis' || oldStatus === 'renovation' || oldStatus === 'completed') {
        const migration = statusMapping[oldStatus];
        
        const updatedProject = {
          ...project,
          status: migration.newStatus,
          statusLabel: migration.newLabel,
          updatedAt: new Date().toISOString(),
        };
        
        // Save migrated project back to database
        const projectKey = `project:${project.id}`;
        await kv.set(projectKey, updatedProject);
        
        console.log(`[Auto-Migration] ✅ ${project.id}: ${oldStatus} → ${migration.newStatus}`);
        migratedCount++;
        
        return updatedProject;
      }
      
      return project;
    }));
    
    if (migratedCount > 0) {
      console.log(`[Auto-Migration] Migrated ${migratedCount} projects automatically`);
    }
    
    const sortedProjects = migratedProjects.sort((a: any, b: any) => b.timestamp - a.timestamp);
    console.log(`Retrieved ${projects.length} projects (${migratedCount} auto-migrated)`);
    return c.json({ success: true, projects: sortedProjects, count: projects.length });
  } catch (error) {
    console.log(`Error retrieving projects: ${error}`);
    return c.json({ error: "Erro ao buscar projetos" }, 500);
  }
});

// Get single project by ID (with automatic migration)
app.get("/make-server-4b2936bc/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectKey = `project:${id}`;
    let project = await kv.get(projectKey);
    
    if (!project) {
      console.log(`Project not found: ${id}`);
      return c.json({ error: "Projeto não encontrado" }, 404);
    }
    
    // Auto-migrate old status if needed
    const projectData = project as any;
    if (projectData.status === 'analysis' || projectData.status === 'renovation' || projectData.status === 'completed') {
      const statusMapping: Record<string, { newStatus: string; newLabel: string }> = {
        'analysis': { newStatus: 'in-progress', newLabel: 'Em Andamento' },
        'renovation': { newStatus: 'in-progress', newLabel: 'Em Andamento' },
        'completed': { newStatus: 'sold', newLabel: 'Vendido' },
      };
      
      const migration = statusMapping[projectData.status];
      project = {
        ...projectData,
        status: migration.newStatus,
        statusLabel: migration.newLabel,
        updatedAt: new Date().toISOString(),
      };
      
      await kv.set(projectKey, project);
      console.log(`[Auto-Migration] ✅ ${id}: ${projectData.status} → ${migration.newStatus}`);
    }
    
    console.log(`Retrieved project: ${id}`);
    return c.json({ success: true, project });
  } catch (error) {
    console.log(`Error retrieving project: ${error}`);
    return c.json({ error: "Erro ao buscar projeto" }, 500);
  }
});

// Create new project
app.post("/make-server-4b2936bc/projects", async (c) => {
  try {
    const body = await c.req.json();
    const {
      title,
      location,
      status,
      statusLabel,
      strategy,
      image,
      roi,
      area,
      bedrooms,
      bathrooms,
      price,
      investment,
      timeline,
      timelinePhases,
      description,
      highlights,
      portalLink,
      brochureLink,
      landingPage,
    } = body;

    // Validation
    if (!title || !location || !status || !statusLabel || !strategy || !image) {
      console.log(`Project creation error: Missing required fields`);
      return c.json({ error: "Campos obrigatórios ausentes" }, 400);
    }

    const timestamp = Date.now();
    const projectId = `${timestamp}`;
    const projectKey = `project:${projectId}`;

    const projectData = {
      id: projectId,
      title,
      location,
      status,
      statusLabel,
      strategy,
      image,
      roi: roi || "+0%",
      area: area || "0 m²",
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      price: price || "€0",
      investment: investment || "€0",
      timeline: timeline || "0 meses",
      timelinePhases: timelinePhases || "",
      description: description || "",
      highlights: highlights || "",
      portalLink: portalLink || null,
      brochureLink: brochureLink || null,
      landingPage: landingPage || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp,
    };

    await kv.set(projectKey, projectData);
    console.log(`Project created successfully: ${projectId} - ${title}`);

    return c.json({
      success: true,
      message: "Projeto criado com sucesso!",
      project: projectData,
    });
  } catch (error) {
    console.log(`Project creation error: ${error}`);
    return c.json({ error: "Erro ao criar projeto. Tente novamente." }, 500);
  }
});

// Update existing project
app.put("/make-server-4b2936bc/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectKey = `project:${id}`;
    
    // Check if project exists
    const existing = await kv.get(projectKey);
    if (!existing) {
      console.log(`Project update error: Project not found - ${id}`);
      return c.json({ error: "Projeto não encontrado" }, 404);
    }

    const body = await c.req.json();
    const {
      title,
      location,
      status,
      statusLabel,
      strategy,
      image,
      roi,
      area,
      bedrooms,
      bathrooms,
      price,
      investment,
      timeline,
      timelinePhases,
      description,
      highlights,
      portalLink,
      brochureLink,
      landingPage,
    } = body;

    // Validation
    if (!title || !location || !status || !statusLabel || !strategy || !image) {
      console.log(`Project update error: Missing required fields`);
      return c.json({ error: "Campos obrigatórios ausentes" }, 400);
    }

    const projectData = {
      ...(existing as any),
      title,
      location,
      status,
      statusLabel,
      strategy,
      image,
      roi: roi || "+0%",
      area: area || "0 m²",
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      price: price || "€0",
      investment: investment || "€0",
      timeline: timeline || "0 meses",
      timelinePhases: timelinePhases || "",
      description: description || "",
      highlights: highlights || "",
      portalLink: portalLink || null,
      brochureLink: brochureLink || null,
      landingPage: landingPage || null,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(projectKey, projectData);
    console.log(`Project updated successfully: ${id} - ${title}`);

    return c.json({
      success: true,
      message: "Projeto atualizado com sucesso!",
      project: projectData,
    });
  } catch (error) {
    console.log(`Project update error: ${error}`);
    return c.json({ error: "Erro ao atualizar projeto. Tente novamente." }, 500);
  }
});

// Delete project
app.delete("/make-server-4b2936bc/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectKey = `project:${id}`;
    
    // Check if project exists
    const existing = await kv.get(projectKey);
    if (!existing) {
      console.log(`Project deletion error: Project not found - ${id}`);
      return c.json({ error: "Projeto não encontrado" }, 404);
    }

    await kv.del(projectKey);
    console.log(`Project deleted successfully: ${id}`);

    return c.json({
      success: true,
      message: "Projeto excluído com sucesso!",
    });
  } catch (error) {
    console.log(`Project deletion error: ${error}`);
    return c.json({ error: "Erro ao excluir projeto. Tente novamente." }, 500);
  }
});

// Seed/Populate projects with initial data
app.post("/make-server-4b2936bc/projects/seed", async (c) => {
  try {
    const initialProjects = [
      {
        id: '1',
        title: 'Apartamento Premium Centro Lisboa',
        location: 'Chiado, Lisboa',
        status: 'completed',
        statusLabel: 'Vendido',
        strategy: 'fix-flip',
        image: 'https://images.unsplash.com/photo-1695395894170-ff75a98f176c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMHBvcnR1Z2FsfGVufDF8fHx8MTc2MTg1MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080',
        roi: '+32%',
        area: '95 m²',
        bedrooms: 2,
        bathrooms: 2,
        price: '€420.000',
        investment: '€318.000',
        timeline: '9 meses',
        timelinePhases: 'Aquisição|1 mês|completed\nLicenciamento|2 meses|completed\nObra Estrutural|3 meses|completed\nAcabamentos|2 meses|completed\nComercialização|1 mês|completed',
        description: 'Apartamento premium reabilitado em Lisboa, concluído em 9 meses.',
        highlights: 'Restauro de fachada histórica em azulejos\nPreservação de elementos arquitetónicos originais\nSistema de climatização eficiente\nCozinha e casas de banho de design premium\nCertificação energética A\nLocalização prime no Chiado',
      },
      {
        id: '2',
        title: 'Moradia Contemporânea Cascais',
        location: 'Estoril, Cascais',
        status: 'completed',
        statusLabel: 'Vendido',
        strategy: 'fix-flip',
        image: 'https://images.unsplash.com/photo-1561753757-d8880c5a3551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZW5vdmF0ZWQlMjBob21lJTIwZXVyb3BlfGVufDF8fHx8MTc2MTg1MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080',
        roi: '+28%',
        area: '180 m²',
        bedrooms: 4,
        bathrooms: 3,
        price: '€750.000',
        investment: '€585.000',
        timeline: '11 meses',
        timelinePhases: 'Aquisição|1.5 meses|completed\nLicenciamento|2.5 meses|completed\nObra Estrutural|4 meses|completed\nAcabamentos|2.5 meses|completed\nComercialização|0.5 meses|completed',
        description: 'Moradia de luxo com design contemporâneo e acabamentos premium.',
        highlights: 'Arquitetura contemporânea de alto padrão\nJardim paisagístico com piscina\nSistema domótico integrado\nCozinha gourmet totalmente equipada\nGaragem para 3 veículos\nVista mar panorâmica',
      },
      {
        id: '3',
        title: 'Loft Moderno Zona Histórica',
        location: 'Alfama, Lisboa',
        status: 'in-progress',
        statusLabel: 'Em Andamento',
        strategy: 'buy-hold',
        image: 'https://images.unsplash.com/photo-1600876188212-40de3a9218ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob3VzZSUyMHBvcnR1Z2FsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTg1MzQxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        roi: '+35%',
        area: '120 m²',
        bedrooms: 2,
        bathrooms: 2,
        price: '€485.000',
        investment: '€359.000',
        timeline: '7 meses',
        timelinePhases: 'Aquisição|0.5 meses|completed\nLicenciamento|1.5 meses|completed\nObra Estrutural|3 meses|in-progress\nAcabamentos|1.5 meses|pending\nComercialização|0.5 meses|pending',
        description: 'Transformação de edifício histórico em loft moderno de alto padrão.',
        highlights: 'Conceito open-space moderno\nPé-direito duplo com mezanino\nPreservação de paredes em pedra original\nIluminação natural abundante\nAcabamentos de luxo\nLocalização histórica premium',
      },
      {
        id: '4',
        title: 'Edifício Reabilitação Integral',
        location: 'Baixa, Porto',
        status: 'in-progress',
        statusLabel: 'Em Andamento',
        strategy: 'fix-flip',
        image: 'https://images.unsplash.com/photo-1683880356566-3245383f3a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlbm92YXRpb24lMjBidWlsZGluZyUyMGxpc2JvbnxlbnwxfHx8fDE3NjE4NTM0MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        roi: '+40%',
        area: '450 m²',
        bedrooms: 6,
        bathrooms: 5,
        price: '€1.250.000',
        investment: '€893.000',
        timeline: '14 meses',
        timelinePhases: 'Aquisição|2 meses|completed\nLicenciamento|3 meses|completed\nObra Estrutural|5 meses|in-progress\nAcabamentos|3 meses|pending\nComercialização|1 mês|pending',
        description: 'Projeto completo de reabilitação urbana em zona premium do Porto.',
        highlights: 'Reabilitação de fachada histórica\n6 apartamentos de luxo\nElevador moderno instalado\nSistema centralizado de climatização\nCertificação energética A+\nLocalização premium na Baixa do Porto',
      },
      {
        id: '5',
        title: 'Apartamento Vista Mar',
        location: 'Cascais',
        status: 'available',
        statusLabel: 'Disponível',
        strategy: 'buy-hold',
        image: 'https://images.unsplash.com/photo-1759150712360-6d48015e4f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjByZW5vdmF0aW9ufGVufDF8fHx8MTc2MTc3NTk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        roi: '+30%',
        area: '135 m²',
        bedrooms: 3,
        bathrooms: 2,
        price: '€595.000',
        investment: '€458.000',
        timeline: '8 meses',
        timelinePhases: 'Aquisição|1 mês|completed\nLicenciamento|2 meses|completed\nObra Estrutural|3 meses|completed\nAcabamentos|1.5 meses|completed\nComercialização|0.5 meses|completed',
        description: 'Oportunidade com vista mar e alto potencial de valorização.',
        highlights: 'Vista mar deslumbrante\nCondomínio fechado com segurança 24h\nPiscina comum e ginásio\n2 lugares de garagem\nPróximo à praia (5 min a pé)\nAlto potencial de valorização',
      },
      {
        id: '6',
        title: 'Penthouse Centro Histórico',
        location: 'Bairro Alto, Lisboa',
        status: 'in-progress',
        statusLabel: 'Em Andamento',
        strategy: 'fix-flip',
        image: 'https://images.unsplash.com/photo-1716807335144-33e138f1858a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzYxODIwNjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        roi: '+38%',
        area: '160 m²',
        bedrooms: 3,
        bathrooms: 3,
        price: '€720.000',
        investment: '€522.000',
        timeline: '10 meses',
        timelinePhases: 'Aquisição|1.5 meses|completed\nLicenciamento|2.5 meses|in-progress\nObra Estrutural|3.5 meses|pending\nAcabamentos|2 meses|pending\nComercialização|0.5 meses|pending',
        description: 'Penthouse de luxo em localização premium com terraço privativo.',
        highlights: 'Terraço privativo de 80m²\nVistas panorâmicas de Lisboa\nLocalização premium no Bairro Alto\nTetos altos (3.5m)\nLuz natural abundante\nPotencial para piscina no terraço',
      },
    ];

    const createdProjects = [];
    const timestamp = Date.now();

    for (let i = 0; i < initialProjects.length; i++) {
      const project = initialProjects[i];
      const projectKey = `project:${project.id}`;
      
      // Check if already exists
      const existing = await kv.get(projectKey);
      if (existing) {
        console.log(`Project already exists, skipping: ${project.id} - ${project.title}`);
        continue;
      }

      const projectData = {
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timestamp: timestamp + i,
      };

      await kv.set(projectKey, projectData);
      createdProjects.push(projectData);
      console.log(`Project seeded: ${project.id} - ${project.title}`);
    }

    console.log(`Seed complete: ${createdProjects.length} projects created`);

    return c.json({
      success: true,
      message: `${createdProjects.length} projetos criados com sucesso!`,
      created: createdProjects.length,
      skipped: initialProjects.length - createdProjects.length,
      projects: createdProjects,
    });
  } catch (error) {
    console.log(`Project seed error: ${error}`);
    return c.json({ error: "Erro ao popular projetos. Tente novamente." }, 500);
  }
});

// Delete all projects and reseed with clean data
app.post("/make-server-4b2936bc/projects/reset", async (c) => {
  try {
    console.log('[Reset] Starting database reset...');
    
    // Get all projects
    const projects = await kv.getByPrefix("project:");
    console.log(`[Reset] Found ${projects.length} projects to delete`);
    
    // Delete all projects
    const deletePromises = projects.map((project: any) => {
      const projectKey = `project:${project.id}`;
      return kv.del(projectKey);
    });
    
    await Promise.all(deletePromises);
    console.log(`[Reset] ✅ Deleted ${projects.length} projects`);
    
    return c.json({
      success: true,
      message: `${projects.length} projetos deletados. Use "Sincronizar Site" para recriar com dados corretos.`,
      deleted: projects.length,
    });
  } catch (error) {
    console.log(`[Reset] ❌ Error: ${error}`);
    return c.json({ error: "Erro ao resetar banco de dados." }, 500);
  }
});

// Migrate old status values to new ones
app.post("/make-server-4b2936bc/projects/migrate-status", async (c) => {
  try {
    console.log('[Migration] Starting status migration...');
    
    const projects = await kv.getByPrefix("project:");
    console.log(`[Migration] Found ${projects.length} projects to check`);
    
    const statusMapping: Record<string, { newStatus: string; newLabel: string }> = {
      'analysis': { newStatus: 'in-progress', newLabel: 'Em Andamento' },
      'renovation': { newStatus: 'in-progress', newLabel: 'Em Andamento' },
      'completed': { newStatus: 'sold', newLabel: 'Vendido' },
      'available': { newStatus: 'available', newLabel: 'Disponível' },
      'sold': { newStatus: 'sold', newLabel: 'Vendido' },
      'in-progress': { newStatus: 'in-progress', newLabel: 'Em Andamento' },
    };
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const project of projects) {
      const oldStatus = (project as any).status;
      
      // Check if status needs migration
      if (oldStatus === 'analysis' || oldStatus === 'renovation' || oldStatus === 'completed') {
        const migration = statusMapping[oldStatus];
        
        const updatedProject = {
          ...(project as any),
          status: migration.newStatus,
          statusLabel: migration.newLabel,
          updatedAt: new Date().toISOString(),
        };
        
        const projectKey = `project:${(project as any).id}`;
        await kv.set(projectKey, updatedProject);
        
        console.log(`[Migration] ✅ Migrated project ${(project as any).id}: ${oldStatus} -> ${migration.newStatus}`);
        migratedCount++;
      } else {
        console.log(`[Migration] ⏭️  Skipped project ${(project as any).id}: already using valid status "${oldStatus}"`);
        skippedCount++;
      }
    }
    
    console.log(`[Migration] Complete: ${migratedCount} migrated, ${skippedCount} skipped`);
    
    return c.json({
      success: true,
      message: `Migração concluída! ${migratedCount} projetos atualizados, ${skippedCount} já estavam corretos.`,
      migrated: migratedCount,
      skipped: skippedCount,
      total: projects.length,
    });
  } catch (error) {
    console.log(`[Migration] ❌ Error: ${error}`);
    return c.json({ error: "Erro na migração. Tente novamente." }, 500);
  }
});

// ============================================
// INSIGHTS CRUD ENDPOINTS
// ============================================

// Get all insights (with auto-seed if empty)
app.get("/make-server-4b2936bc/insights", async (c) => {
  try {
    let insights = await kv.getByPrefix("insight:");
    
    // Auto-seed if no insights exist
    if (!insights || insights.length === 0) {
      console.log('No insights found, auto-seeding...');
      
      const initialInsights = [
        {
          id: '1',
          title: 'Como avaliar o potencial de valorização de um imóvel urbano',
          description: 'Aprenda os principais indicadores técnicos e de mercado para identificar oportunidades de alta rentabilidade na reabilitação urbana.',
          category: 'Investimento',
          readTime: '8 min',
          icon: 'TrendingUp',
          iconColor: '#1A3E5C',
          gradient: 'linear-gradient(135deg, #1A3E5C 0%, #2C5F7C 100%)',
          author: 'João Silva',
          authorRole: 'Especialista em Investimento Imobiliário',
          date: '15 Jan 2024',
          excerpt: 'Aprenda os principais indicadores técnicos e de mercado para identificar oportunidades de alta rentabilidade na reabilitação urbana.',
          image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
          tags: ['Investimento', 'Reabilitação', 'ARU', 'ROI', 'Valorização'],
          content: 'A reabilitação urbana tornou-se uma das formas mais rentáveis de investimento imobiliário em Portugal...',
        },
        {
          id: '2',
          title: 'O impacto das zonas ARU na rentabilidade',
          description: 'Entenda como as Áreas de Reabilitação Urbana influenciam os incentivos fiscais e aumentam o retorno de investimento.',
          category: 'Regulamentação',
          readTime: '6 min',
          icon: 'Building2',
          iconColor: '#B8956A',
          gradient: 'linear-gradient(135deg, #B8956A 0%, #D4B896 100%)',
          author: 'Maria Costa',
          authorRole: 'Consultora em Reabilitação Urbana',
          date: '22 Jan 2024',
          excerpt: 'Entenda como as Áreas de Reabilitação Urbana influenciam os incentivos fiscais e aumentam o retorno de investimento.',
          image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
          tags: ['ARU', 'Benefícios Fiscais', 'Rentabilidade', 'Regulamentação'],
          content: 'As Áreas de Reabilitação Urbana (ARU) são zonas territorialmente delimitadas...',
        },
        {
          id: '3',
          title: 'Reabilitação sustentável: o futuro do mercado imobiliário',
          description: 'Descubra como a sustentabilidade e eficiência energética estão transformando o setor de reabilitação e agregando valor aos imóveis.',
          category: 'Sustentabilidade',
          readTime: '7 min',
          icon: 'Leaf',
          iconColor: '#6B7C93',
          gradient: 'linear-gradient(135deg, #6B7C93 0%, #8A9BB0 100%)',
          author: 'Pedro Santos',
          authorRole: 'Arquiteto Especialista em Sustentabilidade',
          date: '5 Fev 2024',
          excerpt: 'Descubra como a sustentabilidade e eficiência energética estão transformando o setor de reabilitação e agregando valor aos imóveis.',
          image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
          tags: ['Sustentabilidade', 'Eficiência Energética', 'Certificação', 'Valorização'],
          content: 'A sustentabilidade deixou de ser uma tendência para se tornar um requisito fundamental...',
        },
      ];
      
      const timestamp = Date.now();
      for (let i = 0; i < initialInsights.length; i++) {
        const insight = initialInsights[i];
        const insightData = {
          ...insight,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timestamp: timestamp + i,
        };
        await kv.set(`insight:${insight.id}`, insightData);
        console.log(`Auto-seeded insight: ${insight.id} - ${insight.title}`);
      }
      
      // Fetch again after seeding
      insights = await kv.getByPrefix("insight:");
      console.log(`Auto-seed complete: ${insights.length} insights created`);
    }
    
    const sortedInsights = insights.sort((a: any, b: any) => b.timestamp - a.timestamp);
    console.log(`Retrieved ${insights.length} insights`);
    return c.json({ success: true, insights: sortedInsights, count: insights.length });
  } catch (error) {
    console.log(`Error retrieving insights: ${error}`);
    return c.json({ error: "Erro ao buscar insights" }, 500);
  }
});

// Get single insight by ID
app.get("/make-server-4b2936bc/insights/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const insightKey = `insight:${id}`;
    const insight = await kv.get(insightKey);
    
    if (!insight) {
      console.log(`Insight not found: ${id}`);
      return c.json({ error: "Insight não encontrado" }, 404);
    }
    
    console.log(`Retrieved insight: ${id}`);
    return c.json({ success: true, insight });
  } catch (error) {
    console.log(`Error retrieving insight: ${error}`);
    return c.json({ error: "Erro ao buscar insight" }, 500);
  }
});

// Create new insight
app.post("/make-server-4b2936bc/insights", async (c) => {
  try {
    const body = await c.req.json();
    const {
      title,
      description,
      category,
      readTime,
      icon,
      iconColor,
      gradient,
      content,
      author,
      authorRole,
      date,
      excerpt,
      image,
      tags,
      contentBlocks,
      relatedInsights,
    } = body;

    // Validation
    if (!title || !description || !category) {
      console.log(`Insight creation error: Missing required fields`);
      return c.json({ error: "Campos obrigatórios ausentes" }, 400);
    }

    const timestamp = Date.now();
    const insightId = `${timestamp}`;
    const insightKey = `insight:${insightId}`;

    const insightData = {
      id: insightId,
      title,
      description,
      category,
      readTime: readTime || "5 min",
      icon: icon || "TrendingUp",
      iconColor: iconColor || "#1A3E5C",
      gradient: gradient || "linear-gradient(135deg, #1A3E5C 0%, #2C5F7C 100%)",
      content: content || "",
      author: author || "",
      authorRole: authorRole || "",
      date: date || new Date().toLocaleDateString('pt-PT'),
      excerpt: excerpt || description,
      image: image || "",
      tags: tags || [],
      contentBlocks: contentBlocks || [],
      relatedInsights: relatedInsights || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp,
    };

    await kv.set(insightKey, insightData);
    console.log(`Insight created successfully: ${insightId} - ${title}`);

    return c.json({
      success: true,
      message: "Insight criado com sucesso!",
      insight: insightData,
    });
  } catch (error) {
    console.log(`Insight creation error: ${error}`);
    return c.json({ error: "Erro ao criar insight. Tente novamente." }, 500);
  }
});

// Update existing insight
app.put("/make-server-4b2936bc/insights/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const insightKey = `insight:${id}`;
    
    // Check if insight exists
    const existing = await kv.get(insightKey);
    if (!existing) {
      console.log(`Insight update error: Insight not found - ${id}`);
      return c.json({ error: "Insight não encontrado" }, 404);
    }

    const body = await c.req.json();
    const {
      title,
      description,
      category,
      readTime,
      icon,
      iconColor,
      gradient,
      content,
      author,
      authorRole,
      date,
      excerpt,
      image,
      tags,
      contentBlocks,
      relatedInsights,
    } = body;

    console.log(`[PUT Insight] Recebendo update para ${id}:`, {
      title,
      contentBlocksCount: contentBlocks?.length || 0,
      hasContentBlocks: !!contentBlocks,
    });

    // Validation
    if (!title || !description || !category) {
      console.log(`Insight update error: Missing required fields`);
      return c.json({ error: "Campos obrigatórios ausentes" }, 400);
    }

    const insightData = {
      ...(existing as any),
      title,
      description,
      category,
      readTime: readTime || "5 min",
      icon: icon || "TrendingUp",
      iconColor: iconColor || "#1A3E5C",
      gradient: gradient || "linear-gradient(135deg, #1A3E5C 0%, #2C5F7C 100%)",
      content: content || "",
      author: author || "",
      authorRole: authorRole || "",
      date: date || new Date().toLocaleDateString('pt-PT'),
      excerpt: excerpt || description,
      image: image || "",
      tags: tags || [],
      contentBlocks: contentBlocks || [],
      relatedInsights: relatedInsights || [],
      updatedAt: new Date().toISOString(),
    };

    await kv.set(insightKey, insightData);
    console.log(`[PUT Insight] ✅ Updated: ${id} - ${title} (${insightData.contentBlocks?.length || 0} blocos)`);

    return c.json({
      success: true,
      message: "Insight atualizado com sucesso!",
      insight: insightData,
    });
  } catch (error) {
    console.log(`Insight update error: ${error}`);
    return c.json({ error: "Erro ao atualizar insight. Tente novamente." }, 500);
  }
});

// Delete insight
app.delete("/make-server-4b2936bc/insights/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const insightKey = `insight:${id}`;
    
    // Check if insight exists
    const existing = await kv.get(insightKey);
    if (!existing) {
      console.log(`Insight deletion error: Insight not found - ${id}`);
      return c.json({ error: "Insight não encontrado" }, 404);
    }

    await kv.del(insightKey);
    console.log(`Insight deleted successfully: ${id}`);

    return c.json({
      success: true,
      message: "Insight excluído com sucesso!",
    });
  } catch (error) {
    console.log(`Insight deletion error: ${error}`);
    return c.json({ error: "Erro ao excluir insight. Tente novamente." }, 500);
  }
});

// Seed/Populate insights with initial data
app.post("/make-server-4b2936bc/insights/seed", async (c) => {
  try {
    const initialInsights = [
      {
        id: '1',
        title: 'Como avaliar o potencial de valorização de um imóvel urbano',
        description: 'Aprenda os principais indicadores técnicos e de mercado para identificar oportunidades de alta rentabilidade na reabilitação urbana.',
        category: 'Investimento',
        readTime: '8 min',
        icon: 'TrendingUp',
        iconColor: '#1A3E5C',
        gradient: 'linear-gradient(135deg, #1A3E5C 0%, #2C5F7C 100%)',
        author: 'João Silva',
        authorRole: 'Especialista em Investimento Imobiliário',
        date: '15 Jan 2024',
        excerpt: 'Aprenda os principais indicadores técnicos e de mercado para identificar oportunidades de alta rentabilidade na reabilitação urbana.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
        tags: ['Investimento', 'Reabilitação', 'ARU', 'ROI', 'Valorização'],
        content: 'A reabilitação urbana tornou-se uma das formas mais rentáveis de investimento imobiliário em Portugal...',
      },
      {
        id: '2',
        title: 'O impacto das zonas ARU na rentabilidade',
        description: 'Entenda como as Áreas de Reabilitação Urbana influenciam os incentivos fiscais e aumentam o retorno de investimento.',
        category: 'Regulamentação',
        readTime: '6 min',
        icon: 'Building2',
        iconColor: '#B8956A',
        gradient: 'linear-gradient(135deg, #B8956A 0%, #D4B896 100%)',
        author: 'Maria Costa',
        authorRole: 'Consultora em Reabilitação Urbana',
        date: '22 Jan 2024',
        excerpt: 'Entenda como as Áreas de Reabilitação Urbana influenciam os incentivos fiscais e aumentam o retorno de investimento.',
        image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
        tags: ['ARU', 'Benefícios Fiscais', 'Rentabilidade', 'Regulamentação'],
        content: 'As Áreas de Reabilitação Urbana (ARU) são zonas territorialmente delimitadas...',
      },
      {
        id: '3',
        title: 'Reabilitação sustentável: o futuro do mercado imobiliário',
        description: 'Descubra como a sustentabilidade e eficiência energética estão transformando o setor de reabilitação e agregando valor aos imóveis.',
        category: 'Sustentabilidade',
        readTime: '7 min',
        icon: 'Leaf',
        iconColor: '#6B7C93',
        gradient: 'linear-gradient(135deg, #6B7C93 0%, #8A9BB0 100%)',
        author: 'Pedro Santos',
        authorRole: 'Arquiteto Especialista em Sustentabilidade',
        date: '5 Fev 2024',
        excerpt: 'Descubra como a sustentabilidade e eficiência energética estão transformando o setor de reabilitação e agregando valor aos imóveis.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
        tags: ['Sustentabilidade', 'Eficiência Energética', 'Certificação', 'Valorização'],
        content: 'A sustentabilidade deixou de ser uma tendência para se tornar um requisito fundamental...',
      },
    ];

    const createdInsights = [];
    const timestamp = Date.now();

    for (let i = 0; i < initialInsights.length; i++) {
      const insight = initialInsights[i];
      const insightKey = `insight:${insight.id}`;
      
      // Check if already exists
      const existing = await kv.get(insightKey);
      if (existing) {
        console.log(`Insight already exists, skipping: ${insight.id} - ${insight.title}`);
        continue;
      }

      const insightData = {
        ...insight,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timestamp: timestamp + i,
      };

      await kv.set(insightKey, insightData);
      createdInsights.push(insightData);
      console.log(`Insight seeded: ${insight.id} - ${insight.title}`);
    }

    console.log(`Seed complete: ${createdInsights.length} insights created`);

    return c.json({
      success: true,
      message: `${createdInsights.length} insights criados com sucesso!`,
      created: createdInsights.length,
      skipped: initialInsights.length - createdInsights.length,
      insights: createdInsights,
    });
  } catch (error) {
    console.log(`Insight seed error: ${error}`);
    return c.json({ error: "Erro ao popular insights. Tente novamente." }, 500);
  }
});

// Delete all insights and reseed with complete data
app.post("/make-server-4b2936bc/insights/reset", async (c) => {
  try {
    console.log('[Reset Insights] Starting insights reset...');
    
    // Get all insights
    const insights = await kv.getByPrefix("insight:");
    console.log(`[Reset Insights] Found ${insights.length} insights to delete`);
    
    // Delete all insights
    const deletePromises = insights.map((insight: any) => {
      const insightKey = `insight:${insight.id}`;
      return kv.del(insightKey);
    });
    
    await Promise.all(deletePromises);
    console.log(`[Reset Insights] ✅ Deleted ${insights.length} insights`);
    
    // Recreate insights with full content blocks
    const completeInsights = [
      {
        id: '1',
        title: 'Como avaliar o potencial de valorização de um imóvel urbano',
        description: 'Aprenda os principais indicadores técnicos e de mercado para identificar oportunidades de alta rentabilidade na reabilitação urbana.',
        category: 'Investimento',
        readTime: '8 min',
        icon: 'TrendingUp',
        iconColor: '#1A3E5C',
        gradient: 'linear-gradient(135deg, #1A3E5C 0%, #2C5F7C 100%)',
        author: 'João Silva',
        authorRole: 'Especialista em Investimento Imobiliário',
        date: '15 Jan 2024',
        excerpt: 'Aprenda os principais indicadores técnicos e de mercado para identificar oportunidades de alta rentabilidade na reabilitação urbana.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
        tags: ['Investimento', 'Reabilitação', 'ARU', 'ROI', 'Valorização'],
        relatedInsights: ['2', '3'],
        contentBlocks: [
          {
            id: 'block-1',
            type: 'paragraph',
            content: 'A reabilitação urbana tornou-se uma das formas mais rentáveis de investimento imobiliário em Portugal, especialmente em centros históricos de cidades como Lisboa e Porto. Compreender os fatores que impulsionam a valorização é essencial para o sucesso do investimento.',
          },
          {
            id: 'block-2',
            type: 'heading2',
            content: 'Indicadores Fundamentais de Localização',
          },
          {
            id: 'block-3',
            type: 'paragraph',
            content: 'A localização continua a ser o fator mais crítico na avaliação do potencial de valorização. Zonas classificadas como ARU (Áreas de Reabilitação Urbana) oferecem benefícios fiscais significativos que podem aumentar o ROI em 15-25%.',
          },
          {
            id: 'block-4',
            type: 'list',
            content: [
              'Proximidade a transportes públicos (metro, comboio) aumenta a valorização em 12-18%',
              'Acesso a escolas e serviços de qualidade agrega valor premium',
              'Zonas em gentrificação oferecem potencial de valorização acelerada (20-35%)',
              'Presença de projetos culturais e criativos indica tendência de crescimento',
            ],
          },
          {
            id: 'block-5',
            type: 'heading2',
            content: 'Análise Técnica do Imóvel',
          },
          {
            id: 'block-6',
            type: 'paragraph',
            content: 'A avaliação técnica deve considerar tanto o estado atual quanto o potencial de transformação. Imóveis com características arquitetónicas únicas preserváveis valorizam significativamente mais.',
          },
          {
            id: 'block-7',
            type: 'callout',
            content: 'Imóveis com elementos históricos preserváveis (azulejos, cantarias, tectos trabalhados) podem valorizar até 40% acima da média do mercado quando corretamente reabilitados.',
          },
          {
            id: 'block-8',
            type: 'list',
            content: [
              'Estado estrutural e necessidades de intervenção',
              'Elementos arquitetónicos a preservar ou restaurar',
              'Potencial de redistribuição de espaços',
              'Viabilidade de melhorias de eficiência energética',
            ],
          },
          {
            id: 'block-9',
            type: 'heading2',
            content: 'Métricas Financeiras Essenciais',
          },
          {
            id: 'block-10',
            type: 'paragraph',
            content: 'A análise financeira deve ir além do preço de aquisição. É crucial calcular o custo total do projeto incluindo margens de contingência e prever o valor final de mercado com base em comparáveis recentes.',
          },
          {
            id: 'block-11',
            type: 'list',
            content: [
              'Cap Rate (taxa de capitalização) ideal entre 5-7% para zonas premium',
              'ROI esperado de 28-40% em projetos de reabilitação bem executados',
              'Tempo médio de execução: 8-14 meses para maximizar retorno',
              'Margem de contingência recomendada: 20% do orçamento de obra',
            ],
          },
        ],
      },
      {
        id: '2',
        title: 'O impacto das zonas ARU na rentabilidade',
        description: 'Entenda como as Áreas de Reabilitação Urbana influenciam os incentivos fiscais e aumentam o retorno de investimento.',
        category: 'Regulamentação',
        readTime: '6 min',
        icon: 'Building2',
        iconColor: '#B8956A',
        gradient: 'linear-gradient(135deg, #B8956A 0%, #D4B896 100%)',
        author: 'Maria Costa',
        authorRole: 'Consultora em Reabilitação Urbana',
        date: '22 Jan 2024',
        excerpt: 'Entenda como as Áreas de Reabilitação Urbana influenciam os incentivos fiscais e aumentam o retorno de investimento.',
        image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
        tags: ['ARU', 'Benefícios Fiscais', 'Rentabilidade', 'Regulamentação'],
        relatedInsights: ['1', '3'],
        contentBlocks: [
          {
            id: 'block-1',
            type: 'paragraph',
            content: 'As Áreas de Reabilitação Urbana (ARU) são zonas territorialmente delimitadas que oferecem benefícios fiscais substanciais para projetos de reabilitação. Compreender estes incentivos é fundamental para maximizar a rentabilidade.',
          },
          {
            id: 'block-2',
            type: 'heading2',
            content: 'Benefícios Fiscais Principais',
          },
          {
            id: 'block-3',
            type: 'paragraph',
            content: 'As ARU proporcionam um conjunto abrangente de benefícios que reduzem significativamente os custos de reabilitação e aceleram o retorno do investimento.',
          },
          {
            id: 'block-4',
            type: 'list',
            content: [
              'Isenção de IMT (Imposto Municipal sobre Transmissões) na aquisição',
              'Isenção de IMI (Imposto Municipal sobre Imóveis) até 5 anos após conclusão',
              'Redução de IVA de 23% para 6% em obras de reabilitação',
              'Acesso facilitado a financiamento com condições preferenciais',
            ],
          },
          {
            id: 'block-5',
            type: 'heading2',
            content: 'Impacto no ROI',
          },
          {
            id: 'block-6',
            type: 'callout',
            content: 'Os benefícios fiscais em ARU podem representar uma economia de 15-25% no custo total do projeto, aumentando o ROI final em 20-30 pontos percentuais.',
          },
          {
            id: 'block-7',
            type: 'paragraph',
            content: 'Esta poupança fiscal permite investimentos mais agressivos em qualidade de acabamentos, resultando em imóveis que comandam preços premium no mercado.',
          },
        ],
      },
      {
        id: '3',
        title: 'Reabilitação sustentável: o futuro do mercado imobiliário',
        description: 'Descubra como a sustentabilidade e eficiência energética estão transformando o setor de reabilitação e agregando valor aos imóveis.',
        category: 'Sustentabilidade',
        readTime: '7 min',
        icon: 'Leaf',
        iconColor: '#6B7C93',
        gradient: 'linear-gradient(135deg, #6B7C93 0%, #8A9BB0 100%)',
        author: 'Pedro Santos',
        authorRole: 'Arquiteto Especialista em Sustentabilidade',
        date: '5 Fev 2024',
        excerpt: 'Descubra como a sustentabilidade e eficiência energética estão transformando o setor de reabilitação e agregando valor aos imóveis.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
        tags: ['Sustentabilidade', 'Eficiência Energética', 'Certificação', 'Valorização'],
        relatedInsights: ['1', '2'],
        contentBlocks: [
          {
            id: 'block-1',
            type: 'paragraph',
            content: 'A sustentabilidade deixou de ser uma tendência para se tornar um requisito fundamental no mercado imobiliário de luxo. Imóveis com certificação energética superior e soluções sustentáveis valorizam mais e vendem mais rapidamente.',
          },
          {
            id: 'block-2',
            type: 'heading2',
            content: 'Eficiência Energética como Diferencial',
          },
          {
            id: 'block-3',
            type: 'paragraph',
            content: 'A certificação energética tornou-se um dos principais critérios de decisão de compra. Imóveis com certificação A ou A+ comandam um premium de 15-25% no mercado premium.',
          },
          {
            id: 'block-4',
            type: 'list',
            content: [
              'Isolamento térmico e acústico de última geração',
              'Sistemas de climatização eficientes (bomba de calor, VRV)',
              'Iluminação LED inteligente com controlo automático',
              'Vidros duplos ou triplos de alto desempenho',
            ],
          },
          {
            id: 'block-5',
            type: 'heading2',
            content: 'Energias Renováveis Integradas',
          },
          {
            id: 'block-6',
            type: 'paragraph',
            content: 'A integração de fontes de energia renovável não só reduz custos operacionais mas também aumenta significativamente a atratividade do imóvel.',
          },
          {
            id: 'block-7',
            type: 'callout',
            content: 'Imóveis com painéis solares e sistemas de recuperação de águas pluviais apresentam valorização adicional de 12-18% e redução de 40-60% nos custos de energia.',
          },
          {
            id: 'block-8',
            type: 'list',
            content: [
              'Painéis fotovoltaicos para produção de energia',
              'Sistemas solares térmicos para aquecimento de águas',
              'Recuperação e reutilização de águas pluviais',
              'Sistemas de ventilação com recuperação de calor',
            ],
          },
          {
            id: 'block-9',
            type: 'heading2',
            content: 'Materiais Sustentáveis e Locais',
          },
          {
            id: 'block-10',
            type: 'paragraph',
            content: 'A escolha de materiais sustentáveis e de origem local não apenas reduz a pegada de carbono mas também agrega valor através da autenticidade e qualidade.',
          },
          {
            id: 'block-11',
            type: 'list',
            content: [
              'Madeiras certificadas FSC de florestas sustentáveis',
              'Pedras naturais portuguesas (Lioz, Estremoz, Pedras Salgadas)',
              'Cortiça nacional em isolamentos e revestimentos',
              'Tintas e acabamentos de baixa emissão de VOC',
            ],
          },
          {
            id: 'block-12',
            type: 'heading2',
            content: 'ROI da Sustentabilidade',
          },
          {
            id: 'block-13',
            type: 'paragraph',
            content: 'Investir em soluções sustentáveis representa um custo adicional de 8-12% no orçamento de obra, mas gera retorno através de valorização premium, vendas mais rápidas e redução de custos operacionais.',
          },
          {
            id: 'block-14',
            type: 'paragraph',
            content: 'Dados de mercado demonstram que imóveis sustentáveis vendem em média 25% mais rápido e com valorização 18% superior a imóveis convencionais na mesma localização.',
          },
        ],
      },
    ];

    // Create new insights with complete content blocks
    const timestamp = Date.now();
    for (let i = 0; i < completeInsights.length; i++) {
      const insight = completeInsights[i];
      const insightKey = `insight:${insight.id}`;
      
      const insightData = {
        ...insight,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timestamp: timestamp + i,
      };

      await kv.set(insightKey, insightData);
      console.log(`[Reset Insights] Created: ${insight.id} - ${insight.title}`);
    }
    
    console.log(`[Reset Insights] ✅ Reset complete with ${completeInsights.length} new insights`);
    
    return c.json({
      success: true,
      message: `Insights resetados! ${completeInsights.length} insights criados com conteúdo completo.`,
      deleted: insights.length,
      created: completeInsights.length,
    });
  } catch (error) {
    console.log(`[Reset Insights] ❌ Error: ${error}`);
    return c.json({ error: "Erro ao resetar insights." }, 500);
  }
});

// ========================================
// TESTIMONIALS ENDPOINTS
// ========================================

// Get all testimonials
app.get("/make-server-4b2936bc/testimonials", async (c) => {
  try {
    let testimonials = await kv.getByPrefix("testimonial:");
    console.log(`Retrieved ${testimonials.length} testimonials from database`);
    
    // Auto-seed if empty
    if (testimonials.length === 0) {
      console.log('[Testimonials] No testimonials found, auto-seeding...');
      const initialTestimonials = [
        {
          id: '1',
          name: 'Dr. Miguel Santos',
          role: 'Investidor',
          company: 'Portfolio Privado',
          image: 'https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTc2MTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
          content: 'A HABTA ajudou-me a investir com clareza e sem surpresas. A gestão transparente e o processo estruturado garantiram previsibilidade em todos os projetos.',
          rating: 5,
          project: '2 projetos concluídos',
          order: 1,
        },
        {
          id: '2',
          name: 'Ana Rodrigues',
          role: 'Proprietária',
          company: 'Venda de Imóvel',
          image: 'https://images.unsplash.com/photo-1737066894976-dd00d3fafaf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZlc3RvciUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MTg1MzQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
          content: 'O profissionalismo técnico e a comunicação constante fizeram toda a diferença. Processo seguro do início ao fim, com resultado muito acima das expectativas.',
          rating: 5,
          project: 'Apartamento Lisboa | Vendido em 45 dias',
          order: 2,
        },
        {
          id: '3',
          name: 'Carlos Mendes',
          role: 'Investidor Institucional',
          company: 'Family Office',
          image: 'https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTc1ODMwMHww&ixlib=rb-4.1.0&q=80&w=1080',
          content: 'A metodologia estruturada e a gestão financeira transparente garantem previsibilidade em todos os projetos. Análise técnica detalhada e execução controlada com resultados consistentes.',
          rating: 5,
          project: '5 projetos | €2.4M investidos',
          order: 3,
        },
      ];
      
      const timestamp = Date.now();
      for (let i = 0; i < initialTestimonials.length; i++) {
        const testimonial = initialTestimonials[i];
        const testimonialData = {
          ...testimonial,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timestamp: timestamp + i,
        };
        await kv.set(`testimonial:${testimonial.id}`, testimonialData);
        console.log(`Auto-seeded testimonial: ${testimonial.id} - ${testimonial.name}`);
      }
      
      // Fetch again after seeding
      testimonials = await kv.getByPrefix("testimonial:");
      console.log(`Auto-seed complete: ${testimonials.length} testimonials created`);
    }
    
    const sortedTestimonials = testimonials.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    console.log(`Retrieved ${testimonials.length} testimonials`);
    return c.json({ success: true, testimonials: sortedTestimonials, count: testimonials.length });
  } catch (error) {
    console.log(`Error retrieving testimonials: ${error}`);
    return c.json({ error: "Erro ao buscar depoimentos" }, 500);
  }
});

// Get single testimonial by ID
app.get("/make-server-4b2936bc/testimonials/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const testimonialKey = `testimonial:${id}`;
    const testimonial = await kv.get(testimonialKey);
    
    if (!testimonial) {
      console.log(`Testimonial not found: ${id}`);
      return c.json({ error: "Depoimento não encontrado" }, 404);
    }
    
    console.log(`Retrieved testimonial: ${id}`);
    return c.json({ success: true, testimonial });
  } catch (error) {
    console.log(`Error retrieving testimonial: ${error}`);
    return c.json({ error: "Erro ao buscar depoimento" }, 500);
  }
});

// Create new testimonial
app.post("/make-server-4b2936bc/testimonials", async (c) => {
  try {
    const body = await c.req.json();
    const {
      name,
      role,
      company,
      image,
      content,
      rating,
      project,
      order,
    } = body;

    // Validation
    if (!name || !role || !content) {
      console.log(`Testimonial creation error: Missing required fields`);
      return c.json({ error: "Campos obrigatórios ausentes (nome, cargo, depoimento)" }, 400);
    }

    // Generate ID
    const timestamp = Date.now();
    const id = `${timestamp}`;
    const testimonialKey = `testimonial:${id}`;

    const testimonialData = {
      id,
      name,
      role,
      company: company || '',
      image: image || '',
      content,
      rating: rating || 5,
      project: project || '',
      order: order || 999,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp,
    };

    await kv.set(testimonialKey, testimonialData);
    console.log(`Testimonial created: ${id} - ${name}`);

    return c.json({
      success: true,
      message: "Depoimento criado com sucesso!",
      testimonial: testimonialData,
    });
  } catch (error) {
    console.log(`Testimonial creation error: ${error}`);
    return c.json({ error: "Erro ao criar depoimento. Tente novamente." }, 500);
  }
});

// Update testimonial
app.put("/make-server-4b2936bc/testimonials/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const testimonialKey = `testimonial:${id}`;
    const body = await c.req.json();
    const {
      name,
      role,
      company,
      image,
      content,
      rating,
      project,
      order,
    } = body;

    // Check if testimonial exists
    const existing = await kv.get(testimonialKey);
    if (!existing) {
      console.log(`Testimonial update error: Testimonial not found - ${id}`);
      return c.json({ error: "Depoimento não encontrado" }, 404);
    }

    // Validation
    if (!name || !role || !content) {
      console.log(`Testimonial update error: Missing required fields`);
      return c.json({ error: "Campos obrigatórios ausentes" }, 400);
    }

    const testimonialData = {
      ...(existing as any),
      name,
      role,
      company: company || '',
      image: image || '',
      content,
      rating: rating || 5,
      project: project || '',
      order: order !== undefined ? order : (existing as any).order,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(testimonialKey, testimonialData);
    console.log(`Testimonial updated: ${id} - ${name}`);

    return c.json({
      success: true,
      message: "Depoimento atualizado com sucesso!",
      testimonial: testimonialData,
    });
  } catch (error) {
    console.log(`Testimonial update error: ${error}`);
    return c.json({ error: "Erro ao atualizar depoimento. Tente novamente." }, 500);
  }
});

// Delete testimonial
app.delete("/make-server-4b2936bc/testimonials/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const testimonialKey = `testimonial:${id}`;
    
    // Check if testimonial exists
    const existing = await kv.get(testimonialKey);
    if (!existing) {
      console.log(`Testimonial deletion error: Testimonial not found - ${id}`);
      return c.json({ error: "Depoimento não encontrado" }, 404);
    }

    await kv.del(testimonialKey);
    console.log(`Testimonial deleted successfully: ${id}`);

    return c.json({
      success: true,
      message: "Depoimento excluído com sucesso!",
    });
  } catch (error) {
    console.log(`Testimonial deletion error: ${error}`);
    return c.json({ error: "Erro ao excluir depoimento. Tente novamente." }, 500);
  }
});

// ============================================
// IMAGE UPLOAD ENDPOINTS
// ============================================

// Upload image for projects
app.post("/make-server-4b2936bc/upload/projects", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    if (!file) return c.json({ error: "Nenhum arquivo foi enviado" }, 400);
    if (!file.type.startsWith('image/')) return c.json({ error: "Apenas imagens são permitidas" }, 400);
    if (file.size > 5 * 1024 * 1024) return c.json({ error: "A imagem deve ter no máximo 5MB" }, 400);

    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const bucketName = 'make-4b2936bc-projects';
    
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b: any) => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, { public: false, fileSizeLimit: 5242880 });
    }

    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `projects/${fileName}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, arrayBuffer, { contentType: file.type });
    if (uploadError) {
      console.log(`Upload error:`, uploadError);
      return c.json({ error: "Erro ao fazer upload da imagem" }, 500);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from(bucketName).createSignedUrl(filePath, 315360000);
    if (signedUrlError) {
      console.log(`Signed URL error:`, signedUrlError);
      return c.json({ error: "Erro ao gerar URL da imagem" }, 500);
    }

    console.log(`Image uploaded successfully: ${filePath}`);
    return c.json({ success: true, url: signedUrlData.signedUrl, path: filePath });
  } catch (error) {
    console.log(`Image upload error: ${error}`);
    return c.json({ error: "Erro ao processar upload" }, 500);
  }
});

// Upload image for insights
app.post("/make-server-4b2936bc/upload/insights", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    if (!file) return c.json({ error: "Nenhum arquivo foi enviado" }, 400);
    if (!file.type.startsWith('image/')) return c.json({ error: "Apenas imagens são permitidas" }, 400);
    if (file.size > 5 * 1024 * 1024) return c.json({ error: "A imagem deve ter no máximo 5MB" }, 400);

    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const bucketName = 'make-4b2936bc-insights';
    
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b: any) => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, { public: false, fileSizeLimit: 5242880 });
    }

    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `insights/${fileName}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, arrayBuffer, { contentType: file.type });
    if (uploadError) {
      console.log(`Upload error:`, uploadError);
      return c.json({ error: "Erro ao fazer upload da imagem" }, 500);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from(bucketName).createSignedUrl(filePath, 315360000);
    if (signedUrlError) {
      console.log(`Signed URL error:`, signedUrlError);
      return c.json({ error: "Erro ao gerar URL da imagem" }, 500);
    }

    console.log(`Image uploaded successfully: ${filePath}`);
    return c.json({ success: true, url: signedUrlData.signedUrl, path: filePath });
  } catch (error) {
    console.log(`Image upload error: ${error}`);
    return c.json({ error: "Erro ao processar upload" }, 500);
  }
});

// Upload image for testimonials
app.post("/make-server-4b2936bc/upload/testimonials", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    if (!file) return c.json({ error: "Nenhum arquivo foi enviado" }, 400);
    if (!file.type.startsWith('image/')) return c.json({ error: "Apenas imagens são permitidas" }, 400);
    if (file.size > 5 * 1024 * 1024) return c.json({ error: "A imagem deve ter no máximo 5MB" }, 400);

    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const bucketName = 'make-4b2936bc-testimonials';
    
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b: any) => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, { public: false, fileSizeLimit: 5242880 });
    }

    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `testimonials/${fileName}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, arrayBuffer, { contentType: file.type });
    if (uploadError) {
      console.log(`Upload error:`, uploadError);
      return c.json({ error: "Erro ao fazer upload da imagem" }, 500);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from(bucketName).createSignedUrl(filePath, 315360000);
    if (signedUrlError) {
      console.log(`Signed URL error:`, signedUrlError);
      return c.json({ error: "Erro ao gerar URL da imagem" }, 500);
    }

    console.log(`Image uploaded successfully: ${filePath}`);
    return c.json({ success: true, url: signedUrlData.signedUrl, path: filePath });
  } catch (error) {
    console.log(`Image upload error: ${error}`);
    return c.json({ error: "Erro ao processar upload" }, 500);
  }
});

// ============================================
// CONTROLO (Multi-Project Dashboard) CRUD ENDPOINTS
// ============================================

// --- Controlo Projects ---
app.get("/make-server-4b2936bc/controlo/projects", async (c) => {
  try {
    const items = await kv.getByPrefix("controlo:project:");
    const sorted = items.sort((a: any, b: any) => (a.label || '').localeCompare(b.label || ''));
    return c.json({ success: true, projects: sorted, count: sorted.length });
  } catch (error) {
    console.log(`Error retrieving controlo projects: ${error}`);
    return c.json({ error: "Erro ao buscar projetos de controlo" }, 500);
  }
});

app.post("/make-server-4b2936bc/controlo/projects", async (c) => {
  try {
    const body = await c.req.json();
    const { id, label } = body;
    if (!id || !label) return c.json({ error: "id e label são obrigatórios" }, 400);
    const key = `controlo:project:${id}`;
    const existing = await kv.get(key);
    if (existing) return c.json({ error: "Já existe um projeto com este ID" }, 409);
    const data = { id, label, timestamp: Date.now() };
    await kv.set(key, data);
    return c.json({ success: true, project: data });
  } catch (error) {
    console.log(`Error creating controlo project: ${error}`);
    return c.json({ error: "Erro ao criar projeto de controlo" }, 500);
  }
});

app.put("/make-server-4b2936bc/controlo/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `controlo:project:${id}`;
    const existing = await kv.get(key);
    if (!existing) return c.json({ error: "Projeto não encontrado" }, 404);
    const body = await c.req.json();
    const updated = { ...(existing as any), ...body, id, timestamp: Date.now() };
    await kv.set(key, updated);
    return c.json({ success: true, project: updated });
  } catch (error) {
    console.log(`Error updating controlo project: ${error}`);
    return c.json({ error: "Erro ao atualizar projeto de controlo" }, 500);
  }
});

app.delete("/make-server-4b2936bc/controlo/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `controlo:project:${id}`;
    await kv.del(key);
    return c.json({ success: true, message: "Projeto de controlo eliminado" });
  } catch (error) {
    console.log(`Error deleting controlo project: ${error}`);
    return c.json({ error: "Erro ao eliminar projeto de controlo" }, 500);
  }
});

// --- Units ---
app.get("/make-server-4b2936bc/controlo/units", async (c) => {
  try {
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const items = await kv.getByPrefix(`controlo:unit:${projectId}:`);
    const sorted = items.sort((a: any, b: any) => (a.code || '').localeCompare(b.code || ''));
    return c.json({ success: true, units: sorted, count: sorted.length });
  } catch (error) {
    console.log(`Error retrieving controlo units: ${error}`);
    return c.json({ error: "Erro ao buscar unidades" }, 500);
  }
});

app.post("/make-server-4b2936bc/controlo/units", async (c) => {
  try {
    const body = await c.req.json();
    const { projectId } = body;
    if (!projectId || !body.code) return c.json({ error: "projectId e code são obrigatórios" }, 400);
    const timestamp = Date.now();
    const id = `${timestamp}`;
    const key = `controlo:unit:${projectId}:${id}`;
    const data = { ...body, id, timestamp };
    await kv.set(key, data);
    return c.json({ success: true, unit: data });
  } catch (error) {
    console.log(`Error creating controlo unit: ${error}`);
    return c.json({ error: "Erro ao criar unidade" }, 500);
  }
});

app.put("/make-server-4b2936bc/controlo/units/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:unit:${projectId}:${id}`;
    const existing = await kv.get(key);
    if (!existing) return c.json({ error: "Unidade não encontrada" }, 404);
    const body = await c.req.json();
    const updated = { ...(existing as any), ...body, id, projectId, timestamp: Date.now() };
    await kv.set(key, updated);
    return c.json({ success: true, unit: updated });
  } catch (error) {
    console.log(`Error updating controlo unit: ${error}`);
    return c.json({ error: "Erro ao atualizar unidade" }, 500);
  }
});

app.delete("/make-server-4b2936bc/controlo/units/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:unit:${projectId}:${id}`;
    await kv.del(key);
    return c.json({ success: true, message: "Unidade eliminada" });
  } catch (error) {
    console.log(`Error deleting controlo unit: ${error}`);
    return c.json({ error: "Erro ao eliminar unidade" }, 500);
  }
});

// --- Targets ---
app.get("/make-server-4b2936bc/controlo/targets", async (c) => {
  try {
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:targets:${projectId}`;
    const targets = await kv.get(key);
    return c.json({ success: true, targets: targets || null });
  } catch (error) {
    console.log(`Error retrieving controlo targets: ${error}`);
    return c.json({ error: "Erro ao buscar metas" }, 500);
  }
});

app.put("/make-server-4b2936bc/controlo/targets", async (c) => {
  try {
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const body = await c.req.json();
    const key = `controlo:targets:${projectId}`;
    const data = { ...body, id: key, projectId, timestamp: Date.now() };
    await kv.set(key, data);
    return c.json({ success: true, targets: data });
  } catch (error) {
    console.log(`Error updating controlo targets: ${error}`);
    return c.json({ error: "Erro ao atualizar metas" }, 500);
  }
});

// --- Review Dates ---
app.get("/make-server-4b2936bc/controlo/reviews", async (c) => {
  try {
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const items = await kv.getByPrefix(`controlo:review:${projectId}:`);
    const sorted = items.sort((a: any, b: any) => (a.date || '').localeCompare(b.date || ''));
    return c.json({ success: true, reviews: sorted, count: sorted.length });
  } catch (error) {
    console.log(`Error retrieving controlo reviews: ${error}`);
    return c.json({ error: "Erro ao buscar datas de revisão" }, 500);
  }
});

app.post("/make-server-4b2936bc/controlo/reviews", async (c) => {
  try {
    const body = await c.req.json();
    const { projectId } = body;
    if (!projectId || !body.date) return c.json({ error: "projectId e date são obrigatórios" }, 400);
    const timestamp = Date.now();
    const id = `${timestamp}`;
    const key = `controlo:review:${projectId}:${id}`;
    const data = { ...body, id, timestamp };
    await kv.set(key, data);
    return c.json({ success: true, review: data });
  } catch (error) {
    console.log(`Error creating controlo review: ${error}`);
    return c.json({ error: "Erro ao criar data de revisão" }, 500);
  }
});

app.put("/make-server-4b2936bc/controlo/reviews/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:review:${projectId}:${id}`;
    const existing = await kv.get(key);
    if (!existing) return c.json({ error: "Data de revisão não encontrada" }, 404);
    const body = await c.req.json();
    const updated = { ...(existing as any), ...body, id, projectId, timestamp: Date.now() };
    await kv.set(key, updated);
    return c.json({ success: true, review: updated });
  } catch (error) {
    console.log(`Error updating controlo review: ${error}`);
    return c.json({ error: "Erro ao atualizar data de revisão" }, 500);
  }
});

app.delete("/make-server-4b2936bc/controlo/reviews/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:review:${projectId}:${id}`;
    await kv.del(key);
    return c.json({ success: true, message: "Data de revisão eliminada" });
  } catch (error) {
    console.log(`Error deleting controlo review: ${error}`);
    return c.json({ error: "Erro ao eliminar data de revisão" }, 500);
  }
});

// --- Weekly Logs ---
app.get("/make-server-4b2936bc/controlo/weeklylogs", async (c) => {
  try {
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const items = await kv.getByPrefix(`controlo:wlog:${projectId}:`);
    const sorted = items.sort((a: any, b: any) => (b.weekStart || '').localeCompare(a.weekStart || ''));
    return c.json({ success: true, weeklylogs: sorted, count: sorted.length });
  } catch (error) {
    console.log(`Error retrieving controlo weeklylogs: ${error}`);
    return c.json({ error: "Erro ao buscar registos semanais" }, 500);
  }
});

app.post("/make-server-4b2936bc/controlo/weeklylogs", async (c) => {
  try {
    const body = await c.req.json();
    const { projectId } = body;
    if (!projectId || !body.unitId || !body.weekStart) return c.json({ error: "projectId, unitId e weekStart são obrigatórios" }, 400);
    const timestamp = Date.now();
    const id = `${timestamp}`;
    const key = `controlo:wlog:${projectId}:${id}`;
    const data = { ...body, id, timestamp };
    await kv.set(key, data);
    return c.json({ success: true, weeklylog: data });
  } catch (error) {
    console.log(`Error creating controlo weeklylog: ${error}`);
    return c.json({ error: "Erro ao criar registo semanal" }, 500);
  }
});

app.put("/make-server-4b2936bc/controlo/weeklylogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:wlog:${projectId}:${id}`;
    const existing = await kv.get(key);
    if (!existing) return c.json({ error: "Registo semanal não encontrado" }, 404);
    const body = await c.req.json();
    const updated = { ...(existing as any), ...body, id, projectId, timestamp: Date.now() };
    await kv.set(key, updated);
    return c.json({ success: true, weeklylog: updated });
  } catch (error) {
    console.log(`Error updating controlo weeklylog: ${error}`);
    return c.json({ error: "Erro ao atualizar registo semanal" }, 500);
  }
});

app.delete("/make-server-4b2936bc/controlo/weeklylogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:wlog:${projectId}:${id}`;
    await kv.del(key);
    return c.json({ success: true, message: "Registo semanal eliminado" });
  } catch (error) {
    console.log(`Error deleting controlo weeklylog: ${error}`);
    return c.json({ error: "Erro ao eliminar registo semanal" }, 500);
  }
});

// --- Competitors ---
app.get("/make-server-4b2936bc/controlo/competitors", async (c) => {
  try {
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const items = await kv.getByPrefix(`controlo:comp:${projectId}:`);
    const sorted = items.sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
    return c.json({ success: true, competitors: sorted, count: sorted.length });
  } catch (error) {
    console.log(`Error retrieving controlo competitors: ${error}`);
    return c.json({ error: "Erro ao buscar concorrentes" }, 500);
  }
});

app.post("/make-server-4b2936bc/controlo/competitors", async (c) => {
  try {
    const body = await c.req.json();
    const { projectId } = body;
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const timestamp = Date.now();
    const id = `${timestamp}`;
    const key = `controlo:comp:${projectId}:${id}`;
    const pricePerM2 = body.area > 0 ? Math.round(body.price / body.area) : 0;
    const data = { ...body, id, pricePerM2, timestamp };
    await kv.set(key, data);
    return c.json({ success: true, competitor: data });
  } catch (error) {
    console.log(`Error creating controlo competitor: ${error}`);
    return c.json({ error: "Erro ao criar concorrente" }, 500);
  }
});

app.put("/make-server-4b2936bc/controlo/competitors/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:comp:${projectId}:${id}`;
    const existing = await kv.get(key);
    if (!existing) return c.json({ error: "Concorrente não encontrado" }, 404);
    const body = await c.req.json();
    const pricePerM2 = body.area > 0 ? Math.round(body.price / body.area) : 0;
    const updated = { ...(existing as any), ...body, id, projectId, pricePerM2, timestamp: Date.now() };
    await kv.set(key, updated);
    return c.json({ success: true, competitor: updated });
  } catch (error) {
    console.log(`Error updating controlo competitor: ${error}`);
    return c.json({ error: "Erro ao atualizar concorrente" }, 500);
  }
});

app.delete("/make-server-4b2936bc/controlo/competitors/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const projectId = c.req.query("projectId");
    if (!projectId) return c.json({ error: "projectId é obrigatório" }, 400);
    const key = `controlo:comp:${projectId}:${id}`;
    await kv.del(key);
    return c.json({ success: true, message: "Concorrente eliminado" });
  } catch (error) {
    console.log(`Error deleting controlo competitor: ${error}`);
    return c.json({ error: "Erro ao eliminar concorrente" }, 500);
  }
});

Deno.serve(app.fetch);