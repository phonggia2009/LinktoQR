import React from 'react';
import { HelpCircle, Printer, Layers, Maximize } from 'lucide-react';

export const GuideSection: React.FC = () => {
  return (
    <section id="guide" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Cẩm nang in ấn & quét mã</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-4">
            Hướng dẫn sử dụng & In ấn chuẩn nét
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Để đảm bảo mã QR có thể quét nhanh trong 1 giây trên mọi dòng điện thoại thông minh, hãy lưu ý các nguyên tắc thiết kế sau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                1. Kích thước in ấn vật lý
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Danh thiếp / Thẻ nhân viên:</strong> Tối thiểu 2 × 2 cm.</li>
                <li>• <strong>Menu để bàn / Tờ rơi A5:</strong> Khoảng 3 × 3 cm đến 4 × 4 cm.</li>
                <li>• <strong>Standee / Poster A3 - A0:</strong> Tối thiểu 10 × 10 cm để quét từ khoảng cách 1 – 2 mét.</li>
                <li>• <strong>Biển quảng cáo ngoài trời:</strong> Tối thiểu 30 × 30 cm trở lên.</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              Tải file SVG vector để phóng to vô hạn không vỡ nét
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                2. Chọn mức sửa lỗi (ECC)
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Low (L - 7%):</strong> Mắt QR to, thoáng nhất, phù hợp hiển thị trên màn hình web.</li>
                <li>• <strong>Medium (M - 15%):</strong> Mức cân bằng chuẩn cho ấn phẩm thông thường.</li>
                <li>• <strong>High (H - 30%):</strong> Bắt buộc khi có logo ở giữa hoặc in ngoài trời tránh bụi bẩn làm rách mã.</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Hệ thống tự động chuyển sang High khi bạn thêm logo
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Maximize className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                3. Độ tương phản & Vùng đệm
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Nét tối trên nền sáng:</strong> Camera điện thoại nhận diện nhanh nhất với mã màu đậm (đen, navy) trên nền trắng/kem.</li>
                <li>• <strong>Vùng viền đệm (Quiet Zone):</strong> Luôn để viền trắng xung quanh QR, không để các chi tiết đồ họa khác đè sát vào mã.</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              Hệ thống sẽ hiện cảnh báo nếu bạn chọn màu tương phản thấp
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
