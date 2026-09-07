import { QRDataState, ExportedQRConfig, QRType, QRDesignConfig } from '../types/qr';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  suggestion?: string;
}

/**
 * Validate URL strictly client-side.
 * If user didn't include protocol (e.g. example.com), suggests https://example.com
 */
export function validateUrl(url: string): ValidationResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Vui lòng nhập địa chỉ URL' };
  }

  // Safety length check (QR Code max ~2953 bytes, keep within reasonable limit)
  if (trimmed.length > 2048) {
    return {
      isValid: false,
      message: 'Địa chỉ URL quá dài (> 2048 ký tự). Vui lòng rút ngắn nội dung.',
    };
  }

  // Auto-prepend check
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    normalized = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(normalized);
    // Ensure it has a valid host with at least one dot or localhost
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return {
        isValid: false,
        message: 'Tên miền không hợp lệ (ví dụ: example.com hoặc https://google.com)',
      };
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      return {
        isValid: true,
        suggestion: normalized,
        message: 'Đã tự động bổ sung tiền tố https://',
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      message: 'Địa chỉ URL không hợp lệ. Vui lòng kiểm tra lại cấu trúc link.',
    };
  }
}

/**
 * Ensure URL has http:// or https:// protocol
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Validate Email address (client-side RFC regex)
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Vui lòng nhập địa chỉ email' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Định dạng email chưa đúng (ví dụ: contact@example.com)' };
  }

  return { isValid: true };
}

/**
 * Validate Phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Vui lòng nhập số điện thoại' };
  }

  // Accepts numbers, optional +, spaces, dashes, parentheses
  const phoneRegex = /^(\+?[0-9\s\-().]{7,20})$/;
  if (!phoneRegex.test(trimmed)) {
    return { isValid: false, message: 'Số điện thoại không hợp lệ (tối thiểu 7 số)' };
  }

  return { isValid: true };
}

/**
 * Validate Wi-Fi credentials
 */
export function validateWifi(ssid: string, password: string, encryption: string): ValidationResult {
  const trimmedSsid = ssid.trim();
  if (!trimmedSsid) {
    return { isValid: false, message: 'Tên mạng Wi-Fi (SSID) không được để trống' };
  }

  if (encryption === 'WPA' && password.length > 0 && password.length < 8) {
    return { isValid: false, message: 'Mật khẩu WPA/WPA2 phải có ít nhất 8 ký tự' };
  }

  return { isValid: true };
}

/**
 * Sanitize filename: remove illegal filesystem chars, normalize whitespace to dashes
 */
