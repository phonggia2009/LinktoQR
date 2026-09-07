import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Sparkles,
  Download,
  Upload,
  Globe,
  Printer,
  Megaphone,
  Share2,
} from 'lucide-react';
import {
  QRDataState,
  QRDesignConfig,
  QRType,
  HistoryItem,
  QRPurposePreset,
} from '../types/qr';
import { generatePayload, getPayloadSummary } from '../lib/qr';
import { validateImportedConfig } from '../lib/validation';
import { exportConfigAsJson } from '../lib/storage';
import { QRTypeSelector } from './QRTypeSelector';
import { UrlForm } from './QRInputForms/UrlForm';
import { TextForm } from './QRInputForms/TextForm';
import { EmailForm } from './QRInputForms/EmailForm';
import { PhoneForm } from './QRInputForms/PhoneForm';
import { WifiForm } from './QRInputForms/WifiForm';
import { QRCustomizer } from './QRCustomizer';
import { LogoUploader } from './LogoUploader';
import { QRPreview } from './QRPreview';
import { useToast } from './Toast';

interface QRGeneratorProps {
  dataState: QRDataState;
  onDataStateChange: (state: QRDataState) => void;
  config: QRDesignConfig;
  onConfigChange: (config: QRDesignConfig) => void;
  onSaveHistory: (item: HistoryItem) => void;
  onPrint: () => void;
}

