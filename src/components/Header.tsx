import React, { useState } from 'react';
import { QrCode, Sun, Moon, Laptop, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Theme } from '../types/qr';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onScrollToGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onScrollToGenerator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          aria-label="QR Generator Trang chủ"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 dark:text-white font-display tracking-tight leading-tight">
              QR Generator
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Static & Riêng tư
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={onScrollToGenerator}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Tạo QR
          </button>
          <a
            href="#guide"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Hướng dẫn
          </a>
          <a
            href="#history"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Lịch sử
          </a>
          <a
            href="#privacy"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Quyền riêng tư
          </a>
        </nav>

        {/* Right Actions: Theme Selector + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Selector segmented control */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Giao diện Sáng"
              aria-label="Chọn giao diện Sáng"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Giao diện Tối"
              aria-label="Chọn giao diện Tối"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('system')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'system'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Theo Hệ Thống"
              aria-label="Chọn giao diện Theo hệ thống"
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onScrollToGenerator}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs shadow-blue-500/25 transition-all hover:shadow-md hover:shadow-blue-500/20 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Tạo QR ngay
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick theme toggle for mobile */}
          <button
            type="button"
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Đổi chế độ sáng tối"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700 dark:text-slate-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToGenerator();
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Tạo mã QR
            </button>
            <a
              href="#guide"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hướng dẫn
            </a>
            <a
              href="#history"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Lịch sử gần đây
            </a>
            <a
              href="#privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Quyền riêng tư & Bảo mật
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Chế độ giao diện</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                className={`px-3 py-1 text-xs rounded-lg font-medium ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Sáng
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                className={`px-3 py-1 text-xs rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Tối
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('system')}
                className={`px-3 py-1 text-xs rounded-lg font-medium ${
                  theme === 'system'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Hệ thống
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
