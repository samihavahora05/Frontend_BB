/**
 * Utility helper to resolve image and media URLs correctly across
 * local static assets, uploaded backend storage assets, and external URLs.
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  let trimmed = String(path).trim();
  if (!trimmed) return '';

  // If path is a data URI or blob URI, return directly
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Strip hardcoded localhost / 127.0.0.1 if saved from local DB
  if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
    const storageIdx = trimmed.indexOf('/storage/');
    if (storageIdx !== -1) {
      trimmed = trimmed.substring(storageIdx);
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

  // Local static frontend assets stored in public/
  if (
    trimmed.startsWith('/students/') ||
    trimmed.startsWith('students/') ||
    trimmed.startsWith('/images/') ||
    trimmed.startsWith('images/') ||
    trimmed.startsWith('/logo/') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('uploads/') ||
    trimmed.startsWith('logo/') ||
    trimmed.startsWith('/testimonials photos/') ||
    trimmed.startsWith('testimonials photos/') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('assets/')
  ) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // If already an absolute HTTPS/HTTP external URL (e.g. dicebear, ui-avatars, unsplash)
  if (
    (trimmed.startsWith('https://') || trimmed.startsWith('http://')) &&
    !trimmed.includes('localhost') &&
    !trimmed.includes('127.0.0.1')
  ) {
    return trimmed;
  }

  // Backend storage URL resolution
  const backendBase = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'http://127.0.0.1:8000'
  ).replace(/\/+$/, '');

  let cleanPath = trimmed.replace(/\\/g, '/').replace(/^\/+/, '');
  while (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8).replace(/^\/+/, '');
  }

  if (!cleanPath) return '';
  return `${backendBase}/storage/${cleanPath}`;
};
