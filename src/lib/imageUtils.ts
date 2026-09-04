/**
 * Utility helper to resolve image and media URLs correctly across
 * local static assets, uploaded backend storage assets, and external URLs.
 */

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
  'tensile staucchar.svg', '3insys.png'
]);

function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    try {
      return decodeURI(str);
    } catch (e2) {
      return str;
    }
  }
}

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  let trimmed = String(path).trim();
  if (!trimmed) return '';

  // Data or blob preview URIs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const backendBase = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'https://backend.blueboxx.in'
  ).replace(/\/+$/, '');

  // Strip localhost / 127.0.0.1 origins from saved database paths
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
    const decoded = safeDecode(trimmed);
    return encodeURI(decoded);
  }

  const decodedPath = safeDecode(trimmed);
  const baseName = decodedPath.split('/').pop()?.toLowerCase() || '';

  // Local static company logos in public/logo/
  if (
    decodedPath.startsWith('/logo/') ||
    decodedPath.startsWith('logo/') ||
    KNOWN_STATIC_LOGOS.has(baseName)
  ) {
    const rawLogoFile = decodedPath.startsWith('/logo/')
      ? decodedPath.substring(6)
      : (decodedPath.startsWith('logo/') ? decodedPath.substring(5) : decodedPath);
    return '/logo/' + encodeURI(rawLogoFile);
  }

  // Other public static frontend assets
  if (
    decodedPath.startsWith('/students/') ||
    decodedPath.startsWith('students/') ||
    decodedPath.startsWith('/images/') ||
    decodedPath.startsWith('images/') ||
    decodedPath.startsWith('/testimonials photos/') ||
    decodedPath.startsWith('testimonials photos/') ||
    decodedPath.startsWith('/assets/') ||
    decodedPath.startsWith('assets/') ||
    decodedPath.startsWith('/icons/') ||
    decodedPath.startsWith('icons/') ||
    decodedPath.startsWith('/svg/') ||
    decodedPath.startsWith('svg/')
  ) {
    const rawPath = decodedPath.startsWith('/') ? decodedPath : '/' + decodedPath;
    return encodeURI(rawPath);
  }

  // Backend uploaded storage path
  let cleanPath = decodedPath.replace(/\\/g, '/').replace(/^\/+/, '');
  while (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8).replace(/^\/+/, '');
  }

  if (!cleanPath) return '';
  return backendBase + '/storage/' + encodeURI(cleanPath);
};
