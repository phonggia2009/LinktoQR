import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  QRDataState,
  QRDesignConfig,
  HistoryItem,
  Theme,
} from './types/qr';
import {
  getStoredHistory,
  saveHistoryItem,
  renameStoredHistoryItem,
  deleteStoredHistoryItem,
  clearStoredHistory,
  getStoredTheme,
  setStoredTheme,
} from './lib/storage';
import { generatePayload, getPayloadSummary, generateQRPngBlob, generateQRSVG } from './lib/qr';
import { generateSmartFilename } from './lib/validation';
import { ToastProvider, useToast } from './components/Toast';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QRGenerator } from './components/QRGenerator';
import { QRHistory } from './components/QRHistory';
import { GuideSection } from './components/GuideSection';
import { PrivacySection } from './components/PrivacySection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { PrintView } from './components/PrintView';

const INITIAL_CONFIG: QRDesignConfig = {
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  size: 1024,
  errorCorrectionLevel: 'M',
  includeLogo: false,
  logoUrl: null,
  logoSizeRatio: 0.2,
  margin: 2,
};

const INITIAL_DATA_STATE: QRDataState = {
  type: 'url',
  url: { url: 'https://example.com' },
  text: { text: '' },
  email: { email: '', subject: '', body: '' },
  phone: { phone: '' },
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
};

export const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const [dataState, setDataState] = useState<QRDataState>(INITIAL_DATA_STATE);
  const [config, setConfig] = useState<QRDesignConfig>(INITIAL_CONFIG);
  const [history, setHistory] = useState<HistoryItem[]>(() => getStoredHistory());

  // Handle theme changes (sync with html element class and system listener)
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      // System mode
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const handleScrollToGenerator = () => {
    const element = document.getElementById('generator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Save item to history
  const handleSaveHistory = useCallback((item: HistoryItem) => {
    const updated = saveHistoryItem(item);
    setHistory(updated);
  }, []);

  // Rename history item
  const handleRenameHistory = useCallback((id: string, newTitle: string) => {
    const updated = renameStoredHistoryItem(id, newTitle);
    setHistory(updated);
  }, []);

  // Delete single history item
  const handleDeleteHistory = useCallback((id: string) => {
    const updated = deleteStoredHistoryItem(id);
    setHistory(updated);
  }, []);

  // Clear all history
  const handleClearHistory = useCallback(() => {
    clearStoredHistory();
    setHistory([]);
  }, []);

  // Reload history item back into the editor
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    const newDataState = { ...INITIAL_DATA_STATE, type: item.type };

    if (item.type === 'url') {
      newDataState.url = { url: item.payload };
    } else if (item.type === 'text') {
      newDataState.text = { text: item.payload };
    } else if (item.type === 'phone') {
      newDataState.phone = { phone: item.payload.replace(/^tel:/i, '') };
    } else if (item.type === 'wifi') {
      const ssidMatch = item.payload.match(/S:([^;]+)/);
      const typeMatch = item.payload.match(/T:([^;]+)/);
      const passMatch = item.payload.match(/P:([^;]+)/);
      const hiddenMatch = item.payload.match(/H:([^;]+)/);

      newDataState.wifi = {
        ssid: ssidMatch ? ssidMatch[1] : '',
        encryption: (typeMatch ? typeMatch[1] : 'WPA') as 'WPA' | 'WEP' | 'nopass',
        password: passMatch ? passMatch[1] : '',
        hidden: hiddenMatch ? hiddenMatch[1] === 'true' : false,
      };
    } else if (item.type === 'email') {
      const emailMatch = item.payload.match(/^mailto:([^?]+)/i);
      const urlObj = item.payload.includes('?') ? new URL(item.payload) : null;
      newDataState.email = {
        email: emailMatch ? emailMatch[1] : '',
        subject: urlObj?.searchParams.get('subject') || '',
        body: urlObj?.searchParams.get('body') || '',
      };
    }

    setDataState(newDataState);
    if (item.config) {
      setConfig(item.config);
    }

    handleScrollToGenerator();
  }, []);

  // Trigger print dialog
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Compute live payload string
  const currentPayload = useMemo(() => generatePayload(dataState), [dataState]);
  const { title: currentTitle, summary: currentSummary } = useMemo(
    () => getPayloadSummary(dataState),
    [dataState]
  );

  // Global Keyboard Shortcuts (Requirement 14)
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Escape -> close any open modals
      if (e.key === 'Escape') {
        // Modal will close automatically if listeners are present
        return;
      }

      // Ctrl/Cmd + Enter -> Scroll to generator
      if (isCmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        handleScrollToGenerator();
        showToast('Đã di chuyển tới bảng tạo QR', 'info');
        return;
      }

      // Ctrl/Cmd + Shift + S -> Download SVG
      if (isCmdOrCtrl && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (!currentPayload.trim()) {
          showToast('Chưa có nội dung để tải SVG', 'warning');
          return;
        }
        try {
          const svg = await generateQRSVG(currentPayload, config);
          const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = generateSmartFilename(dataState, 'svg');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast('Đã tải QR thành công.', 'success');
        } catch {
          showToast('Lỗi khi tải SVG', 'error');
        }
        return;
      }

      // Ctrl/Cmd + S -> Download PNG (override browser save page)
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (!currentPayload.trim()) {
          showToast('Chưa có nội dung để tải PNG', 'warning');
          return;
        }
        try {
          const blob = await generateQRPngBlob(currentPayload, config, 1024);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = generateSmartFilename(dataState, 'png');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast('Đã tải QR thành công.', 'success');
        } catch {
          showToast('Lỗi khi tải PNG', 'error');
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPayload, config, dataState, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Regular website content (hidden during print) */}
      <div className="no-print flex-1 flex flex-col">
        {/* Header */}
        <Header
          theme={theme}
          onThemeChange={handleThemeChange}
          onScrollToGenerator={handleScrollToGenerator}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          <Hero onStartClick={handleScrollToGenerator} />

          <div id="qr-generator-panel">
            <QRGenerator
              dataState={dataState}
              onDataStateChange={setDataState}
              config={config}
              onConfigChange={setConfig}
              onSaveHistory={handleSaveHistory}
              onPrint={handlePrint}
            />
          </div>

          <QRHistory
            items={history}
            onSelect={handleSelectHistory}
            onRename={handleRenameHistory}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearHistory}
          />

          <GuideSection />

          <PrivacySection />

          <FAQSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Print View Component (only shown when window.print() triggers) */}
      <PrintView
        payload={currentPayload}
        title={currentTitle}
        summary={currentSummary}
        config={config}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
