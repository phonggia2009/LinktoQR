import React, { useMemo } from 'react';
import { Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PhoneFormData } from '../../types/qr';
import { validatePhone } from '../../lib/validation';

interface PhoneFormProps {
  data: PhoneFormData;
  onChange: (data: PhoneFormData) => void;
}

export const PhoneForm: React.FC<PhoneFormProps> = ({ data, onChange }) => {
  const phoneValidation = useMemo(() => {
    if (!data.phone.trim()) return null;
    return validatePhone(data.phone);
  }, [data.phone]);

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="phone-input"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Phone className="w-5 h-5" />
          </div>
          <input
            id="phone-input"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+84 901 234 567"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
            autoComplete="tel"
          />
        </div>

        {phoneValidation && (
          <div className="mt-1.5 text-xs">
            {phoneValidation.isValid ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Số điện thoại hợp lệ (sẽ gọi trực tiếp khi quét)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{phoneValidation.message}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
        <strong>Mẹo:</strong> Khuyến khích thêm mã vùng quốc tế (ví dụ: <code className="font-mono font-bold">+84</code> cho Việt Nam) để khách hàng nước ngoài quét mã vẫn có thể bấm gọi trực tiếp mà không cần sửa số.
      </div>
    </div>
  );
};
