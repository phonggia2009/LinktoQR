import React, { useState } from 'react';
import { Download, Copy, Printer, Check, Image as ImageIcon, Code2, Loader2 } from 'lucide-react';
import { QRDesignConfig } from '../types/qr';
import {
  generateQRPngBlob,
  generateQRSVG,
  copyImageBlobToClipboard,
  copyTextToClipboard,
} from '../lib/qr';
import { useToast } from './Toast';

interface DownloadButtonsProps {
  payload: string;
  config: QRDesignConfig;
  onPrint: () => void;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  payload,
  config,
  onPrint,
}) => {
  const { showToast } = useToast();
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingSvg, setIsDownloadingSvg] = useState(false);
  const [isCopyingImage, setIsCopyingImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const hasPayload = !!payload.trim();

  // 1. Download PNG
  const handleDownloadPng = async () => {
    if (!hasPayload) {
      showToast('Vui lòng nhập nội dung trước khi tải về', 'warning');
      return;
    }
    try {
      setIsDownloadingPng(true);
      const blob = await generateQRPngBlob(payload, config, config.size);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Đã tải xuống qr-code.png (${config.size}×${config.size}px)`, 'success');
    } catch (err) {
      console.error('Error downloading PNG:', err);
      showToast('Có lỗi xảy ra khi tạo file PNG', 'error');
    } finally {
      setIsDownloadingPng(false);
    }
  };

  // 2. Download SVG
  const handleDownloadSvg = async () => {
    if (!hasPayload) {
      showToast('Vui lòng nhập nội dung trước khi tải về', 'warning');
      return;
    }
    try {
      setIsDownloadingSvg(true);
      const svgContent = await generateQRSVG(payload, config);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Đã tải xuống qr-code.svg (Vector chuẩn in ấn khổ lớn)', 'success');
    } catch (err) {
      console.error('Error downloading SVG:', err);
      showToast('Có lỗi xảy ra khi tạo file SVG', 'error');
    } finally {
      setIsDownloadingSvg(false);
    }
  };

  // 3. Copy QR Image
  const handleCopyImage = async () => {
    if (!hasPayload) {
      showToast('Vui lòng nhập nội dung trước khi sao chép', 'warning');
      return;
    }
    try {
      setIsCopyingImage(true);
      // Copy at 512px for standard clipboard usage
      const blob = await generateQRPngBlob(payload, config, 512);
      const success = await copyImageBlobToClipboard(blob);
      if (success) {
        showToast('Đã sao chép ảnh mã QR vào bộ nhớ đệm (Clipboard)', 'success');
      } else {
        showToast('Trình duyệt của bạn chưa cấp quyền copy ảnh trực tiếp, hãy dùng nút Tải PNG', 'warning');
      }
    } catch (err) {
      console.error('Error copying image:', err);
      showToast('Không thể sao chép ảnh vào clipboard', 'error');
    } finally {
      setIsCopyingImage(false);
    }
  };

  // 4. Copy raw payload
  const handleCopyText = async () => {
    if (!hasPayload) {
      showToast('Chưa có nội dung để sao chép', 'warning');
      return;
    }
    const success = await copyTextToClipboard(payload);
    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      showToast('Đã sao chép nội dung mã hóa vào bộ nhớ tạm', 'success');
    } else {
      showToast('Không thể sao chép nội dung', 'error');
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Primary Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={!hasPayload || isDownloadingPng}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          {isDownloadingPng ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Tải PNG ({config.size}px)</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSvg}
          disabled={!hasPayload || isDownloadingSvg}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          {isDownloadingSvg ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Code2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>Tải SVG (Vector)</span>
        </button>
      </div>

      {/* Secondary Actions: Copy & Print */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleCopyImage}
          disabled={!hasPayload || isCopyingImage}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:pointer-events-none text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          title="Sao chép ảnh mã QR vào clipboard"
        >
          {isCopyingImage ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span className="truncate">Sao chép QR</span>
        </button>

        <button
          type="button"
          onClick={handleCopyText}
          disabled={!hasPayload}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:pointer-events-none text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          title="Sao chép nội dung đã mã hóa"
        >
          {copiedText ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span className="truncate">Sao chép link</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          disabled={!hasPayload}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:pointer-events-none text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          title="In mã QR (mở hộp thoại in trình duyệt)"
        >
          <Printer className="w-3.5 h-3.5 text-indigo-600" />
          <span className="truncate">In mã QR</span>
        </button>
      </div>
    </div>
  );
};
