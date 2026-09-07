import QRCode from 'qrcode';
import { QRDataState, QRDesignConfig } from '../types/qr';
import { buildWifiPayload } from './wifi';
import { normalizeUrl } from './validation';

/**
 * Generate standard raw static payload string based on QR data state.
 * 100% Client-side. Direct encoding without any intermediary server, tracking, or redirect.
 */
export function generatePayload(data: QRDataState): string {
  switch (data.type) {
    case 'url': {
      return normalizeUrl(data.url.url);
    }
    case 'text': {
      return data.text.text.trim();
    }
    case 'email': {
      const email = data.email.email.trim();
      if (!email) return '';
      const params = new URLSearchParams();
      if (data.email.subject.trim()) params.append('subject', data.email.subject.trim());
      if (data.email.body.trim()) params.append('body', data.email.body.trim());
      const query = params.toString();
      return query ? `mailto:${email}?${query}` : `mailto:${email}`;
    }
    case 'phone': {
      const phone = data.phone.phone.trim();
      return phone ? `tel:${phone}` : '';
    }
    case 'wifi': {
      return buildWifiPayload(data.wifi);
    }
    default:
      return '';
  }
}

/**
 * Get display title and concise summary for a given payload
 */
export function getPayloadSummary(data: QRDataState): { title: string; summary: string } {
  switch (data.type) {
    case 'url':
      return {
        title: 'Liên kết Website (URL)',
        summary: normalizeUrl(data.url.url) || 'Chưa nhập URL',
      };
    case 'text':
      return {
        title: 'Đoạn văn bản (Text)',
        summary: data.text.text.trim() || 'Chưa nhập văn bản',
      };
    case 'email':
      return {
        title: 'Thư điện tử (Email)',
        summary: data.email.email.trim()
          ? `${data.email.email.trim()}${data.email.subject ? ` - ${data.email.subject}` : ''}`
          : 'Chưa nhập Email',
      };
    case 'phone':
      return {
        title: 'Số điện thoại (Phone)',
        summary: data.phone.phone.trim() || 'Chưa nhập số điện thoại',
      };
    case 'wifi':
      return {
        title: 'Mạng Wi-Fi',
        summary: data.wifi.ssid.trim()
          ? `SSID: ${data.wifi.ssid.trim()} (${data.wifi.encryption})`
          : 'Chưa nhập tên Wi-Fi',
      };
  }
}

/**
 * Helper to load an image element from a URL / Data URI safely
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Render QR Code onto an existing HTMLCanvasElement (with logo if configured)
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  config: QRDesignConfig,
  renderSize?: number
): Promise<void> {
  if (!payload) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  const targetWidth = renderSize || config.size;
  // If logo is included, enforce 'H' error correction level for reliable scanning
  const errorLevel = config.includeLogo && config.logoUrl ? 'H' : config.errorCorrectionLevel;

  await QRCode.toCanvas(canvas, payload, {
    width: targetWidth,
    margin: config.margin,
    errorCorrectionLevel: errorLevel,
    color: {
      dark: config.fgColor,
      light: config.bgColor,
    },
  });

  // Đặt lại style để canvas luôn co giãn 100% theo container, không bị vỡ layout trên mobile
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.objectFit = 'contain';
  canvas.style.aspectRatio = '1 / 1';

  // If logo is enabled and provided, draw it centered with rounded background badge
  if (config.includeLogo && config.logoUrl) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const logoImg = await loadImage(config.logoUrl);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate logo dimensions
      const logoSize = Math.floor(canvasWidth * config.logoSizeRatio);
      const padding = Math.max(4, Math.floor(logoSize * 0.12));
      const badgeSize = logoSize + padding * 2;
      const cornerRadius = Math.floor(badgeSize * 0.22);

      const centerX = (canvasWidth - badgeSize) / 2;
      const centerY = (canvasHeight - badgeSize) / 2;

      ctx.save();

      // Draw rounded background badge shield behind the logo
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(centerX, centerY, badgeSize, badgeSize, cornerRadius);
      } else {
        ctx.rect(centerX, centerY, badgeSize, badgeSize);
      }
      ctx.fillStyle = config.bgColor;
      ctx.fill();

      // Subtle border on the badge
      ctx.lineWidth = Math.max(1, Math.floor(badgeSize * 0.03));
      ctx.strokeStyle = config.fgColor + '25';
      ctx.stroke();

      // Draw the logo inside preserving aspect ratio
      const logoX = centerX + padding;
      const logoY = centerY + padding;

      const aspect = (logoImg.naturalWidth || logoImg.width) / (logoImg.naturalHeight || logoImg.height);
      let drawW = logoSize;
      let drawH = logoSize;
      let drawX = logoX;
      let drawY = logoY;

      if (aspect > 1) {
        drawH = logoSize / aspect;
        drawY = logoY + (logoSize - drawH) / 2;
      } else if (aspect < 1) {
        drawW = logoSize * aspect;
        drawX = logoX + (logoSize - drawW) / 2;
      }

      ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
      ctx.restore();
    } catch (err) {
      console.warn('Could not load logo for canvas render:', err);
    }
  }
}

/**
 * Generate full-resolution PNG Blob at specified resolution
 */
