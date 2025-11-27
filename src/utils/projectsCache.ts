/**
 * Projects Cache - Sistema de cache otimizado para projetos
 * Melhora performance e reduz chamadas à API
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class ProjectsCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Salva dados no cache
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    });
    console.log(`[Cache] ✅ Cached: ${key} (TTL: ${ttl}ms)`);
  }

  /**
   * Recupera dados do cache se ainda válidos
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`[Cache] ❌ Miss: ${key}`);
      return null;
    }

    const age = Date.now() - entry.timestamp;
    
    if (age > entry.expiresIn) {
      console.log(`[Cache] ⏰ Expired: ${key} (age: ${age}ms)`);
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] ✅ Hit: ${key} (age: ${age}ms)`);
    return entry.data as T;
  }

  /**
   * Limpa cache por chave
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`[Cache] 🗑️ Invalidated: ${key}`);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
    console.log('[Cache] 🗑️ Cleared all cache');
  }

  /**
   * Verifica se uma chave existe e é válida
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// Exportar instância singleton
export const projectsCache = new ProjectsCache();

// Cache keys constants
export const CACHE_KEYS = {
  ALL_PROJECTS: 'projects:all',
  PROJECT_BY_ID: (id: string) => `project:${id}`,
  INSIGHTS: 'insights:all',
  INSIGHT_BY_ID: (id: string) => `insight:${id}`,
} as const;
