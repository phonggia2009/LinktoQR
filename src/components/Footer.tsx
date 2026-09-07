import React, { useState } from 'react';
import { QrCode, ShieldCheck, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white font-display">
                QR Generator
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Tạo mã QR đơn giản, miễn phí và riêng tư. Giải pháp mã hóa tĩnh 100% trên trình duyệt người dùng, bảo vệ quyền riêng tư tuyệt đối.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Không lưu dữ liệu • Không tracking • Không chuyển hướng</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Chức năng
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href="#generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tạo mã URL / Website
                </a>
              </li>
              <li>
                <a href="#generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tạo mã Wi-Fi tự động kết nối
                </a>
              </li>
              <li>
                <a href="#generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tạo mã Email & Điện thoại
                </a>
              </li>
              <li>
                <a href="#generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tùy biến Logo & Màu sắc
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Project */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Thông tin & Pháp lý
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      'Chính sách quyền riêng tư',
                      'Chúng tôi cam kết không thu thập, lưu trữ hay chia sẻ bất kỳ dữ liệu nào mà bạn nhập vào công cụ này. Toàn bộ quá trình tạo mã QR diễn ra hoàn toàn bằng JavaScript nội bộ trên trình duyệt của bạn (Client-side). Dữ liệu của bạn không bao giờ rời khỏi thiết bị.'
                    )
                  }
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Chính sách riêng tư
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      'Điều khoản sử dụng',
                      'Bạn được quyền tự do sử dụng công cụ QR Generator cho cả mục đích cá nhân và thương mại hoàn toàn miễn phí. Mã QR tạo ra thuộc toàn quyền sở hữu của bạn và tồn tại vĩnh viễn không bị giới hạn số lượt quét.'
                    )
                  }
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Điều khoản sử dụng
                </button>
              </li>
              <li>
                <a href="#guide" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Hướng dẫn in ấn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © 2026 QR Generator. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Thiết kế tối ưu cho</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Vercel Deployment</span>
          </div>
        </div>
      </div>

      {/* Info Modal for Privacy & Terms */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {modalContent.title}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {modalContent.content}
            </p>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
