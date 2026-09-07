import React, { useState } from 'react';
import { Wifi, KeyRound, Eye, EyeOff, Shield } from 'lucide-react';
import { WifiFormData } from '../../types/qr';
import { validateWifi } from '../../lib/validation';

interface WifiFormProps {
  data: WifiFormData;
  onChange: (data: WifiFormData) => void;
}

export const WifiForm: React.FC<WifiFormProps> = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const validation = validateWifi(data.ssid, data.password, data.encryption);

  return (
    <div className="space-y-4">
      {/* SSID */}
      <div>
        <label
          htmlFor="wifi-ssid"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Tên mạng Wi-Fi (SSID) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Wifi className="w-5 h-5" />
          </div>
          <input
            id="wifi-ssid"
            type="text"
            value={data.ssid}
            onChange={(e) => onChange({ ...data, ssid: e.target.value })}
            placeholder="Ví dụ: Coffee_WiFi_5G"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Encryption Type */}
      <div>
        <label
          htmlFor="wifi-encryption"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Chuẩn bảo mật
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Shield className="w-5 h-5" />
          </div>
          <select
            id="wifi-encryption"
            value={data.encryption}
            onChange={(e) =>
              onChange({
                ...data,
                encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
              })
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium cursor-pointer"
          >
            <option value="WPA">WPA / WPA2 / WPA3 (Phổ biến nhất)</option>
            <option value="WEP">WEP (Mạng cũ)</option>
            <option value="nopass">Không mật khẩu (Mạng công cộng)</option>
          </select>
        </div>
      </div>

      {/* Password (if not nopass) */}
      {data.encryption !== 'nopass' && (
        <div>
          <label
            htmlFor="wifi-password"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
          >
            Mật khẩu Wi-Fi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <input
              id="wifi-password"
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => onChange({ ...data, password: e.target.value })}
              placeholder="Nhập mật khẩu Wi-Fi"
              className="w-full pl-10 pr-11 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {!validation.isValid && validation.message && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {validation.message}
            </p>
          )}
        </div>
      )}

      {/* Hidden network checkbox */}
      <div className="flex items-center gap-2.5 pt-1">
        <input
          id="wifi-hidden"
          type="checkbox"
          checked={data.hidden}
          onChange={(e) => onChange({ ...data, hidden: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor="wifi-hidden"
          className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
        >
          Mạng Wi-Fi này là mạng ẩn (Hidden SSID)
        </label>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
        Khách hàng chỉ cần đưa camera điện thoại lên quét mã là sẽ tự động kết nối Wi-Fi ngay mà không cần nhập mật khẩu thủ công.
      </div>
    </div>
  );
};