export function sanitizeFilename(input: string, fallback = 'qr-code'): string {
  if (!input) return fallback;

  let cleaned = input
    .trim()
    .toLowerCase()
    // Replace characters not allowed in filenames
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    // Replace spaces and consecutive dots/hyphens with a single dash
    .replace(/[\s_.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!cleaned) {
    return fallback;
  }

  // Limit filename length to 50 characters
  return cleaned.slice(0, 50);
}

/**
 * Automatically generate a smart filename based on data state
 * Example: https://sondong-story-map.vercel.app/ -> sondong-story-map-qr.png
 */
export function generateSmartFilename(dataState: QRDataState, extension = 'png'): string {
  const ext = extension.startsWith('.') ? extension.slice(1) : extension;

  switch (dataState.type) {
    case 'url': {
      try {
        const normalized = normalizeUrl(dataState.url.url);
        const parsed = new URL(normalized);
        let host = parsed.hostname.replace(/^www\./, '');
        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        
        let name = '';
        if (pathSegments.length > 0) {
          name = pathSegments[pathSegments.length - 1];
        } else {
          // Extract primary name from hostname (e.g. sondong-story-map.vercel.app -> sondong-story-map)
          const parts = host.split('.');
          if (parts.length >= 2) {
            name = parts[0];
          } else {
            name = host;
          }
        }
        return `${sanitizeFilename(name)}-qr.${ext}`;
      } catch {
        return `qr-code.${ext}`;
      }
    }
    case 'wifi': {
      const ssid = dataState.wifi.ssid.trim();
      const base = ssid ? `wifi-${ssid}` : 'wifi';
      return `${sanitizeFilename(base)}-qr.${ext}`;
    }
    case 'email': {
      const email = dataState.email.email.trim();
      const user = email ? email.split('@')[0] : 'email';
      return `${sanitizeFilename(`email-${user}`)}-qr.${ext}`;
    }
    case 'phone': {
      const phone = dataState.phone.phone.trim().replace(/\D/g, '');
      const base = phone ? `phone-${phone}` : 'phone';
      return `${sanitizeFilename(base)}-qr.${ext}`;
    }
    case 'text': {
      const firstWords = dataState.text.text.trim().slice(0, 20);
      const base = firstWords ? firstWords : 'text';
      return `${sanitizeFilename(base)}-qr.${ext}`;
    }
    default:
      return `qr-code.${ext}`;
  }
}

/**
 * Sanitize an SVG text string to remove scripts and active event handlers
 * Prevents XSS when rendering user-uploaded SVGs
 */
export function sanitizeSvgString(svgText: string): string {
  return svgText
    // Remove script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove inline event handlers (onload, onerror, onclick, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(['\"]).*?\1/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*[^ >]+/gi, '')
    // Remove javascript: pseudo-protocol
    .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href=""');
}

/**
 * Validate imported configuration JSON to ensure integrity and prevent prototype pollution
 */
export function validateImportedConfig(json: unknown): ExportedQRConfig | null {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return null;
  }

  const obj = json as Record<string, unknown>;

  const validTypes: QRType[] = ['url', 'text', 'email', 'phone', 'wifi'];
  const type = obj.type as QRType;
  if (!validTypes.includes(type)) {
    return null;
  }

  const rawData = obj.data as Partial<QRDataState> | undefined;
  const rawConfig = obj.config as Partial<QRDesignConfig> | undefined;

  if (!rawData || !rawConfig) {
    return null;
  }

  // Validate colors
  const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  const fgColor = typeof rawConfig.fgColor === 'string' && hexRegex.test(rawConfig.fgColor)
    ? rawConfig.fgColor
    : '#000000';
  const bgColor = typeof rawConfig.bgColor === 'string' && hexRegex.test(rawConfig.bgColor)
    ? rawConfig.bgColor
    : '#FFFFFF';

  const validSizes = [256, 512, 1024, 2048];
  const size = validSizes.includes(Number(rawConfig.size)) ? (Number(rawConfig.size) as 256 | 512 | 1024 | 2048) : 1024;

  const validEcc = ['L', 'M', 'Q', 'H'];
  const errorCorrectionLevel = validEcc.includes(String(rawConfig.errorCorrectionLevel))
    ? (rawConfig.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H')
    : 'M';

  const sanitizedConfig: QRDesignConfig = {
    fgColor,
    bgColor,
    size,
    errorCorrectionLevel,
    includeLogo: Boolean(rawConfig.includeLogo),
    logoUrl: typeof rawConfig.logoUrl === 'string' && rawConfig.logoUrl.startsWith('data:image/')
      ? rawConfig.logoUrl
      : null,
    logoSizeRatio: typeof rawConfig.logoSizeRatio === 'number'
      ? Math.max(0.14, Math.min(0.25, rawConfig.logoSizeRatio))
      : 0.2,
    margin: typeof rawConfig.margin === 'number' ? Math.max(0, Math.min(8, rawConfig.margin)) : 2,
  };

  const sanitizedData: QRDataState = {
    type,
    url: { url: String(rawData.url?.url || '') },
    text: { text: String(rawData.text?.text || '') },
    email: {
      email: String(rawData.email?.email || ''),
      subject: String(rawData.email?.subject || ''),
      body: String(rawData.email?.body || ''),
    },
    phone: { phone: String(rawData.phone?.phone || '') },
    wifi: {
      ssid: String(rawData.wifi?.ssid || ''),
      password: String(rawData.wifi?.password || ''),
      encryption: rawData.wifi?.encryption === 'WEP' || rawData.wifi?.encryption === 'nopass'
        ? rawData.wifi.encryption
        : 'WPA',
      hidden: Boolean(rawData.wifi?.hidden),
    },
  };

  return {
    version: 1,
    type,
    data: sanitizedData,
    config: sanitizedConfig,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
  };
}
