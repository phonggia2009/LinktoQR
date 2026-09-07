import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Palette, Image as ImageIcon, Sparkles } from 'lucide-react';
import {
  QRDataState,
  QRDesignConfig,
  QRType,
  HistoryItem,
} from '../types/qr';
import { generatePayload, getPayloadSummary } from '../lib/qr';
import { QRTypeSelector } from './QRTypeSelector';
import { UrlForm } from './QRInputForms/UrlForm';
import { TextForm } from './QRInputForms/TextForm';
import { EmailForm } from './QRInputForms/EmailForm';
import { PhoneForm } from './QRInputForms/PhoneForm';
import { WifiForm } from './QRInputForms/WifiForm';
import { QRCustomizer } from './QRCustomizer';
import { LogoUploader } from './LogoUploader';
import { QRPreview } from './QRPreview';

interface QRGeneratorProps {
  dataState: QRDataState;
  onDataStateChange: (state: QRDataState) => void;
  config: QRDesignConfig;
  onConfigChange: (config: QRDesignConfig) => void;
  onSaveHistory: (item: HistoryItem) => void;
  onPrint: () => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  dataState,
  onDataStateChange,
  config,
  onConfigChange,
  onSaveHistory,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'logo'>('content');

  // Compute live payload string
  const payload = useMemo(() => {
    return generatePayload(dataState);
  }, [dataState]);

  // Compute display title and summary
  const { title: displayTitle, summary: displaySummary } = useMemo(() => {
    return getPayloadSummary(dataState);
  }, [dataState]);

  // Auto save to history with debounce whenever payload is valid and user finishes typing
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
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Tạo mã QR miễn phí
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tạo mã QR nhanh chóng, miễn phí và không quảng cáo. Dữ liệu được mã hóa trực tiếp client-side.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Data input & Customizer panel (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
              {/* Step 1: Type Selection */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Bước 1: Chọn loại dữ liệu
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
                  <span>Nội dung mã hóa</span>
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
                  <span>Màu sắc & Kích thước</span>
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

              {/* Tab 1: Form Inputs */}
              {activeTab === 'content' && (
                <div className="animate-in fade-in duration-200">
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

              {/* Tab 2: Design & Color Customization */}
              {activeTab === 'design' && (
                <div className="animate-in fade-in duration-200">
                  <QRCustomizer config={config} onChange={onConfigChange} />
                </div>
              )}

              {/* Tab 3: Logo Overlay */}
              {activeTab === 'logo' && (
                <div className="animate-in fade-in duration-200">
                  <LogoUploader config={config} onChange={onConfigChange} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Preview Panel (5 cols on desktop, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <QRPreview
              payload={payload}
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
