import React from 'react';
import { Palette, ShieldAlert, Sliders, AlertTriangle } from 'lucide-react';
import { QRDesignConfig, QRErrorCorrectionLevel, QRSize } from '../types/qr';
import { evaluateContrast } from '../lib/contrast';

interface QRCustomizerProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

const FG_PALETTES = [
  { label: 'Đen cổ điển', hex: '#000000' },
  { label: 'Xanh Navy', hex: '#0F172A' },
  { label: 'Xanh Lam', hex: '#2563EB' },
  { label: 'Xanh Lục', hex: '#059669' },
  { label: 'Tím Đậm', hex: '#7C3AED' },
  { label: 'Đỏ Ruby', hex: '#DC2626' },
];

const BG_PALETTES = [
  { label: 'Trắng', hex: '#FFFFFF' },
  { label: 'Xám Nhạt', hex: '#F8FAFC' },
  { label: 'Kem', hex: '#FEFCE8' },
  { label: 'Xanh Nhạt', hex: '#EFF6FF' },
];

const SIZE_OPTIONS: QRSize[] = [256, 512, 1024, 2048];

const ECC_OPTIONS: { id: QRErrorCorrectionLevel; label: string; desc: string }[] = [
  { id: 'L', label: 'Low (L)', desc: 'Phục hồi ~7% dữ liệu' },
  { id: 'M', label: 'Medium (M)', desc: 'Phục hồi ~15% dữ liệu' },
  { id: 'Q', label: 'Quartile (Q)', desc: 'Phục hồi ~25% dữ liệu' },
  { id: 'H', label: 'High (H)', desc: 'Phục hồi ~30% (Khuyên dùng khi có logo)' },
];

export const QRCustomizer: React.FC<QRCustomizerProps> = ({ config, onChange }) => {
  const contrast = evaluateContrast(config.fgColor, config.bgColor);
  const hasLogo = config.includeLogo && !!config.logoUrl;

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

  const handleResetColors = () => {
    onChange({
      ...config,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
    });
  };

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Color Customization */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Màu sắc mã QR</span>
          </div>
          {(config.fgColor !== '#000000' || config.bgColor !== '#FFFFFF') && (
            <button
              type="button"
              onClick={handleResetColors}
              className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
            >
              Mặc định (Đen/Trắng)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Foreground color */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Màu nét mã (Foreground)
            </label>
            <div className="flex items-center gap-2 mb-2.5">
              <input
                type="color"
                value={config.fgColor}
                onChange={(e) => handleFgChange(e.target.value)}
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                title="Chọn màu nét"
              />
              <input
                type="text"
                value={config.fgColor.toUpperCase()}
                onChange={(e) => handleFgChange(e.target.value)}
                className="flex-1 px-2.5 py-1.5 font-mono text-xs uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                maxLength={7}
              />
            </div>
            {/* Palette buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {FG_PALETTES.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => handleFgChange(p.hex)}
                  className={`w-6 h-6 rounded-md border transition-transform ${
                    config.fgColor.toLowerCase() === p.hex.toLowerCase()
                      ? 'ring-2 ring-blue-500 scale-110 border-white'
                      : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.label}
                  aria-label={p.label}
                />
              ))}
            </div>
          </div>

          {/* Background color */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Màu nền (Background)
            </label>
            <div className="flex items-center gap-2 mb-2.5">
              <input
                type="color"
                value={config.bgColor}
                onChange={(e) => handleBgChange(e.target.value)}
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                title="Chọn màu nền"
              />
              <input
                type="text"
                value={config.bgColor.toUpperCase()}
                onChange={(e) => handleBgChange(e.target.value)}
                className="flex-1 px-2.5 py-1.5 font-mono text-xs uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                maxLength={7}
              />
            </div>
            {/* Palette buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {BG_PALETTES.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => handleBgChange(p.hex)}
                  className={`w-6 h-6 rounded-md border transition-transform ${
                    config.bgColor.toLowerCase() === p.hex.toLowerCase()
                      ? 'ring-2 ring-blue-500 scale-110 border-slate-900'
                      : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.label}
                  aria-label={p.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contrast Warning if needed */}
        {contrast.warning && (
          <div
            className={`mt-3 p-3 rounded-xl border flex items-start gap-2.5 text-xs leading-relaxed ${
              !contrast.isAcceptable
                ? 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300'
                : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Cảnh báo độ tương phản ({contrast.ratio}:1)</span>
              <span>{contrast.warning}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Sizing Selection */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-2.5">
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
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-slate-600'
              }`}
            >
              <div>{size} × {size}</div>
              <div className="text-[10px] font-normal opacity-80 mt-0.5">
                {size <= 512 ? 'Màn hình & Web' : size === 1024 ? 'In ấn Standee' : 'Khổ lớn / Banner'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Error Correction Level */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Mức sửa lỗi (Error Correction)</span>
          </div>
          {hasLogo && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Đang tối ưu mức High (H) cho logo
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
