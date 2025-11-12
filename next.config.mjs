/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self' 'unsafe-eval' 'unsafe-inline';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' 
                https://clerk.com 
                https://*.clerk.com 
                https://*.clerk.accounts.dev 
                https://cdn.jsdelivr.net 
                https://js.sentry-cdn.com 
                https://browser.sentry-cdn.com 
                https://*.sentry.io 
                https://challenges.cloudflare.com 
                https://scdn.clerk.com 
                https://segapi.clerk.com 
                https://clerk-telemetry.com 
                https://api.stripe.com 
                https://*.js.stripe.com 
                https://js.stripe.com 
                https://maps.googleapis.com;
              worker-src 'self' blob: data:;
              connect-src 'self' 
                https://clerk.com 
                https://*.clerk.com 
                https://*.clerk.accounts.dev 
                https://api.stripe.com 
                https://generativelanguage.googleapis.com;
              img-src 'self' data: https:;
              style-src 'self' 'unsafe-inline';
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
};

export default nextConfig;
