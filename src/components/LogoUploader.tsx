import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, AlertTriangle, ShieldCheck, Check, RefreshCw } from 'lucide-react';
import { QRDesignConfig } from '../types/qr';
import { sanitizeSvgString } from '../lib/validation';
import { useToast } from './Toast';

interface LogoUploaderProps {
  config: QRDesignConfig;
  onChange: (config: QRDesignConfig) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Built-in presets for quick insertion
const PRESET_LOGOS = [
  {
    name: 'Link',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'%3E%3C/path%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'%3E%3C/path%3E%3C/svg%3E",
  },
  {
    name: 'Wi-Fi',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23059669' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 13a10 10 0 0 1 14 0'%3E%3C/path%3E%3Cpath d='M8.5 16.5a5 5 0 0 1 7 0'%3E%3C/path%3E%3Cpath d='M2 8.82a15 15 0 0 1 20 0'%3E%3C/path%3E%3Cline x1='12' y1='20' x2='12.01' y2='20'%3E%3C/line%3E%3C/svg%3E",
  },
  {
    name: 'Điện thoại',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237C3AED' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'%3E%3C/path%3E%3C/svg%3E",
  },
  {
    name: 'Thư',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23DC2626' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='16' x='2' y='4' rx='2'%3E%3C/rect%3E%3Cpath d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'%3E%3C/path%3E%3C/svg%3E",
  },
];

export const LogoUploader: React.FC<LogoUploaderProps> = ({ config, onChange }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      showToast('Kích thước ảnh vượt quá giới hạn 2MB. Vui lòng chọn ảnh nhỏ hơn.', 'error');
      return;
    }

    // Check file type
    const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      showToast('Định dạng không hỗ trợ. Vui lòng chọn file PNG, JPG, WEBP hoặc SVG.', 'error');
      return;
    }

    // Handle SVG files with sanitization to prevent XSS
    if (file.type === 'image/svg+xml') {
      const textReader = new FileReader();
      textReader.onload = (e) => {
        const rawSvg = e.target?.result as string;
        if (rawSvg) {
          const sanitized = sanitizeSvgString(rawSvg);
          const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sanitized)}`;
          onChange({
            ...config,
            includeLogo: true,
            logoUrl: encoded,
            errorCorrectionLevel: 'H',
          });
          showToast('Đã tải logo SVG an toàn thành công', 'success');
        }
      };
      textReader.readAsText(file);
      return;
    }

    // Raster images: PNG, JPG, WebP
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange({
          ...config,
          includeLogo: true,
          logoUrl: result,
          errorCorrectionLevel: 'H',
        });
        showToast('Đã tải logo thành công', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleIncludeLogo = (enabled: boolean) => {
    onChange({
      ...config,
      includeLogo: enabled,
      errorCorrectionLevel: enabled ? 'H' : config.errorCorrectionLevel,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveLogo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange({
      ...config,
      includeLogo: false,
      logoUrl: null,
    });
    showToast('Đã xóa logo', 'info');
  };

  const handleSelectPreset = (url: string) => {
    onChange({
      ...config,
      includeLogo: true,
      logoUrl: url,
      errorCorrectionLevel: 'H',
    });
  };

  const handleRatioChange = (ratio: number) => {
    onChange({
      ...config,
      logoSizeRatio: ratio,
    });
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Toggle Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Logo trung tâm mã QR</span>
        </div>

        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => handleToggleIncludeLogo(false)}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
              !config.includeLogo
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Tắt
          </button>
          <button
            type="button"
            onClick={() => handleToggleIncludeLogo(true)}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
              config.includeLogo
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Bật Logo
          </button>
        </div>
      </div>

      {config.includeLogo && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4 animate-in fade-in">
          {/* Drag & drop or Current Logo Area */}
          {config.logoUrl ? (
            <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative group w-16 h-16 rounded-xl border border-blue-500/40 p-1.5 bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <img
                  src={config.logoUrl}
                  alt="Xem trước logo"
                  className="max-w-full max-h-full object-contain rounded"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Logo đang áp dụng
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Tự động kích hoạt phục hồi dữ liệu High (30%)
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Thay logo khác</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Gỡ bỏ logo</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Kéo thả logo vào đây hoặc bấm để chọn file
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Hỗ trợ PNG, JPG, WEBP, SVG (tối đa 2MB)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
            id="logo-file-input"
          />

          {/* Quick preset badges */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Hoặc chọn nhanh icon mẫu:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = config.logoUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-3.5 h-3.5" />
                    <span>{preset.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-blue-600 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size slider */}
          {config.logoUrl && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Tỷ lệ kích thước logo</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {Math.round(config.logoSizeRatio * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.14"
                max="0.25"
                step="0.01"
                value={config.logoSizeRatio}
                onChange={(e) => handleRatioChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                aria-label="Tỷ lệ kích thước logo"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Nhỏ (14%)</span>
                <span>Chuẩn (20%)</span>
                <span>Tối đa (25%)</span>
              </div>

              {config.logoSizeRatio > 0.22 && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200/60 dark:border-amber-900/50">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>⚠ Logo đang chiếm diện tích lớn, có thể ảnh hưởng khả năng quét.</span>
                </div>
              )}

              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Mức sửa lỗi High (H) được kích hoạt tự động để bảo toàn dữ liệu.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
