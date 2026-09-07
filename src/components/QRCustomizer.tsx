import React from 'react';
import { Palette, ShieldAlert, Sliders, AlertTriangle, RotateCcw, Check } from 'lucide-react';
import { QRDesignConfig, QRErrorCorrectionLevel, QRSize } from '../types/qr';
import { evaluateContrast } from '../lib/contrast';

interface QRCustomizerProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

interface ColorComboPreset {
  id: string;
  name: string;
  fg: string;
  bg: string;
  desc: string;
}

const COLOR_PRESETS: ColorComboPreset[] = [
  { id: 'classic', name: 'Classic', fg: '#000000', bg: '#FFFFFF', desc: 'Tương phản tuyệt đối 21:1' },
  { id: 'blue', name: 'Navy Blue', fg: '#1E3A8A', bg: '#EFF6FF', desc: 'Chuyên nghiệp, tin cậy' },
  { id: 'green', name: 'Emerald', fg: '#065F46', bg: '#ECFDF5', desc: 'Tươi sáng, thân thiện' },
  { id: 'purple', name: 'Royal Purple', fg: '#581C87', bg: '#FAF5FF', desc: 'Sáng tạo, công nghệ' },
  { id: 'red', name: 'Crimson Red', fg: '#991B1B', bg: '#FEF2F2', desc: 'Nổi bật, thu hút' },
  { id: 'dark', name: 'Charcoal', fg: '#0F172A', bg: '#F8FAFC', desc: 'Tối giản, hiện đại' },
];

const SIZE_OPTIONS: QRSize[] = [256, 512, 1024, 2048];

const ECC_OPTIONS: { id: QRErrorCorrectionLevel; label: string; desc: string }[] = [
  { id: 'L', label: 'Low (L)', desc: 'Phục hồi ~7% dữ liệu (Mắt QR thoáng)' },
  { id: 'M', label: 'Medium (M)', desc: 'Phục hồi ~15% dữ liệu (Tiêu chuẩn)' },
  { id: 'Q', label: 'Quartile (Q)', desc: 'Phục hồi ~25% dữ liệu (In ấn ngoài trời)' },
  { id: 'H', label: 'High (H)', desc: 'Phục hồi ~30% (Khuyên dùng khi có logo)' },
];

export const QRCustomizer: React.FC<QRCustomizerProps> = ({ config, onChange }) => {
  const contrast = evaluateContrast(config.fgColor, config.bgColor);
  const hasLogo = config.includeLogo && !!config.logoUrl;

  const handleApplyPreset = (preset: ColorComboPreset) => {
    onChange({
      ...config,
      fgColor: preset.fg,
      bgColor: preset.bg,
    });
  };

  const handleFgChange = (hex: string) => {
    onChange({ ...config, fgColor: hex });
  };

  const handleBgChange = (hex: string) => {
    onChange({ ...config, bgColor: hex });
  };

  const handleSizeChange = (size: QRSize) => {
    onChange({ ...config, size });
  };

  const handleEccChange = (ecc: QRErrorCorrectionLevel) => {
    onChange({ ...config, errorCorrectionLevel: ecc });
  };

  const handleResetDefaults = () => {
    onChange({
      ...config,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      size: 1024,
      errorCorrectionLevel: hasLogo ? 'H' : 'M',
      margin: 2,
    });
  };

  const isDefaultColors =
    config.fgColor.toLowerCase() === '#000000' && config.bgColor.toLowerCase() === '#ffffff';

  return (
    <div className="space-y-6 pt-1">
      {/* 1. Color Palette Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Bộ Preset Màu Sắc (Chuẩn Contrast)</span>
          </div>
          {!isDefaultColors && (
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi phục mặc định</span>
            </button>
          )}
        </div>

        {/* 6 Preset Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              config.fgColor.toLowerCase() === preset.fg.toLowerCase() &&
              config.bgColor.toLowerCase() === preset.bg.toLowerCase();

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs shrink-0"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs shrink-0"
                      style={{ backgroundColor: preset.bg }}
                    />
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{preset.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Hex Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Màu nét mã (Foreground)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.fgColor}
                onChange={(e) => handleFgChange(e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
                title="Chọn mã màu nét"
                aria-label="Chọn mã màu nét"
              />
              <input
                type="text"
                value={config.fgColor.toUpperCase()}
                onChange={(e) => handleFgChange(e.target.value)}
                className="w-24 px-2 py-1 font-mono text-xs uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                maxLength={7}
                aria-label="Mã Hex màu nét"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Màu nền mã (Background)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.bgColor}
                onChange={(e) => handleBgChange(e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
                title="Chọn mã màu nền"
                aria-label="Chọn mã màu nền"
              />
              <input
                type="text"
                value={config.bgColor.toUpperCase()}
                onChange={(e) => handleBgChange(e.target.value)}
                className="w-24 px-2 py-1 font-mono text-xs uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                maxLength={7}
                aria-label="Mã Hex màu nền"
              />
            </div>
          </div>
        </div>

        {/* Contrast Warning if needed */}
        {contrast.warning && (
          <div
            className={`mt-2.5 p-3 rounded-xl border flex items-start gap-2.5 text-xs leading-relaxed ${
              !contrast.isAcceptable
                ? 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300'
                : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">
                Cảnh báo chất lượng quét (Tương phản {contrast.ratio}:1)
              </span>
              <span>{contrast.warning}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Output Resolution / Sizing */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2.5">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Kích thước xuất file (Độ phân giải)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                config.size === size
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-slate-600'
              }`}
            >
              <div>{size} × {size}</div>
              <div className="text-[10px] font-normal opacity-80 mt-0.5">
                {size <= 256
                  ? 'Thumbnail'
                  : size === 512
                  ? 'Web & App'
                  : size === 1024
                  ? 'In ấn tài liệu'
                  : 'Poster / Banner'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Error Correction Level */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Mức sửa lỗi (Error Correction)</span>
          </div>
          {hasLogo && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Đang khóa mức High (H) vì có Logo
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ECC_OPTIONS.map((ecc) => {
            const isSelected = hasLogo ? ecc.id === 'H' : config.errorCorrectionLevel === ecc.id;
            return (
              <button
                key={ecc.id}
                type="button"
                disabled={hasLogo && ecc.id !== 'H'}
                onClick={() => handleEccChange(ecc.id)}
                className={`p-2.5 rounded-xl text-xs border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-100 font-semibold ring-1 ring-blue-500'
                    : hasLogo
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 cursor-pointer'
                }`}
              >
                <div className="font-bold">{ecc.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  {ecc.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
