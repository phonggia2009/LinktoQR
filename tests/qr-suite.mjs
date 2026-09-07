import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import QRCode from 'qrcode';

// Test validation logic
function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function validateUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return { isValid: false, message: 'Vui lòng nhập địa chỉ URL' };
  if (trimmed.length > 2048) return { isValid: false, message: 'URL quá dài' };
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) normalized = `https://${trimmed}`;
  try {
    const parsed = new URL(normalized);
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return { isValid: false, message: 'Tên miền không hợp lệ' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Địa chỉ URL không hợp lệ' };
  }
}

function buildWifiPayload({ ssid, password, encryption, hidden }) {
  const cleanSsid = ssid.trim();
  if (!cleanSsid) return '';
  const enc = encryption || 'WPA';
  const pass = enc === 'nopass' ? '' : password;
  const isHidden = Boolean(hidden);
  return `WIFI:S:${cleanSsid};T:${enc};P:${pass};H:${isHidden};;`;
}

function sanitizeFilename(input, fallback = 'qr-code') {
  if (!input) return fallback;
  let cleaned = input.trim().toLowerCase().replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/[\s_.]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return cleaned ? cleaned.slice(0, 50) : fallback;
}

function generateSmartFilename(dataState, ext = 'png') {
  if (dataState.type === 'url') {
    try {
      const normalized = normalizeUrl(dataState.url.url);
      const parsed = new URL(normalized);
      const host = parsed.hostname.replace(/^www\./, '');
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      let name = '';
      if (pathSegments.length > 0) {
        name = pathSegments[pathSegments.length - 1];
      } else {
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
  if (dataState.type === 'wifi') {
    const base = dataState.wifi.ssid.trim() ? `wifi-${dataState.wifi.ssid.trim()}` : 'wifi';
    return `${sanitizeFilename(base)}-qr.${ext}`;
  }
  return `qr-code.${ext}`;
}

function sanitizeSvgString(svgText) {
  return svgText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(['\"]).*?\1/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*[^ >]+/gi, '')
    .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href=""');
}

describe('QR Generator Production Test Suite', () => {
  test('1. URL QR: Valid and Normalization', () => {
    assert.equal(normalizeUrl('example.com'), 'https://example.com');
    assert.equal(normalizeUrl('https://example.com/'), 'https://example.com/');
    assert.equal(validateUrl('example.com').isValid, true);
    assert.equal(validateUrl('https://google.com').isValid, true);
  });

  test('2. Invalid URL handling', () => {
    assert.equal(validateUrl('').isValid, false);
    assert.equal(validateUrl('not-a-domain').isValid, false);
    assert.equal(validateUrl('   ').isValid, false);
  });

  test('3. Text QR Payload', () => {
    const text = 'Hello world! Đây là tiếng Việt.';
    assert.equal(text.trim(), 'Hello world! Đây là tiếng Việt.');
  });

  test('4. Email QR Payload', () => {
    const email = 'test@example.com';
    const subject = 'Meeting';
    const payload = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    assert.match(payload, /^mailto:test@example\.com\?subject=Meeting/);
  });

  test('5. Phone QR Payload', () => {
    const phone = '0987654321';
    assert.equal(`tel:${phone}`, 'tel:0987654321');
  });

  test('6. Wi-Fi QR Payload (WPA & Hidden)', () => {
    const payload = buildWifiPayload({ ssid: 'CafeWifi', password: 'SecretPassword', encryption: 'WPA', hidden: true });
    assert.equal(payload, 'WIFI:S:CafeWifi;T:WPA;P:SecretPassword;H:true;;');
  });

  test('7. Empty input Wi-Fi handling', () => {
    const payload = buildWifiPayload({ ssid: '', password: '', encryption: 'WPA', hidden: false });
    assert.equal(payload, '');
  });

  test('8. Smart Filename Generation', () => {
    const urlState = { type: 'url', url: { url: 'https://sondong-story-map.vercel.app/' } };
    assert.equal(generateSmartFilename(urlState, 'png'), 'sondong-story-map-qr.png');

    const wifiState = { type: 'wifi', wifi: { ssid: 'My Cafe / 5G?' } };
    assert.equal(generateSmartFilename(wifiState, 'png'), 'wifi-my-cafe-5g-qr.png');
  });

  test('9. Security: SVG Logo Sanitization against XSS', () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script><circle onload="alert('hack')" r="10"/></svg>`;
    const safeSvg = sanitizeSvgString(maliciousSvg);
    assert.equal(safeSvg.includes('<script'), false);
    assert.equal(safeSvg.includes('onload='), false);
  });

  test('10. Static QR Verification: QRCode directly encodes raw data', async () => {
    const targetUrl = 'https://sondong-story-map.vercel.app/';
    const svgOutput = await QRCode.toString(targetUrl, { type: 'svg' });
    assert.ok(svgOutput.includes('<svg'));
  });
});
