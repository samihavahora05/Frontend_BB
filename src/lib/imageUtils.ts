/**
 * Utility helper to resolve image and media URLs correctly across
 * local static assets, uploaded backend storage assets, and external URLs.
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  const trimmed = String(path).trim();
  if (!trimmed) return '';

  // Already absolute or base64 / blob URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
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
    trimmed.startsWith('testimonials photos/')
  ) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // Backend storage URL resolution
  const backendBase = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'https://backend.blueboxx.in'
  ).replace(/\/+$/, '');

  const cleanPath = trimmed.replace(/^\/+/, '');

  if (cleanPath.startsWith('storage/')) {
    return `${backendBase}/${cleanPath}`;
  }

  return `${backendBase}/storage/${cleanPath}`;
};
