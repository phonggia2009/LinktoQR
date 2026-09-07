import { WifiFormData } from '../types/qr';

/**
 * Escape special characters in Wi-Fi fields according to standard MeCard / Wi-Fi QR spec:
 * \ -> \\
 * ; -> \;
 * , -> \,
 * : -> \:
 * " -> \"
 */
function escapeWifiField(str: string): string {
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Build standard Wi-Fi QR string
 * Format: WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<PASSWORD>;H:<true|false>;;
 */
export function buildWifiPayload(data: WifiFormData): string {
  const ssid = escapeWifiField(data.ssid.trim());
  const type = data.encryption;
  const password = data.encryption !== 'nopass' ? escapeWifiField(data.password) : '';
  const hidden = data.hidden ? 'true' : 'false';

  let payload = `WIFI:S:${ssid};T:${type};`;
  if (data.encryption !== 'nopass') {
    payload += `P:${password};`;
  }
  if (data.hidden) {
    payload += `H:${hidden};`;
  }
  payload += ';';

  return payload;
}
