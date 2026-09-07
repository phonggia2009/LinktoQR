import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'QR có hết hạn không?',
    answer:
      'Không. Mã do chúng tôi tạo ra là Static QR Code (mã QR tĩnh), không có ngày hết hạn. Mã QR sẽ hoạt động vĩnh viễn miễn là nội dung bên trong (ví dụ như đường dẫn URL website của bạn) vẫn còn tồn tại.',
  },
  {
    question: 'Có quảng cáo không?',
    answer:
      'Không. Website hoàn toàn không có quảng cáo, không chuyển hướng qua trang trung gian để chèn quảng cáo và không gắn bất kỳ mã theo dõi nào.',
  },
  {
    question: 'Có lưu dữ liệu không?',
    answer:
      'Không lưu lên server. Thuật toán tạo mã chạy 100% bằng JavaScript nội bộ trên thiết bị của bạn. Tính năng Lịch sử chỉ lưu cục bộ trong LocalStorage của trình duyệt và bạn có toàn quyền đổi tên hoặc xóa bất cứ lúc nào.',
  },
  {
    question: 'Có cần đăng ký tài khoản không?',
    answer:
      'Không cần đăng ký. Bạn có thể sử dụng toàn bộ tính năng, tạo và tải xuống không giới hạn số lượng mã QR ngay lập tức mà không cần cung cấp email hay thông tin cá nhân.',
  },
  {
    question: 'Có thể dùng QR để in poster không?',
    answer:
      'Có. Chúng tôi hỗ trợ xuất định dạng file SVG vector (cho phép phóng to kích thước biển quảng cáo ngoài trời mà không bao giờ vỡ nét) và định dạng PNG HD 2048 × 2048 px chuẩn 300 DPI.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Câu hỏi thường gặp</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-3">
            Những thắc mắc phổ biến về QR Generator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Giải đáp minh bạch về cơ chế mã hóa tĩnh, quyền riêng tư và khả năng ứng dụng thực tế.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
