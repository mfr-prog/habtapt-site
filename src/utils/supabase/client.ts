/**
 * Supabase Client Configuration
 * Configuração centralizada e segura do cliente Supabase
 * 
 * ⚠️ IMPORTANTE: Este arquivo centraliza TODA a comunicação com Supabase
 * NUNCA acesse variáveis de ambiente ou construa URLs manualmente
 * SEMPRE use os helpers exportados deste arquivo
 */

import { projectId, publicAnonKey } from './info';

// Validação rigorosa de configuração
const validateConfig = () => {
  console.log('[Supabase Config] Validating configuration...');
  
  if (!projectId) {
    const error = 'FATAL: projectId is not defined. Check /utils/supabase/info.tsx';
    console.error(`[Supabase Config] ${error}`);
    throw new Error(error);
  }
  
  if (!publicAnonKey) {
    const error = 'FATAL: publicAnonKey is not defined. Check /utils/supabase/info.tsx';
    console.error(`[Supabase Config] ${error}`);
    throw new Error(error);
  }
  
  if (typeof projectId !== 'string' || projectId.length < 10) {
    const error = `FATAL: projectId is invalid: "${projectId}"`;
    console.error(`[Supabase Config] ${error}`);
    throw new Error(error);
  }
  
  console.log('[Supabase Config] ✅ Configuration validated successfully');
  console.log('[Supabase Config] Project ID:', projectId.substring(0, 8) + '...');
};

// Executar validação na importação
validateConfig();

/**
 * Retorna a URL base do Supabase
 */
export const getSupabaseUrl = (): string => {
  return `https://${projectId}.supabase.co`;
};

/**
 * Retorna a URL da API do servidor
 */
export const getServerUrl = (functionName: string): string => {
  return `${getSupabaseUrl()}/functions/v1/${functionName}`;
};

/**
 * Retorna os headers padrão para requisições autenticadas
 */
export const getAuthHeaders = (accessToken?: string, isAdmin: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
    'Content-Type': 'application/json',
  };
  
  // Adicionar header de admin se necessário
  if (isAdmin) {
    headers['x-admin-request'] = 'true';
  }
  
  return headers;
};

/**
 * Helper para fazer fetch com configuração padrão do Supabase
 * Inclui retry automático e logs detalhados
 */
export const supabaseFetch = async (
  endpoint: string,
  options: RequestInit = {},
  retries: number = 1,
  isAdmin: boolean = false
): Promise<Response> => {
  // Validar que a configuração ainda está OK
  if (!projectId || !publicAnonKey) {
    const error = 'Supabase configuration lost during runtime!';
    console.error(`[Supabase Fetch] FATAL: ${error}`);
    throw new Error(error);
  }

  const url = `${getSupabaseUrl()}/functions/v1/${endpoint}`;
  const headers = {
    ...getAuthHeaders(undefined, isAdmin),
    ...options.headers,
  };

  const method = options.method || 'GET';
  console.log(`[Supabase Fetch] ${method} ${url}`);
  console.log(`[Supabase Fetch] Headers:`, Object.keys(headers));
  console.log(`[Supabase Fetch] Is Admin:`, isAdmin);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[Supabase Fetch] Retry attempt ${attempt}/${retries}`);
        // Aguardar 500ms antes de retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`[Supabase Fetch] Response status: ${response.status}`);
      
      // Se a resposta for OK, retornar imediatamente
      if (response.ok || response.status < 500) {
        return response;
      }
      
      // Se for erro 5xx, pode ser temporário, tentar retry
      console.warn(`[Supabase Fetch] Server error ${response.status}, will retry...`);
      lastError = new Error(`Server returned ${response.status}`);
      
    } catch (error) {
      console.error(`[Supabase Fetch] Network error on attempt ${attempt + 1}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Se for o último retry, lançar erro
      if (attempt === retries) {
        break;
      }
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  console.error(`[Supabase Fetch] All ${retries + 1} attempts failed for ${url}`);
  throw lastError || new Error('Unknown fetch error');
};

/**
 * Exporta as configurações para uso direto quando necessário
 */
export const supabaseConfig = {
  projectId,
  publicAnonKey,
  url: getSupabaseUrl(),
} as const;
