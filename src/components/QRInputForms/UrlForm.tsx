import React, { useMemo } from 'react';
import { Globe, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { UrlFormData } from '../../types/qr';
import { validateUrl } from '../../lib/validation';

interface UrlFormProps {
  data: UrlFormData;
  onChange: (data: UrlFormData) => void;
}

export const UrlForm: React.FC<UrlFormProps> = ({ data, onChange }) => {
  const validation = useMemo(() => {
    if (!data.url.trim()) return null;
    return validateUrl(data.url);
  }, [data.url]);

  const handleApplySuggestion = () => {
    if (validation?.suggestion) {
      onChange({ url: validation.suggestion });
    }
  };

  const handleQuickInsert = (sample: string) => {
    onChange({ url: sample });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="url-input"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Địa chỉ Website (URL) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Globe className="w-5 h-5" />
          </div>
          <input
            id="url-input"
            type="url"
            value={data.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://example.com"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Client-side validation status */}
        {validation && (
          <div className="mt-2 text-xs">
            {validation.isValid ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {validation.message || 'URL hợp lệ, sẵn sàng tạo mã QR'}
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validation.message}</span>
              </div>
            )}

            {validation.suggestion && data.url !== validation.suggestion && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Gợi ý:</span>
                <button
                  type="button"
                  onClick={handleApplySuggestion}
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  <span>{validation.suggestion}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick samples */}
      <div className="pt-1 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Gợi ý nhanh:</span>
        {['https://google.com', 'https://facebook.com', 'https://youtube.com'].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => handleQuickInsert(sample)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {sample.replace('https://', '')}
          </button>
        ))}
      </div>
    </div>
  );
};
