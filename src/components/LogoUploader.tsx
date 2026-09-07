import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { QRDesignConfig } from '../types/qr';

interface LogoUploaderProps {
  config: QRDesignConfig;
  onChange: (config: QRDesignConfig) => void;
}

// Built-in SVG presets for quick testing
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleIncludeLogo = (enabled: boolean) => {
    onChange({
      ...config,
      includeLogo: enabled,
      errorCorrectionLevel: enabled ? 'H' : config.errorCorrectionLevel,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.match(/^image\/(png|jpeg|jpg|svg\+xml|webp)$/i)) {
      alert('Vui lòng chọn file ảnh định dạng PNG, JPG, SVG hoặc WebP.');
      return;
    }

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
      }
    };
    reader.readAsDataURL(file);
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
    <div className="space-y-4 pt-2">
      {/* Toggle Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Logo trung tâm</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleIncludeLogo(false)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              !config.includeLogo
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Không dùng logo
          </button>
          <button
            type="button"
            onClick={() => handleToggleIncludeLogo(true)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              config.includeLogo
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sử dụng logo
          </button>
        </div>
      </div>

      {config.includeLogo && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4 animate-in fade-in">
          {/* Upload and Current Logo State */}
          <div className="flex items-center gap-4">
            {config.logoUrl ? (
              <div className="relative group w-16 h-16 rounded-xl border-2 border-blue-500 p-2 bg-white flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={config.logoUrl}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors"
                  title="Gỡ bỏ logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-file-input"
              />
              <label
                htmlFor="logo-file-input"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs transition-all hover:text-blue-600"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải logo từ máy (PNG, JPG, SVG)</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Khuyên dùng ảnh hình vuông hoặc icon định dạng trong suốt (PNG/SVG).
              </p>
            </div>
          </div>

          {/* Preset quick badges */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Hoặc chọn icon nhanh:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = config.logoUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-4 h-4" />
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
                <span>Kích thước logo so với mã QR</span>
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
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Nhỏ (14%)</span>
                <span>Tiêu chuẩn (20%)</span>
                <span>Tối đa (25%)</span>
              </div>

              {config.logoSizeRatio > 0.22 && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Logo lớn có thể giảm khả năng quét đối với nội dung dài. Hãy quét thử trước khi in.</span>
                </div>
              )}

              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Hệ thống tự động kích hoạt mức sửa lỗi High (30%) để mã luôn quét tốt.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
