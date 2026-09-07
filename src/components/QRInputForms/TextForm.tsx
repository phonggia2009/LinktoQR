import React from 'react';
import { RotateCcw } from 'lucide-react';
import { TextFormData } from '../../types/qr';

interface TextFormProps {
  data: TextFormData;
  onChange: (data: TextFormData) => void;
}

export const TextForm: React.FC<TextFormProps> = ({ data, onChange }) => {
  const charCount = data.text.length;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="text-input"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Nội dung văn bản <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {charCount} ký tự
            </span>
            {charCount > 0 && (
              <button
                type="button"
                onClick={() => onChange({ text: '' })}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                title="Xóa nội dung"
              >
                <RotateCcw className="w-3 h-3" />
                Xóa
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <textarea
            id="text-input"
            rows={5}
            value={data.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Nhập bất kỳ đoạn văn bản, ghi chú, lời chào hoặc tin nhắn..."
            className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium resize-y"
          />
        </div>

        {charCount > 500 && (
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
            Lưu ý: Đoạn văn bản càng dài thì mắt mã QR càng dày đặc, có thể gây khó quét trên camera chất lượng thấp.
          </p>
        )}
      </div>

      {/* Quick samples */}
      <div className="pt-1 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Mẫu sẵn:</span>
        {['Xin chào! Rất vui được gặp bạn.', 'Cảm ơn bạn đã ghé thăm!', 'Mã ưu đãi giảm giá 20%: SALE20'].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => onChange({ text: sample })}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
};
