export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRSize = 256 | 512 | 1024 | 2048;

export interface UrlFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface EmailFormData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface WifiFormData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface QRDesignConfig {
  fgColor: string;
  bgColor: string;
  size: QRSize;
  errorCorrectionLevel: QRErrorCorrectionLevel;
  includeLogo: boolean;
  logoUrl: string | null;
  logoSizeRatio: number; // 0.15 - 0.25 (15% - 25%)
  margin: number;
}

export interface QRDataState {
  type: QRType;
  url: UrlFormData;
  text: TextFormData;
  email: EmailFormData;
  phone: PhoneFormData;
  wifi: WifiFormData;
}

export interface HistoryItem {
  id: string;
  type: QRType;
  title: string;
  payload: string;
  displaySummary: string;
  createdAt: number;
  config: QRDesignConfig;
}

export type Theme = 'light' | 'dark' | 'system';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
