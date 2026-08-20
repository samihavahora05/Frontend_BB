export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

export interface CertificateElement {
  id: string;
  name: string;
  content: string;
  positionX: number;
  positionY: number;
  width?: number;
  fontFamily: string;
  fontSize: number;
  fontWeight?: string | number;
  fontStyle?: string;
  fontColor: string;
  textAlignment: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  enabled: boolean;
  autoFit?: boolean;
  minFontSize?: number;
}

export function getImageDimensions(fileOrUrl: File | string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const aspectRatio = height > 0 ? width / height : 1.414;
      let orientation: 'landscape' | 'portrait' | 'square' = 'landscape';
      if (width < height) orientation = 'portrait';
      else if (width === height) orientation = 'square';

      if (typeof fileOrUrl !== 'string') {
        URL.revokeObjectURL(img.src);
      }

      resolve({ width, height, aspectRatio, orientation });
    };
    img.onerror = (err) => {
      reject(err);
    };

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      img.src = URL.createObjectURL(fileOrUrl);
    }
  });
}

export function getDefaultCertificateElements(): CertificateElement[] {
  return [
    {
      id: 'cert_title',
      name: 'Certificate Title',
      content: 'CERTIFICATE',
      positionX: 50,
      positionY: 20,
      width: 85,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 48,
      fontWeight: 800,
      fontStyle: 'normal',
      fontColor: '#0f172a',
      textAlignment: 'center',
      letterSpacing: 6,
      lineHeight: 1.1,
      textTransform: 'uppercase',
      enabled: true,
    },
    {
      id: 'cert_subtitle',
      name: 'Certificate Subtitle',
      content: 'OF ACHIEVEMENT',
      positionX: 50,
      positionY: 28,
      width: 85,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 16,
      fontWeight: 600,
      fontStyle: 'normal',
      fontColor: '#b45309',
      textAlignment: 'center',
      letterSpacing: 8,
      lineHeight: 1.1,
      textTransform: 'uppercase',
      enabled: true,
    },
    {
      id: 'header_subtitle',
      name: 'Header Subtitle',
      content: 'PROUDLY PRESENTED TO',
      positionX: 50,
      positionY: 37,
      width: 80,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 13,
      fontWeight: 600,
      fontStyle: 'normal',
      fontColor: '#64748b',
      textAlignment: 'center',
      letterSpacing: 4,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      enabled: true,
    },
    {
      id: 'student_name',
      name: 'Student Name',
      content: '{student_name}',
      positionX: 50,
      positionY: 49,
      width: 85,
      fontFamily: 'Playfair Display, Georgia, serif',
      fontSize: 58,
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontColor: '#0f172a',
      textAlignment: 'center',
      letterSpacing: 1,
      lineHeight: 1.2,
      textTransform: 'none',
      enabled: true,
    },
    {
      id: 'course_title',
      name: 'Course Title',
      content: 'For successfully completing the course "{course_title}"',
      positionX: 50,
      positionY: 63,
      width: 85,
      fontFamily: 'Inter, sans-serif',
      fontSize: 18,
      fontWeight: 500,
      fontStyle: 'normal',
      fontColor: '#334155',
      textAlignment: 'center',
      letterSpacing: 0,
      lineHeight: 1.3,
      textTransform: 'none',
      enabled: true,
    },
    {
      id: 'issue_date',
      name: 'Issue Date',
      content: 'Issued: {issue_date}',
      positionX: 25,
      positionY: 83,
      width: 35,
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
      fontWeight: 500,
      fontStyle: 'normal',
      fontColor: '#64748b',
      textAlignment: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      enabled: true,
    },
    {
      id: 'certificate_id',
      name: 'Certificate ID',
      content: 'Verification ID: {certificate_id}',
      positionX: 75,
      positionY: 83,
      width: 35,
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
      fontWeight: 500,
      fontStyle: 'normal',
      fontColor: '#64748b',
      textAlignment: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      enabled: true,
    },
  ];
}

