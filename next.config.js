// Security posture differs by environment:
//  - Emergent preview embeds the app in an iframe → framing must stay open there.
//  - Vercel production (VERCEL=1) → lock framing to self, HSTS, no wildcard CORS.
// Override with FRAME_ANCESTORS / CORS_ORIGINS env vars if ever needed.
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;
const frameAncestors = process.env.FRAME_ANCESTORS || (isVercel ? "'self'" : '*');
const corsOrigin =
  (process.env.CORS_ORIGINS && process.env.CORS_ORIGINS !== '*' && process.env.CORS_ORIGINS) ||
  (isVercel && process.env.NEXT_PUBLIC_BASE_URL) ||
  '*';

const securityHeaders = [
  { key: 'Content-Security-Policy', value: `frame-ancestors ${frameAncestors};` },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Access-Control-Allow-Origin', value: corsOrigin },
  { key: 'Access-Control-Allow-Methods', value: 'GET, POST, DELETE, OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Admin-Secret' },
];

// X-Frame-Options only understands SAMEORIGIN/DENY; omit it when framing is intentionally open.
if (frameAncestors === "'self'") securityHeaders.push({ key: 'X-Frame-Options', value: 'SAMEORIGIN' });
if (frameAncestors === "'none'") securityHeaders.push({ key: 'X-Frame-Options', value: 'DENY' });
if (isVercel) securityHeaders.push({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' });

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
    ],
  },
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
