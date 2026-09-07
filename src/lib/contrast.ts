export interface ContrastEvaluation {
  ratio: number;
  isAcceptable: boolean;
  isInverted: boolean;
  warning: string | null;
}

/**
 * Parse hex color #RGB or #RRGGBB to { r, g, b } (0-255)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return null;

  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculate relative luminance according to WCAG 2.1
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Evaluate contrast and scannability of the QR color combination
 */
export function evaluateContrast(fgHex: string, bgHex: string): ContrastEvaluation {
  const fg = hexToRgb(fgHex) || { r: 0, g: 0, b: 0 };
  const bg = hexToRgb(bgHex) || { r: 255, g: 255, b: 255 };

  const lFg = getRelativeLuminance(fg.r, fg.g, fg.b);
  const lBg = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  const isInverted = lFg > lBg; // Mã sáng trên nền tối

  let warning: string | null = null;
  let isAcceptable = true;

  if (ratio < 2.5) {
    isAcceptable = false;
    warning = `Độ tương phản quá thấp (${ratio.toFixed(1)}:1). Mã QR có thể không quét được trên hầu hết điện thoại. Hãy chọn màu nét đậm hơn và nền sáng hơn.`;
  } else if (ratio < 4.0) {
    isAcceptable = false;
    warning = `Độ tương phản ở mức trung bình (${ratio.toFixed(1)}:1). Một số thiết bị có thể quét chậm hoặc khó nhận diện trong điều kiện thiếu sáng.`;
  } else if (isInverted) {
    warning = `Mã QR có màu sáng trên nền tối (nghịch đảo). Dù tỷ lệ tương phản tốt (${ratio.toFixed(1)}:1), một số máy ảnh cũ có thể không nhận diện được định dạng nền tối.`;
  }

  return {
    ratio: Math.round(ratio * 10) / 10,
    isAcceptable,
    isInverted,
    warning,
  };
}
