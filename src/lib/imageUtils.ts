/**
 * Utility helper to resolve image and media URLs correctly across
 * local static assets, uploaded backend storage assets, and external URLs.
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  let trimmed = String(path).trim();
  if (!trimmed) return '';

  // If path is a data URI or blob URI, return directly (instant preview on upload)
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Base backend URL for API and uploaded media
  const backendBase = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'https://backend.blueboxx.in'
  ).replace(/\/+$/, '');

  // Strip hardcoded localhost / 127.0.0.1 if saved from local DB
  if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
    const storageIdx = trimmed.indexOf('/storage/');
    if (storageIdx !== -1) {
      trimmed = trimmed.substring(storageIdx);
    } else {
      const uploadsIdx = trimmed.indexOf('/uploads/');
      if (uploadsIdx !== -1) {
        trimmed = trimmed.substring(uploadsIdx);
      } else {
        const studentsIdx = trimmed.indexOf('/students/');
        if (studentsIdx !== -1) {
          trimmed = trimmed.substring(studentsIdx);
        } else {
          const slashIdx = trimmed.indexOf('/', trimmed.indexOf('://') + 3);
          if (slashIdx !== -1) {
            trimmed = trimmed.substring(slashIdx);
          }
        }
      }
    }
  }

  // If already an absolute HTTPS/HTTP external URL (e.g. dicebear, ui-avatars, unsplash)
  if (
    (trimmed.startsWith('https://') || trimmed.startsWith('http://')) &&
    !trimmed.includes('localhost') &&
    !trimmed.includes('127.0.0.1')
  ) {
    return encodeURI(decodeURI(trimmed));
  }

  // Local static frontend assets stored in public/
  if (
    trimmed.startsWith('/students/') ||
    trimmed.startsWith('students/') ||
    trimmed.startsWith('/images/') ||
    trimmed.startsWith('images/') ||
    trimmed.startsWith('/logo/') ||
    trimmed.startsWith('logo/') ||
    trimmed.startsWith('/testimonials photos/') ||
    trimmed.startsWith('testimonials photos/') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('assets/') ||
    trimmed.startsWith('/icons/') ||
    trimmed.startsWith('icons/') ||
    trimmed.startsWith('/svg/') ||
    trimmed.startsWith('svg/')
  ) {
    const rawPath = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
    return encodeURI(decodeURI(rawPath));
  }

  // Clean relative backend storage or uploads path
  let cleanPath = trimmed.replace(/\\/g, '/').replace(/^\/+/, '');
  while (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8).replace(/^\/+/, '');
  }

  if (!cleanPath) return '';
  const safePath = encodeURI(decodeURI(cleanPath));
  return backendBase + '/storage/' + safePath;
};