export async function generateQRPngBlob(
  payload: string,
  config: QRDesignConfig,
  targetSize?: number
): Promise<Blob> {
  const exportSize = targetSize || config.size;
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = exportSize;
  offscreenCanvas.height = exportSize;

  await renderQRToCanvas(offscreenCanvas, payload, config, exportSize);

  return new Promise((resolve, reject) => {
    offscreenCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate PNG blob'));
      }
    }, 'image/png');
  });
}

/**
 * Generate pure vector standalone SVG string
 */
export async function generateQRSVG(
  payload: string,
  config: QRDesignConfig
): Promise<string> {
  const errorLevel = config.includeLogo && config.logoUrl ? 'H' : config.errorCorrectionLevel;

  let svgString = await QRCode.toString(payload, {
    type: 'svg',
    margin: config.margin,
    errorCorrectionLevel: errorLevel,
    color: {
      dark: config.fgColor,
      light: config.bgColor,
    },
  });

  // If logo is enabled and present, embed it inside SVG safely
  if (config.includeLogo && config.logoUrl) {
    try {
      const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
      if (viewBoxMatch) {
        const parts = viewBoxMatch[1].split(' ').map(Number);
        const width = parts[2] || 100;
        const height = parts[3] || 100;

        const logoSize = width * config.logoSizeRatio;
        const padding = logoSize * 0.12;
        const badgeSize = logoSize + padding * 2;
        const cornerRadius = badgeSize * 0.22;

        const centerX = (width - badgeSize) / 2;
        const centerY = (height - badgeSize) / 2;

        const logoX = centerX + padding;
        const logoY = centerY + padding;

        const logoElement = `
  <!-- Logo Badge Centerpiece -->
  <g id="qr-logo-badge">
    <rect x="${centerX.toFixed(2)}" y="${centerY.toFixed(2)}" width="${badgeSize.toFixed(2)}" height="${badgeSize.toFixed(2)}" rx="${cornerRadius.toFixed(2)}" fill="${config.bgColor}" stroke="${config.fgColor}" stroke-opacity="0.15" stroke-width="${(badgeSize * 0.03).toFixed(2)}" />
    <image href="${config.logoUrl}" x="${logoX.toFixed(2)}" y="${logoY.toFixed(2)}" width="${logoSize.toFixed(2)}" height="${logoSize.toFixed(2)}" preserveAspectRatio="xMidYMid meet" />
  </g>
</svg>`;

        svgString = svgString.replace('</svg>', logoElement);
      }
    } catch (err) {
      console.warn('Failed to embed logo into SVG:', err);
    }
  }

  return svgString;
}

/**
 * Copy image Blob to clipboard
 */
export async function copyImageBlobToClipboard(blob: Blob): Promise<boolean> {
  if (!navigator.clipboard || typeof window.ClipboardItem === 'undefined') {
    return false;
  }

  try {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  }
}

/**
 * Copy plain text to clipboard
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }

  // Fallback for older browsers
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Trigger Web Share API if supported
 */
export async function shareQRCode(
  title: string,
  text: string,
  url?: string,
  blob?: Blob
): Promise<{ success: boolean; isSupported: boolean }> {
  if (!navigator.share) {
    return { success: false, isSupported: false };
  }

  try {
    const shareData: ShareData = {
      title,
      text,
    };

    if (url && /^https?:\/\//i.test(url)) {
      shareData.url = url;
    }

    // Try sharing with file if supported
    if (blob && navigator.canShare) {
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }
    }

    await navigator.share(shareData);
    return { success: true, isSupported: true };
  } catch (err) {
    // AbortError is normal when user cancels dialog
    if ((err as Error).name === 'AbortError') {
      return { success: false, isSupported: true };
    }
    console.warn('Web Share failed:', err);
    return { success: false, isSupported: true };
  }
}