const PURPOSE_PRESETS: {
  id: QRPurposePreset;
  name: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { id: 'website', name: 'Website', desc: 'Đen trắng, tối ưu web (512px)', icon: Globe },
  { id: 'print', name: 'In ấn (Print)', desc: '2048px, phục hồi High (H)', icon: Printer },
  { id: 'poster', name: 'Poster / Biển', desc: 'Khổ lớn, contrast cao', icon: Megaphone },
  { id: 'social', name: 'Mạng xã hội', desc: '1024px chuẩn chia sẻ', icon: Share2 },
];

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  dataState,
  onDataStateChange,
  config,
  onConfigChange,
  onSaveHistory,
  onPrint,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'logo'>('content');
  const [selectedPreset, setSelectedPreset] = useState<QRPurposePreset>('website');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live payload string (100% static client-side)
  const payload = useMemo(() => {
    return generatePayload(dataState);
  }, [dataState]);

  // Compute display title and summary
  const { title: displayTitle, summary: displaySummary } = useMemo(() => {
    return getPayloadSummary(dataState);
  }, [dataState]);

  // Apply Purpose Preset
  const handleApplyPreset = (preset: QRPurposePreset) => {
    setSelectedPreset(preset);
    const hasLogo = config.includeLogo && !!config.logoUrl;

    switch (preset) {
      case 'website':
        onConfigChange({
          ...config,
          size: 512,
          errorCorrectionLevel: hasLogo ? 'H' : 'M',
          fgColor: '#000000',
          bgColor: '#FFFFFF',
          margin: 2,
        });
        showToast('Đã áp dụng cấu hình tối ưu cho Website', 'info');
        break;
      case 'print':
        onConfigChange({
          ...config,
          size: 2048,
          errorCorrectionLevel: 'H',
          fgColor: '#000000',
          bgColor: '#FFFFFF',
          margin: 3,
        });
        showToast('Đã áp dụng cấu hình 2048px High ECC cho In ấn', 'info');
        break;
      case 'poster':
        onConfigChange({
          ...config,
          size: 2048,
          errorCorrectionLevel: 'Q',
          fgColor: '#000000',
          bgColor: '#FFFFFF',
          margin: 4,
        });
        showToast('Đã áp dụng cấu hình độ tương phản cao cho Poster', 'info');
        break;
      case 'social':
        onConfigChange({
          ...config,
          size: 1024,
          errorCorrectionLevel: hasLogo ? 'H' : 'M',
          margin: 2,
        });
        showToast('Đã áp dụng cấu hình 1024px cho Mạng xã hội', 'info');
        break;
    }
  };

  // Export JSON Configuration
  const handleExportConfig = () => {
    try {
      const jsonString = exportConfigAsJson(dataState, config);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-config-${dataState.type}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Đã xuất file cấu hình JSON thành công', 'success');
    } catch {
      showToast('Không thể xuất file cấu hình', 'error');
    }
  };

  // Import JSON Configuration
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        const valid = validateImportedConfig(parsed);

        if (valid) {
          onDataStateChange(valid.data);
          onConfigChange(valid.config);
          showToast('Đã nạp thành công cấu hình từ file JSON', 'success');
        } else {
          showToast('File JSON không đúng cấu trúc cấu hình QR', 'error');
        }
      } catch {
        showToast('File JSON không hợp lệ hoặc bị lỗi cú pháp', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Auto save to history with debounce whenever payload is valid
  const saveTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (!payload.trim()) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      const historyItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        type: dataState.type,
        title: displayTitle,
        payload,
        displaySummary,
        createdAt: Date.now(),
        config,
        hasLogo: Boolean(config.includeLogo && config.logoUrl),
      };
      onSaveHistory(historyItem);
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [payload, dataState.type, displayTitle, displaySummary, config, onSaveHistory]);

  const handleSelectType = (type: QRType) => {
    onDataStateChange({
      ...dataState,
      type,
    });
  };

  return (
    <section id="generator" className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Import/Export Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Trình tạo mã QR Chuyên Nghiệp
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Dữ liệu được mã hóa trực tiếp client-side. Không quảng cáo, không chuyển hướng trung gian.
            </p>
          </div>

          {/* Import / Export JSON buttons */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportConfig}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Nhập cấu hình từ file JSON"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Nhập JSON</span>
            </button>

            <button
              type="button"
              onClick={handleExportConfig}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Xuất cấu hình hiện tại thành file JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất JSON</span>
            </button>
          </div>
        </div>

        {/* 45% (Config) / 55% (QR Preview) Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-start">
          {/* LEFT: Configuration & Input Area */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
              {/* Preset QR Purpose Selection */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Preset Mục Đích Sử Dụng
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PURPOSE_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{preset.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                          {preset.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 1: Type Selection */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Bước 1: Chọn Loại Dữ Liệu
                </label>
                <QRTypeSelector
                  currentType={dataState.type}
                  onSelectType={handleSelectType}
                />
              </div>

              {/* Sub-tabs: Nội dung / Màu sắc & Kích thước / Logo */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'content'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nội dung</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('design')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'design'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Màu & Kích thước</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('logo')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'logo'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Thêm Logo {config.includeLogo && '✓'}</span>
                </button>
              </div>

              {/* Tab 1: Inputs */}
              {activeTab === 'content' && (
                <div className="animate-in fade-in duration-150">
                  {dataState.type === 'url' && (
                    <UrlForm
                      data={dataState.url}
                      onChange={(url) => onDataStateChange({ ...dataState, url })}
                    />
                  )}

                  {dataState.type === 'text' && (
                    <TextForm
                      data={dataState.text}
                      onChange={(text) => onDataStateChange({ ...dataState, text })}
                    />
                  )}

                  {dataState.type === 'email' && (
                    <EmailForm
                      data={dataState.email}
                      onChange={(email) => onDataStateChange({ ...dataState, email })}
                    />
                  )}

                  {dataState.type === 'phone' && (
                    <PhoneForm
                      data={dataState.phone}
                      onChange={(phone) => onDataStateChange({ ...dataState, phone })}
                    />
                  )}

                  {dataState.type === 'wifi' && (
                    <WifiForm
                      data={dataState.wifi}
                      onChange={(wifi) => onDataStateChange({ ...dataState, wifi })}
                    />
                  )}
                </div>
              )}

              {/* Tab 2: Colors & Sizing */}
              {activeTab === 'design' && (
                <div className="animate-in fade-in duration-150">
                  <QRCustomizer config={config} onChange={onConfigChange} />
                </div>
              )}

              {/* Tab 3: Logo */}
              {activeTab === 'logo' && (
                <div className="animate-in fade-in duration-150">
                  <LogoUploader config={config} onChange={onConfigChange} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: QR Preview Panel (55% on desktop, sticky) */}
          <div className="lg:sticky lg:top-24">
            <QRPreview
              payload={payload}
              dataState={dataState}
              displayTitle={displayTitle}
              displaySummary={displaySummary}
              config={config}
              onPrint={onPrint}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