export function normalizeCertificateElements(data: any): CertificateElement[] {
  let list: any[] = [];
  if (!data) return getDefaultCertificateElements();

  if (Array.isArray(data)) {
    list = data;
  } else if (typeof data === 'object') {
    if (Array.isArray(data.elements)) {
      list = data.elements;
    } else if (data.layout_settings && Array.isArray(data.layout_settings.elements)) {
      list = data.layout_settings.elements;
    } else if (typeof data.elements === 'string') {
      try {
        list = JSON.parse(data.elements);
      } catch (e) {
        list = [];
      }
    } else if (data.layout_settings && typeof data.layout_settings.elements === 'string') {
      try {
        list = JSON.parse(data.layout_settings.elements);
      } catch (e) {
        list = [];
      }
    }
  }

  if (!Array.isArray(list) || list.length === 0) {
    return getDefaultCertificateElements();
  }

  return list.map((item: any, idx: number) => ({
    id: String(item.id || `element_${idx}_${Date.now()}`),
    name: String(item.name || `Text ${idx + 1}`),
    content: String(item.content ?? item.text ?? ''),
    positionX: typeof item.positionX === 'number' ? item.positionX : (typeof item.posX === 'number' ? item.posX : 50),
    positionY: typeof item.positionY === 'number' ? item.positionY : (typeof item.posY === 'number' ? item.posY : 50),
    width: typeof item.width === 'number' ? item.width : 70,
    fontFamily: String(item.fontFamily || item.font_family || 'sans-serif'),
    fontSize: typeof item.fontSize === 'number' ? item.fontSize : (typeof item.font_size === 'number' ? item.font_size : 24),
    fontWeight: item.fontWeight ?? item.font_weight ?? 500,
    fontStyle: String(item.fontStyle || item.font_style || 'normal'),
    fontColor: String(item.fontColor || item.font_color || item.color || '#0f172a'),
    textAlignment: (item.textAlignment || item.text_align || item.textAlign || 'center') as 'left' | 'center' | 'right',
    letterSpacing: typeof item.letterSpacing === 'number' ? item.letterSpacing : 0,
    lineHeight: typeof item.lineHeight === 'number' ? item.lineHeight : 1.2,
    textTransform: (item.textTransform || item.text_transform || 'none') as 'none' | 'capitalize' | 'uppercase' | 'lowercase',
    enabled: item.enabled !== false,
    autoFit: typeof item.autoFit === 'boolean' ? item.autoFit : (typeof item.auto_fit === 'boolean' ? item.auto_fit : undefined),
    minFontSize: typeof item.minFontSize === 'number' ? item.minFontSize : (typeof item.min_font_size === 'number' ? item.min_font_size : undefined),
  }));
}

export function interpolateVariables(text: string, data: Record<string, any> = {}): string {
  if (!text) return '';
  
  let result = text;

  const replacements: Record<string, string> = {
    '{student_name}': data.studentName || data.student_name || data['[Student Name]'] || '[Student Name]',
    '[Student Name]': data.studentName || data.student_name || data['[Student Name]'] || '[Student Name]',
    '{course_title}': data.courseTitle || data.course_title || data.title || '[Course Title]',
    '[Course Title]': data.courseTitle || data.course_title || data.title || '[Course Title]',
    '{issue_date}': data.issueDate || data.issue_date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    '[Issue Date]': data.issueDate || data.issue_date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    '{certificate_id}': data.certificateId || data.certificate_id || 'CERT-XXXXXX',
    '[Certificate ID]': data.certificateId || data.certificate_id || 'CERT-XXXXXX',
  };

  Object.entries(replacements).forEach(([key, val]) => {
    result = result.split(key).join(val);
  });

  Object.entries(data).forEach(([key, val]) => {
    if (typeof val === 'string' || typeof val === 'number') {
      result = result.split(`{${key}}`).join(String(val));
      result = result.split(`[${key}]`).join(String(val));
    }
  });

  return result;
}

export function renderCertificateToCanvas(
  canvas: HTMLCanvasElement,
  backgroundSrc: string,
  options: {
    title?: string;
    showTitle?: string;
    elements: CertificateElement[];
    studentName?: string;
    courseTitle?: string;
    issueDate?: string;
    certificateId?: string;
    data?: Record<string, string>;
  }
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {
          // ignore font loading timeouts
        }
      }

      const naturalW = img.naturalWidth || img.width || 2400;
      const naturalH = img.naturalHeight || img.height || 1697;

      // Target high resolution (minimum 2400px width) for ultra-sharp HD PNG & PDF output
      const minHdWidth = 2400;
      const scaleFactor = naturalW < minHdWidth ? (minHdWidth / naturalW) : 1;

      const targetWidth = Math.round(naturalW * scaleFactor);
      const targetHeight = Math.round(naturalH * scaleFactor);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get 2d context from canvas'));
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const varData: Record<string, string> = {
        title: options.title || '',
        studentName: options.studentName || '[Student Name]',
        student_name: options.studentName || '[Student Name]',
        courseTitle: options.courseTitle || options.title || '[Course Title]',
        course_title: options.courseTitle || options.title || '[Course Title]',
        issueDate: options.issueDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        certificateId: options.certificateId || 'CERT-XXXXXX',
        ...(options.data || {}),
      };

      const fontScale = Math.max(0.85, targetHeight / 750);
      const elements = options.elements || [];

      elements.forEach((el) => {
        if (!el.enabled) return;

        let content = interpolateVariables(el.content, varData);

        if (el.textTransform === 'uppercase') {
          content = content.toUpperCase();
        } else if (el.textTransform === 'lowercase') {
          content = content.toLowerCase();
        } else if (el.textTransform === 'capitalize') {
          content = content.replace(/\b\w/g, (char) => char.toUpperCase());
        }

        let computedFontSize = Math.max(12, Math.round((el.fontSize || 24) * fontScale));

        ctx.save();

        const fontStyle = el.fontStyle || 'normal';
        const fontWeight = el.fontWeight || 500;
        const fontFamily = el.fontFamily || 'Georgia, serif';

        ctx.font = `${fontStyle} ${fontWeight} ${computedFontSize}px ${fontFamily}`;

        if (el.autoFit && el.width) {
          const maxWidthPx = (el.width / 100) * targetWidth;
          const minFontSizePx = Math.max(10, Math.round((el.minFontSize || 14) * fontScale));
          let measuredWidth = ctx.measureText(content).width;

          while (measuredWidth > maxWidthPx && computedFontSize > minFontSizePx) {
            computedFontSize -= 1;
            ctx.font = `${fontStyle} ${fontWeight} ${computedFontSize}px ${fontFamily}`;
            measuredWidth = ctx.measureText(content).width;
          }
        }

        ctx.fillStyle = el.fontColor || '#0f172a';
        ctx.textAlign = el.textAlignment || 'center';
        ctx.textBaseline = 'middle';

        const posX = ((el.positionX ?? 50) / 100) * targetWidth;
        const posY = ((el.positionY ?? 50) / 100) * targetHeight;

        ctx.fillText(content, posX, posY);
        ctx.restore();
      });

      resolve(canvas);
    };

    img.onerror = () => reject(new Error('Failed to load certificate background image'));
    img.src = backgroundSrc;
  });
}

