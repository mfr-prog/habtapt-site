'use client';

import React, { useState, useEffect } from 'react';

export type Route = 'home' | 'services' | 'process' | 'portfolio' | 'testimonials' | 'insights' | 'contact' | 'portfolio-detail' | 'insight-detail' | 'admin' | 'login';

interface RouterContextType {
  currentRoute: Route;
  params: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;
  navigateToUrl: (url: string) => void;
}

export const RouterContext = React.createContext<RouterContextType>({
  currentRoute: 'home',
  params: {},
  navigate: () => {},
  navigateToUrl: () => {},
});

export function Router({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [params, setParams] = useState<Record<string, string>>({});

  const parseHash = (hash: string): { route: Route; params: Record<string, string> } => {
    const cleanHash = hash.slice(1); // Remove #
    const [routePart, ...paramParts] = cleanHash.split('/');
    
    console.log('[Router] parseHash - cleanHash:', cleanHash);
    console.log('[Router] parseHash - routePart:', routePart);
    console.log('[Router] parseHash - paramParts:', paramParts);
    
    // Parse route
    let route: Route = 'home';
    const validRoutes: Route[] = ['home', 'services', 'process', 'portfolio', 'testimonials', 'insights', 'contact', 'admin', 'login'];
    
    if (validRoutes.includes(routePart as Route)) {
      route = routePart as Route;
    }
    
    // Check for detail routes
    if (routePart === 'portfolio' && paramParts.length > 0) {
      route = 'portfolio-detail';
    } else if (routePart === 'insight' && paramParts.length > 0) {
      route = 'insight-detail';
    }
    
    // Parse params
    const parsedParams: Record<string, string> = {};
    if (paramParts.length > 0) {
      parsedParams.id = paramParts[0];
    }
    
    console.log('[Router] parseHash - resultado - route:', route, 'params:', parsedParams);
    
    return { route, params: parsedParams };
  };

  useEffect(() => {
    // Read initial route from hash
    const hash = window.location.hash || '#home';
    const { route, params } = parseHash(hash);
    setCurrentRoute(route);
    setParams(params);

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash || '#home';
      const { route, params } = parseHash(newHash);
      setCurrentRoute(route);
      setParams(params);
      
      // Scroll para o topo - versão robusta para mobile e desktop
      const originalBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = originalBehavior;
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: Route, routeParams?: Record<string, string>) => {
    console.log('[Router] navigate - route:', route, 'routeParams:', routeParams);
    
    let hash = route;
    
    if (routeParams?.id) {
      if (route === 'portfolio-detail') {
        hash = `portfolio/${routeParams.id}` as Route;
      } else if (route === 'insight-detail') {
        hash = `insight/${routeParams.id}` as Route;
      }
    }
    
    console.log('[Router] navigate - hash final:', hash);
    
    window.location.hash = hash;
    setCurrentRoute(route);
    setParams(routeParams || {});
    
    // Scroll para o topo - versão robusta para mobile
    const originalBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = originalBehavior;
    });
  };

  const navigateToUrl = (url: string) => {
    const { route, params } = parseHash('#' + url);
    navigate(route, params);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, params, navigate, navigateToUrl }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return React.useContext(RouterContext);
}
