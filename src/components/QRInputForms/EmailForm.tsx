import React, { useMemo } from 'react';
import { Mail, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EmailFormData } from '../../types/qr';
import { validateEmail } from '../../lib/validation';

interface EmailFormProps {
  data: EmailFormData;
  onChange: (data: EmailFormData) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ data, onChange }) => {
  const emailValidation = useMemo(() => {
    if (!data.email.trim()) return null;
    return validateEmail(data.email);
  }, [data.email]);

  return (
    <div className="space-y-4">
      {/* Email Address */}
      <div>
        <label
          htmlFor="email-input"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Địa chỉ Email người nhận <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email-input"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="contact@example.com"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
            autoComplete="email"
          />
        </div>
        {emailValidation && (
          <div className="mt-1.5 text-xs">
            {emailValidation.isValid ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Email hợp lệ</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{emailValidation.message}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject-input"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Tiêu đề thư (Subject)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Tag className="w-5 h-5" />
          </div>
          <input
            id="subject-input"
            type="text"
            value={data.subject}
            onChange={(e) => onChange({ ...data, subject: e.target.value })}
            placeholder="Liên hệ công việc / Hỗ trợ khách hàng"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Message Body */}
      <div>
        <label
          htmlFor="body-input"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Nội dung mẫu (Body)
        </label>
        <div className="relative">
          <textarea
            id="body-input"
            rows={3}
            value={data.body}
            onChange={(e) => onChange({ ...data, body: e.target.value })}
            placeholder="Xin chào, tôi muốn tìm hiểu thêm thông tin về..."
            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium resize-y"
          />
        </div>
      </div>
    </div>
  );
};
