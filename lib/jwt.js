import jwt from 'jsonwebtoken';

const FIVE_YEARS_SECONDS = 60 * 60 * 24 * 365 * 5;
const ALG = 'HS256';

// Fail closed: no fallback secrets. If JWT_LICENSE_SECRET is missing or too short,
// signing throws (caller returns 500) and verification returns null (content stays locked).
function getSecret() {
  const s = process.env.JWT_LICENSE_SECRET;
  if (!s || s.length < 32) {
    throw new Error('JWT_LICENSE_SECRET is not configured (min 32 chars)');
  }
  return s;
}

export function signEntitlement({ email, ebookSlug }) {
  return jwt.sign(
    { email, slug: ebookSlug, kind: 'entitlement' },
    getSecret(),
    { algorithm: ALG, expiresIn: FIVE_YEARS_SECONDS }
  );
}

export function verifyEntitlement(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const payload = jwt.verify(token, getSecret(), { algorithms: [ALG] });
    if (payload?.kind !== 'entitlement') return null;
    return payload; // { email, slug, iat, exp }
  } catch (_e) {
    return null;
  }
}
