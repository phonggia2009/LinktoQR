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
        message: 'Tên miền không hợp lệ (ví dụ: example.com hoặc https://google.com)'
      };
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      return {
        isValid: true,
        suggestion: normalized,
        message: 'Đã tự động bổ sung tiền tố https://'
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      message: 'Địa chỉ URL không hợp lệ. Vui lòng kiểm tra lại cấu trúc link.'
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
