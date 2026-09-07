import React from 'react';
import { ArrowDown, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section id="hero-section" className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center overflow-hidden">
      {/* Background ambient subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-teal-500/10 blur-3xl pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>100% Static QR Code • Không máy chủ trung gian</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.15] mb-5">
          Tạo mã QR miễn phí, nhanh chóng và{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400">
            không quảng cáo
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Tạo QR Code trực tiếp trên trình duyệt của bạn. Không cần đăng ký tài khoản, không lưu dữ liệu lên máy chủ và không bao giờ chuyển hướng qua trang quảng cáo.
        </p>

        {/* CTA & Trust badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            type="button"
            onClick={onStartClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-98 cursor-pointer"
          >
            Bắt đầu tạo QR
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tức Thì Real-Time</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mã QR cập nhật ngay lập tức theo từng ký tự bạn nhập.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Bảo Mật Tuyệt Đối</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Xử lý 100% trên thiết bị, mật khẩu Wi-Fi không gửi lên server.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Không Hết Hạn</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mã QR tĩnh tồn tại vĩnh viễn, in ấn an tâm dùng trọn đời.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
