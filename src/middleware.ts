import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from '@/utils/rate-limit';

// Rate limit config per route prefix
const API_RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  '/api/newsletter': { maxRequests: 5, windowMs: 60_000 },   // 5 req/min
  '/api/revalidate': { maxRequests: 10, windowMs: 60_000 },  // 10 req/min
  '/api/': { maxRequests: 30, windowMs: 60_000 },            // 30 req/min default
};

function getApiRateConfig(pathname: string) {
  for (const [prefix, config] of Object.entries(API_RATE_LIMITS)) {
    if (pathname.startsWith(prefix)) return config;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('cf-connecting-ip')
      ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? 'unknown';
    const config = getApiRateConfig(request.nextUrl.pathname);
    if (config) {
      const result = rateLimit(ip, config);
      if (result.limited) {
        return NextResponse.json(
          { error: 'Too many requests' },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }
    }
    // API routes don't need Supabase auth — return early
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin routes — require authenticated user with confirmed email
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    if (!user.email_confirmed_at) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'email_not_confirmed');
      return NextResponse.redirect(url);
    }

    // Check MFA assurance level
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel === 'aal1') {
      // User has MFA configured but hasn't verified in this session
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('mfa', 'required');
      return NextResponse.redirect(url);
    }
  }

  // Redirect /login if already authenticated (but not if MFA verification is pending)
  if (request.nextUrl.pathname === '/login' && user) {
    const mfaParam = request.nextUrl.searchParams.get('mfa');
    if (mfaParam !== 'required') {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      // Only redirect to admin if MFA is not pending
      if (!aal || aal.nextLevel !== 'aal2' || aal.currentLevel !== 'aal1') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/api/:path*'],
};
