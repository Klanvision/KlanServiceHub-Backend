/**
 * Unified Backend Configuration & Single Source of Truth for URLs
 */

export function getFrontendUrl(c) {
  // 1. Dynamic Origin from incoming request
  try {
    const origin = c?.req?.header('origin') || c?.req?.header('referer');
    if (origin) {
      const parsed = new URL(origin);
      if (parsed.origin && parsed.origin !== 'null' && !parsed.origin.includes('undefined')) {
        return parsed.origin;
      }
    }
  } catch (e) {
    // Ignore invalid header url
  }

  // 2. Cloudflare Worker Environment Bindings (from Hono Context)
  if (c?.env?.FRONTEND_URL) {
    return c.env.FRONTEND_URL.replace(/\/+$/, '');
  }
  if (c?.env?.NEXT_PUBLIC_APP_BASE_URL) {
    return c.env.NEXT_PUBLIC_APP_BASE_URL.replace(/\/+$/, '');
  }

  // 3. Node / Process Environment Variables (Local Development)
  if (typeof process !== 'undefined') {
    if (process.env?.FRONTEND_URL) {
      return process.env.FRONTEND_URL.replace(/\/+$/, '');
    }
    if (process.env?.NEXT_PUBLIC_APP_BASE_URL) {
      return process.env.NEXT_PUBLIC_APP_BASE_URL.replace(/\/+$/, '');
    }
  }

  // 4. Fallback default
  return 'https://klanservicehub-frontend.pages.dev';
}

export function getBackendUrl(c) {
  if (c?.env?.BACKEND_URL) {
    return c.env.BACKEND_URL.replace(/\/+$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/+$/, '');
  }
  return 'https://klanservicehub-backend.klanservicehub.workers.dev';
}
