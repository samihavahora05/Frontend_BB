/**
 * Utility helper to resolve image and media URLs correctly across
 * local static assets, uploaded backend storage assets, and external URLs.
 */

const KNOWN_STATIC_ROOT_FILES = new Set([
  'logoblue.png',
  'boxxlogo.png',
  'logowhite.png',
  'card.png',
  'upi.png',
  'netbanking.png',
  'favicon.png',
  'favicon.ico',
  'ankush.jpeg',
  'loading.mp4',
]);

const KNOWN_STATIC_LOGOS = new Set([
  '3d studio.png', '118884943_255121585574741_6686225333604484729_n.jpg', 'anacle.webp',
  'aps-associates.png', 'asha_tours&travels.jpeg', 'asha_tours-travels.jpeg', 'atr-logo.png',
  'ayanshse sicyuraty.webp', 'csd.png', 'damyaa.png', 'destinee visa.jpeg', 'drapple healthcare.png',
  'egneenmanket.png', 'eo expents.png', 'fabindia.jpeg', 'farsan.jpeg', 'flammer technologies pvt ltd.png',
  'flammer-logo-horizontal.png', 'forstan cafe.jpg', 'green clean solar.jpeg', 'gujrarat liaving.jpg',
  'hamdan sports complex.png', 'hotel girnar_kathiyawadi.jpg', 'hs structure.png', 'images.png',
  'indo german.png', 'indogenmen.png', 'jashpackaging.jpeg', 'layal al watam.png', 'little millanium.jpeg',
  'logo-bizpack-1024x451.png', 'manavta foundation.webp', 'manavta hospital.png', 'mark cafe.jpg',
  'office24.webp', 'otto valves & rubers.png', 'otto-valves-rubers.png', 'pandit rasturant.jpg',
  'pranav plastic pvt.jpg', 'preloader.png', 'primax-engineers-private-limited-90x90.jpg',
  'qinoxy.jpg', 'rang techno.png', 'rang techno.svg', 'sabaz tourism.jpeg', 'shiv agro.webp',
  'siamp.png', 'srauav dixit advakate.png', 'supriya-association.png', 'swasstik enterpris.webp',
  'tensile staucchar.svg', '3insys.png', 'aatapi.png', 'adf.png', 'aldar.png', 'anibrain.png',
  'associatedpower.png', 'cizzara.png', 'essar.png', 'globaldiscovery.png', 'method.png',
  'nationalfoods.png', 'nexrise.png', 'nhsrcl.png', 'packman.png', 'pizzabell.png', 'railway.png',
  'sawariya.png', 'speedline.png', 'vfxwaala.png', 'vistaprint.png', 'weta.png'
]);

function fullyDecode(str: string): string {
  let decoded = str;
  try {
    while (decoded.includes('%')) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch (_) {
    try {
      decoded = decodeURI(decoded);
    } catch (_) {}
  }
  return decoded;
}

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  let trimmed = String(path).trim();
  if (!trimmed) return '';

  // Instant preview data or blob URIs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const backendBase = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'https://backend.blueboxx.in'
  ).replace(/\/+$/, '');

  // Strip localhost / 127.0.0.1 hardcoded prefixes from saved database paths
  if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
    const storageIdx = trimmed.indexOf('/storage/');
    if (storageIdx !== -1) {
      trimmed = trimmed.substring(storageIdx);
    } else {
      const logoIdx = trimmed.indexOf('/logo/');
      if (logoIdx !== -1) {
        trimmed = trimmed.substring(logoIdx);
      } else {
        const uploadsIdx = trimmed.indexOf('/uploads/');
        if (uploadsIdx !== -1) {
          trimmed = trimmed.substring(uploadsIdx);
        } else {
          const slashIdx = trimmed.indexOf('/', trimmed.indexOf('://') + 3);
          if (slashIdx !== -1) {
            trimmed = trimmed.substring(slashIdx);
          }
        }
      }
    }
  }

  // External absolute URLs
  if (
    (trimmed.startsWith('https://') || trimmed.startsWith('http://')) &&
    !trimmed.includes('localhost') &&
    !trimmed.includes('127.0.0.1')
  ) {
    const decoded = fullyDecode(trimmed);
    return encodeURI(decoded);
  }

  const decoded = fullyDecode(trimmed);
  const baseName = decoded.split('/').pop()?.toLowerCase() || '';

  // Local static root assets in public/ (like /logoblue.png, /Boxxlogo.png)
  if (KNOWN_STATIC_ROOT_FILES.has(baseName)) {
    const rawRootFile = decoded.startsWith('/') ? decoded : '/' + decoded;
    return encodeURI(rawRootFile);
  }

  // Local static company logos in public/logo/
  if (
    decoded.startsWith('/logo/') ||
    decoded.startsWith('logo/') ||
    KNOWN_STATIC_LOGOS.has(baseName)
  ) {
    const rawLogoFile = decoded.startsWith('/logo/')
      ? decoded.substring(6)
      : (decoded.startsWith('logo/') ? decoded.substring(5) : decoded);
    return '/logo/' + encodeURI(rawLogoFile);
  }

  // Other public static frontend assets
  if (
    decoded.startsWith('/students/') ||
    decoded.startsWith('students/') ||
    decoded.startsWith('/images/') ||
    decoded.startsWith('images/') ||
    decoded.startsWith('/testimonials photos/') ||
    decoded.startsWith('testimonials photos/') ||
    decoded.startsWith('/assets/') ||
    decoded.startsWith('assets/') ||
    decoded.startsWith('/icons/') ||
    decoded.startsWith('icons/') ||
    decoded.startsWith('/svg/') ||
    decoded.startsWith('svg/')
  ) {
    const rawPath = decoded.startsWith('/') ? decoded : '/' + decoded;
    return encodeURI(rawPath);
  }

  // Backend uploaded storage path
  let cleanPath = decoded.replace(/\\/g, '/').replace(/^\/+/, '');
  while (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8).replace(/^\/+/, '');
  }

  if (!cleanPath) return '';
  return backendBase + '/storage/' + encodeURI(cleanPath);
};
