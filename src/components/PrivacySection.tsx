import React from 'react';
import { ShieldCheck, ServerOff, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 shadow-sm">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Cam kết bảo mật & Quyền riêng tư</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-4">
              Dữ liệu của bạn thuộc về chính bạn
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">
                "QR được tạo trực tiếp trên thiết bị của bạn. Dữ liệu bạn nhập không được gửi lên máy chủ."
              </strong>
            </p>
          </div>

          {/* 3 Privacy Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <ServerOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                100% Thuật toán Client-Side
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mọi tác vụ tính toán ma trận ma quái QR, nén dữ liệu và vẽ Canvas đều chạy bằng JavaScript trên trình duyệt của máy bạn. Chúng tôi không sở hữu và không vận hành backend lưu trữ dữ liệu người dùng.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Không Tracking, Không Quảng Cáo
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Website hoàn toàn không cài đặt Google Analytics, Facebook Pixel, Hotjar, cookies tiếp thị hay bất kỳ mạng lưới quảng cáo nào nhằm theo dõi thói quen của bạn.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Không Redirect Trung Gian
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nhiều dịch vụ tạo QR tính phí tạo ra link rút gọn chuyển tiếp chứa quảng cáo hoặc bắt trả phí sau 14 ngày. QR Generator tạo mã Static vĩnh viễn, quét thẳng tới đích.
              </p>
            </div>
          </div>

          {/* Static vs Dynamic Comparison Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                So sánh Static QR (Của chúng tôi) vs Dynamic QR bên thứ ba
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 gap-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Dữ liệu mã hóa trực tiếp vào hình ảnh QR</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Chuyển hướng qua máy chủ trung gian chứa quảng cáo</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 gap-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Tồn tại vĩnh viễn, không bao giờ hết hạn</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Khóa mã QR đòi tiền chuộc sau thời gian dùng thử</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 gap-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Hoạt động 100% Offline (không cần mạng)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Nếu máy chủ bên thứ ba bị sập, mã QR của bạn sẽ chết</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