export const DEFAULT_CERTIFICATE_BG_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080"><defs><linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231B2A6B"/><stop offset="100%" stop-color="%230B133B"/></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F3E5AB"/><stop offset="30%" stop-color="%23D4AF37"/><stop offset="70%" stop-color="%23AA7C11"/><stop offset="100%" stop-color="%23F3E5AB"/></linearGradient></defs><rect x="0" y="0" width="1920" height="1080" fill="%23FFFFFF"/><rect x="30" y="30" width="1860" height="1020" fill="none" stroke="url(%23navyGrad)" stroke-width="28" rx="8"/><rect x="68" y="68" width="1784" height="944" fill="none" stroke="url(%23goldGrad)" stroke-width="6" rx="4"/><rect x="80" y="80" width="1760" height="920" fill="none" stroke="%231B2A6B" stroke-width="2" rx="2"/><polygon points="860,68 1060,68 960,118" fill="url(%23goldGrad)"/><polygon points="30,30 150,30 30,150" fill="url(%23goldGrad)"/><polygon points="30,30 110,30 30,110" fill="url(%23navyGrad)"/><polygon points="1890,30 1890,150 1770,30" fill="url(%23goldGrad)"/><polygon points="1890,30 1890,110 1810,30" fill="url(%23navyGrad)"/><polygon points="30,1050 30,930 150,1050" fill="url(%23goldGrad)"/><polygon points="30,1050 30,970 110,1050" fill="url(%23navyGrad)"/><polygon points="1890,1050 1770,1050 1890,930" fill="url(%23goldGrad)"/><polygon points="1890,1050 1810,1050 1890,970" fill="url(%23navyGrad)"/></svg>`;

export async function generateCertificateDownloadImage(options: {
  template?: any;
  templateId?: string | number;
  templatesList?: any[];
  studentName: string;
  courseTitle: string;
  issueDate?: string;
  certificateId?: string;
  bgSrc?: string;
}) {
  let template = options.template;
  if (!template || Object.keys(template).length === 0) {
    if (options.templatesList && Array.isArray(options.templatesList)) {
      template = options.templatesList.find((t: any) => String(t.id) === String(options.templateId)) || options.templatesList[0];
    }
  }

  if (!template || Object.keys(template).length === 0) {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('bb_cert_templates_v1') : null;
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list) && list.length > 0) {
          template = list.find((t: any) => String(t.id) === String(options.templateId)) || list[0];
        }
      }
    } catch (e) {
      // ignore
    }
  }

  template = template || {};
  const bgSrc = options.bgSrc || template.bg_image || template.background_image || template.background_image_path || DEFAULT_CERTIFICATE_BG_SVG;
  const layout = template.layout_settings || template || {};
  const elements = normalizeCertificateElements(template);

  const cleanStudentName = (options.studentName && options.studentName !== 'Student Name' && options.studentName !== 'Student') 
    ? options.studentName 
    : (typeof window !== 'undefined' ? (localStorage.getItem('user_name') || 'Student') : 'Student');

  const cleanCourseTitle = (options.courseTitle && options.courseTitle !== 'Course Title') 
    ? options.courseTitle 
    : 'Certificate of Completion';

  const canvas = document.createElement('canvas');
  await renderCertificateToCanvas(canvas, bgSrc, {
    title: cleanCourseTitle || template.title || layout.title || 'Certificate of Completion',
    showTitle: template.show_title ?? layout.showTitle ?? true,
    elements,
    studentName: cleanStudentName,
    courseTitle: cleanCourseTitle,
    issueDate: options.issueDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificateId: options.certificateId || 'CERT-XXXXXX',
  });

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `Certificate_${options.certificateId || cleanCourseTitle}.png`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) {
      a.parentNode.removeChild(a);
    }
  }, 200);
}

export function exportCanvasToPDF(canvas: HTMLCanvasElement, filename: string) {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page { size: landscape; margin: 0; }
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #fff; height: 100vh; overflow: hidden; }
          img { max-width: 100%; max-height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" onload="window.print();" />
      </body>
    </html>
  `);
  printWindow.document.close();
}
