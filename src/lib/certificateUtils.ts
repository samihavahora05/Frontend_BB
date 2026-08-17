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
      id: 'header_subtitle',
      name: 'Header Subtitle',
      content: 'THIS CERTIFICATE IS PROUDLY PRESENTED TO',
      positionX: 50,
      positionY: 34,
      width: 80,
      fontFamily: 'Cinzel, serif',
      fontSize: 18,
      fontWeight: 600,
      fontStyle: 'normal',
      fontColor: '#475569',
      textAlignment: 'center',
      letterSpacing: 2,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      enabled: true,
    },
    {
      id: 'student_name',
      name: 'Student Name',
      content: '{student_name}',
      positionX: 50,
      positionY: 45,
      width: 80,
      fontFamily: 'Playfair Display, Georgia, serif',
      fontSize: 52,
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontColor: '#0f172a',
      textAlignment: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      enabled: true,
    },
    {
      id: 'course_title',
      name: 'Course Title',
      content: 'For successfully completing {course_title}',
      positionX: 50,
      positionY: 58,
      width: 80,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 22,
      fontWeight: 500,
      fontStyle: 'normal',
      fontColor: '#334155',
      textAlignment: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      enabled: true,
    },
    {
      id: 'issue_date',
      name: 'Issue Date',
      content: 'Issued on: {issue_date}',
      positionX: 28,
      positionY: 80,
      width: 40,
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: 400,
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
      content: 'Certificate ID: {certificate_id}',
      positionX: 72,
      positionY: 80,
      width: 40,
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: 400,
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

      const fontScale = targetHeight / 1414; // Baseline standard certificate height ratio
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
