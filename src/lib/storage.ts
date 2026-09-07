import { HistoryItem, Theme, QRDataState, QRDesignConfig, ExportedQRConfig } from '../types/qr';

const HISTORY_STORAGE_KEY = 'qr_generator_history_v1';
const THEME_STORAGE_KEY = 'qr_generator_theme_v1';
const MAX_HISTORY_ITEMS = 12;

/**
 * Load history items safely from localStorage
 */
export function getStoredHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_HISTORY_ITEMS);
    }
    return [];
  } catch (err) {
    console.error('Failed to read QR history from localStorage:', err);
    return [];
  }
}

/**
 * Save or prepend a new QR item to history (max 12 items)
 */
export function saveHistoryItem(item: HistoryItem): HistoryItem[] {
  try {
    const current = getStoredHistory();
    // Remove duplicate payload to avoid clutter
    const filtered = current.filter((h) => h.payload !== item.payload);
    const enrichedItem: HistoryItem = {
      ...item,
      hasLogo: Boolean(item.config?.includeLogo && item.config?.logoUrl),
    };
    const updated = [enrichedItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save QR item to localStorage:', err);
    return [];
  }
}

/**
 * Rename a specific history item
 */
export function renameStoredHistoryItem(id: string, customName: string): HistoryItem[] {
  try {
    const current = getStoredHistory();
    const updated = current.map((item) => {
      if (item.id === id) {
        return { ...item, customName: customName.trim() };
      }
      return item;
    });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to rename QR history item:', err);
    return [];
  }
}

/**
 * Delete a specific history item
 */
export function deleteStoredHistoryItem(id: string): HistoryItem[] {
  try {
    const current = getStoredHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete QR item from localStorage:', err);
    return [];
  }
}

/**
 * Clear all history items
 */
export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear QR history from localStorage:', err);
  }
}

/**
 * Get stored theme preference
 */
export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {}
  return 'system';
}

/**
 * Save theme preference
 */
export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme preference:', err);
  }
}

/**
 * Export configuration as formatted JSON string
 */
export function exportConfigAsJson(data: QRDataState, config: QRDesignConfig): string {
  const payload: ExportedQRConfig = {
    version: 1,
    type: data.type,
    data,
    config,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(payload, null, 2);
}
