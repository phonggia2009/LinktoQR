import React from 'react';
import { HelpCircle, Printer, Layers, Maximize, ArrowRight, ShieldCheck } from 'lucide-react';

const STEPS = [
  { step: '1', title: 'Nhập nội dung', desc: 'Nhập liên kết website, văn bản, mật khẩu Wi-Fi hoặc thông tin liên hệ.' },
  { step: '2', title: 'Mã hóa tức thì', desc: 'Website dùng thuật toán mã hóa trực tiếp nội dung thành các ma trận điểm QR trên máy bạn.' },
  { step: '3', title: 'Tải QR Code', desc: 'Chọn tải về định dạng PNG sắc nét hoặc SVG Vector in ấn không vỡ hình.' },
  { step: '4', title: 'In hoặc chia sẻ', desc: 'Gắn mã QR lên bao bì, menu, card visit, standee hoặc chia sẻ online.' },
  { step: '5', title: 'Người khác quét mã', desc: 'Điện thoại quét mã và truy cập thẳng đến nội dung đích ngay lập tức.' },
];

export const GuideSection: React.FC = () => {
  return (
    <section id="guide" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: How QR works 5 steps */}
        <div className="mb-14">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>Cơ chế hoạt động</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-4">
              QR Code hoạt động như thế nào?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Nguyên lý hoạt động tĩnh và minh bạch: dữ liệu được đóng gói trực tiếp vào các khối module hình học.
            </p>
          </div>

          {/* 5-Step Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {STEPS.map((s, idx) => (
              <div
                key={s.step}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3 shadow-xs">
                    {s.step}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="mt-6 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-center flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Cam kết cốt lõi: QR Generator không đứng giữa người dùng và website đích.</span>
          </div>
        </div>

        {/* Section 2: Print & Scannability tips */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Cẩm nang In ấn chuẩn nét
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Đảm bảo mã QR quét siêu tốc trong 1 giây trên mọi dòng camera điện thoại.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Printer className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  1. Kích thước in ấn vật lý
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                  <li>• <strong>Danh thiếp / Thẻ nhân viên:</strong> Tối thiểu 2 × 2 cm.</li>
                  <li>• <strong>Menu để bàn / Tờ rơi:</strong> Tối thiểu 3 × 3 cm đến 4 × 4 cm.</li>
                  <li>• <strong>Standee / Poster:</strong> Tối thiểu 10 × 10 cm để quét từ 1 – 2m.</li>
                  <li>• <strong>Biển quảng cáo ngoài trời:</strong> Tối thiểu 30 × 30 cm trở lên.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                Tải file SVG vector để in ấn kích thước lớn mà không vỡ nét
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  2. Chọn mức sửa lỗi (ECC)
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                  <li>• <strong>Low (L - 7%):</strong> Mắt QR to, phù hợp hiển thị trên web.</li>
                  <li>• <strong>Medium (M - 15%):</strong> Chuẩn khuyên dùng cho ấn phẩm thông thường.</li>
                  <li>• <strong>High (H - 30%):</strong> Bắt buộc khi có logo ở giữa hoặc in ngoài trời.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Hệ thống tự động kích hoạt mức High khi bạn bật logo
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <Maximize className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  3. Độ tương phản & Viền đệm
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                  <li>• <strong>Nét tối trên nền sáng:</strong> Camera nhận diện tốt nhất với nét đậm trên nền sáng.</li>
                  <li>• <strong>Vùng viền đệm (Quiet Zone):</strong> Luôn giữ viền trắng bao quanh mã để mắt quét phân định.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Hệ thống tự động cảnh báo nếu bạn chọn màu tương phản thấp
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
