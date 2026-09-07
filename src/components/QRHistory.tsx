import React, { useState } from 'react';
import {
  History,
  Trash2,
  RotateCcw,
  Clock,
  Globe,
  FileText,
  Mail,
  Phone,
  Wifi,
  Edit2,
  Check,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { HistoryItem, QRType } from '../types/qr';
import { useToast } from './Toast';

interface QRHistoryProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onRename: (id: string, newTitle: string) => void;
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
  onRename,
  onDelete,
  onClearAll,
}) => {
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const startRename = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditingText(item.customName || item.title);
  };

  const saveRename = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editingText.trim()) {
      onRename(id, editingText.trim());
      showToast('Đã đổi tên mục lịch sử', 'success');
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleConfirmClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
    showToast('Đã xóa toàn bộ lịch sử', 'info');
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
    showToast('Đã xóa 1 mục khỏi lịch sử', 'info');
  };

  if (items.length === 0) {
    return (
      <section id="history" className="pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Chưa có lịch sử gần đây
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Khi bạn tạo mã QR, lịch sử sẽ tự động lưu tạm trên trình duyệt của bạn (tối đa 12 mã) để bạn dễ dàng phục hồi bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="history" className="pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  Lịch sử gần đây ({items.length}/12)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lưu trên thiết bị của bạn (localStorage), 100% riêng tư không gửi lên máy chủ.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ</span>
            </button>
          </div>

          {/* History Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {items.map((item) => {
              const Icon = TYPE_ICONS[item.type] || Globe;
              const isEditing = editingId === item.id;
              const hasLogo = Boolean(item.hasLogo ?? (item.config?.includeLogo && item.config?.logoUrl));

              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-850 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  title="Bấm để khôi phục mã QR này vào trình chỉnh sửa"
                >
                  <div>
                    {/* Title and Controls */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {isEditing ? (
                        <div
                          className="flex items-center gap-1 flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-1 px-2 py-0.5 text-xs bg-white dark:bg-slate-800 border border-blue-500 rounded-md text-slate-900 dark:text-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={(e) => saveRename(e, item.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelRename}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.customName || item.title}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => startRename(e, item)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 rounded transition-opacity"
                            title="Đổi tên mã này"
                            aria-label="Đổi tên mã"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Right badges & delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasLogo && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            <Sparkles className="w-2.5 h-2.5" />
                            Logo
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(e, item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
                          title="Xóa mục này"
                          aria-label="Xóa mục này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Summary text */}
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all line-clamp-2 mb-3">
                      {item.displaySummary}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400">
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

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Xóa toàn bộ lịch sử?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tất cả các mã QR trong danh sách lịch sử cục bộ của bạn sẽ bị xóa. Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
