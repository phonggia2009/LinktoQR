import React from 'react';
import { History, Trash2, RotateCcw, Clock, Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import { HistoryItem, QRType } from '../types/qr';
import { useToast } from './Toast';

interface QRHistoryProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const TYPE_ICONS: Record<QRType, React.ElementType> = {
  url: Globe,
  text: FileText,
  email: Mail,
  phone: Phone,
  wifi: Wifi,
};

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });
}

export const QRHistory: React.FC<QRHistoryProps> = ({
  items,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  const { showToast } = useToast();

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ 10 lịch sử mã QR gần nhất?')) {
      onClearAll();
      showToast('Đã xóa toàn bộ lịch sử', 'info');
    }
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
    showToast('Đã xóa 1 mục khỏi lịch sử', 'info');
  };

  if (items.length === 0) {
    return (
      <section id="history" className="pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Chưa có lịch sử gần đây
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Khi bạn nhập nội dung và tạo mã QR, lịch sử sẽ tự động được lưu tạm thời trên trình duyệt (tối đa 10 mã gần nhất) để bạn có thể xem lại bất kỳ lúc nào.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="history" className="pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  Lịch sử gần đây ({items.length}/10)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lưu cục bộ trong bộ nhớ máy của bạn (localStorage), không tải lên server.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ</span>
            </button>
          </div>

          {/* History Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => {
              const Icon = TYPE_ICONS[item.type] || Globe;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group relative p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  title="Nhấn để nạp lại mã QR này"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{item.title}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
                        aria-label="Xóa mục này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all line-clamp-2 mb-3">
                      {item.displaySummary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(item.createdAt)}
                    </span>

                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                      <span>Nạp lại</span>
                      <RotateCcw className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
