import React, { useState } from 'react';
import { Download, Copy, Printer, Check, Image as ImageIcon, Code2, Loader2, Share2, Sparkles } from 'lucide-react';
import { QRDesignConfig, QRDataState } from '../types/qr';
import {
  generateQRPngBlob,
  generateQRSVG,
  copyImageBlobToClipboard,
  copyTextToClipboard,
  shareQRCode,
} from '../lib/qr';
import { generateSmartFilename } from '../lib/validation';
import { useToast } from './Toast';

interface DownloadButtonsProps {
  payload: string;
  dataState: QRDataState;
  config: QRDesignConfig;
  onPrint: () => void;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  payload,
  dataState,
  config,
  onPrint,
}) => {
  const { showToast } = useToast();
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [isCopyingImage, setIsCopyingImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const hasPayload = !!payload.trim();

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Đã tải QR thành công.', 'success');
  };

  // 1. Download PNG 1024px
  const handleDownloadPngStandard = async () => {
    if (!hasPayload) {
      showToast('Vui lòng nhập nội dung trước khi tải về', 'warning');
      return;
    }
    try {
      setDownloadingType('png-standard');
      const blob = await generateQRPngBlob(payload, config, 1024);
      const filename = generateSmartFilename(dataState, 'png');
      triggerDownload(blob, filename);
    } catch (err) {
      console.error('Error downloading PNG:', err);
      showToast('Có lỗi xảy ra khi tạo file PNG', 'error');
    } finally {
      setDownloadingType(null);
    }
  };

  // 2. Download PNG HD 2048px
  const handleDownloadPngHD = async () => {
    if (!hasPayload) {
      showToast('Vui lòng nhập nội dung trước khi tải về', 'warning');
      return;
    }
    try {
      setDownloadingType('png-hd');
      const blob = await generateQRPngBlob(payload, config, 2048);
      const filename = generateSmartFilename(dataState, 'png').replace(/\.png$/, '-hd.png');
      triggerDownload(blob, filename);
    } catch (err) {
      console.error('Error downloading PNG HD:', err);
      showToast('Có lỗi xảy ra khi tạo file PNG HD', 'error');
    } finally {
      setDownloadingType(null);
    }
  };

  // 3. Download Vector SVG
  const handleDownloadSvg = async () => {
    if (!hasPayload) {
      showToast('Vui lòng nhập nội dung trước khi tải về', 'warning');
      return;
    }
    try {
      setDownloadingType('svg');
      const svgContent = await generateQRSVG(payload, config);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const filename = generateSmartFilename(dataState, 'svg');
      triggerDownload(blob, filename);
    } catch (err) {
      console.error('Error downloading SVG:', err);
      showToast('Có lỗi xảy ra khi tạo file SVG', 'error');
    } finally {
      setDownloadingType(null);
    }
  };

  // 4. Share QR (Web Share API)
  const handleShare = async () => {
    if (!hasPayload) {
      showToast('Chưa có nội dung để chia sẻ', 'warning');
      return;
    }

    try {
      const blob = await generateQRPngBlob(payload, config, 1024);
      const result = await shareQRCode('Mã QR của tôi', payload, payload, blob);

      if (result.success) {
        showToast('Đã chia sẻ mã QR thành công', 'success');
      } else if (!result.isSupported) {
        // Fallback: Copy link/payload
        await copyTextToClipboard(payload);
        showToast('Trình duyệt không hỗ trợ chia sẻ trực tiếp. Đã sao chép nội dung!', 'info');
      }
    } catch {
      showToast('Không thể chia sẻ mã QR', 'error');
    }
  };

  // 5. Copy QR Image
  const handleCopyImage = async () => {
    if (!hasPayload) {
      showToast('Vui lòng nhập nội dung trước khi sao chép', 'warning');
      return;
    }
    try {
      setIsCopyingImage(true);
      const blob = await generateQRPngBlob(payload, config, 512);
      const success = await copyImageBlobToClipboard(blob);
      if (success) {
        showToast('Đã sao chép ảnh mã QR vào Clipboard', 'success');
      } else {
        showToast('Trình duyệt chưa hỗ trợ copy ảnh, hãy dùng nút Tải PNG', 'warning');
      }
    } catch (err) {
      console.error('Error copying image:', err);
      showToast('Không thể sao chép ảnh vào clipboard', 'error');
    } finally {
      setIsCopyingImage(false);
    }
  };

  // 6. Copy Text Payload
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
    <div className="space-y-3 pt-1">
      {/* Top Section Header */}
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Download Center
      </div>

      {/* Primary Download Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* PNG Standard */}
        <button
          type="button"
          onClick={handleDownloadPngStandard}
          disabled={!hasPayload || downloadingType !== null}
          className="inline-flex items-center justify-between px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          title="Tải ảnh định dạng PNG kích thước 1024x1024"
        >
          <div className="flex items-center gap-2">
            {downloadingType === 'png-standard' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Tải PNG</span>
          </div>
          <span className="text-[10px] bg-blue-700/80 px-1.5 py-0.5 rounded font-mono">1024px</span>
        </button>

        {/* PNG HD */}
        <button
          type="button"
          onClick={handleDownloadPngHD}
          disabled={!hasPayload || downloadingType !== null}
          className="inline-flex items-center justify-between px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          title="Tải ảnh định dạng PNG kích thước siêu nét 2048x2048"
        >
          <div className="flex items-center gap-2">
            {downloadingType === 'png-hd' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>Tải PNG HD</span>
          </div>
          <span className="text-[10px] bg-indigo-700/80 px-1.5 py-0.5 rounded font-mono">2048px</span>
        </button>

        {/* SVG Vector */}
        <button
          type="button"
          onClick={handleDownloadSvg}
          disabled={!hasPayload || downloadingType !== null}
          className="inline-flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          title="Tải file vector SVG phóng to vô hạn cho thiết kế in ấn"
        >
          <div className="flex items-center gap-2">
            {downloadingType === 'svg' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Code2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>Tải SVG Vector</span>
          </div>
          <span className="text-[10px] bg-slate-800 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">Vector</span>
        </button>

        {/* Print / High DPI */}
        <button
          type="button"
          onClick={onPrint}
          disabled={!hasPayload}
          className="inline-flex items-center justify-between px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          title="In mã QR chuẩn 300 DPI qua máy in"
        >
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span>In ấn (Print)</span>
          </div>
          <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded font-mono">300 DPI</span>
        </button>
      </div>

      {/* Secondary Actions: Share, Copy Image, Copy Text */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <button
          type="button"
          onClick={handleShare}
          disabled={!hasPayload}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:pointer-events-none text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          title="Chia sẻ mã QR qua mạng xã hội hoặc ứng dụng"
          aria-label="Chia sẻ mã QR"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="truncate">Chia sẻ</span>
        </button>

        <button
          type="button"
          onClick={handleCopyImage}
          disabled={!hasPayload || isCopyingImage}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:pointer-events-none text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          title="Sao chép ảnh mã QR vào Clipboard"
          aria-label="Sao chép ảnh mã QR"
        >
          {isCopyingImage ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          )}
          <span className="truncate">Copy ảnh</span>
        </button>

        <button
          type="button"
          onClick={handleCopyText}
          disabled={!hasPayload}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:pointer-events-none text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          title="Sao chép chuỗi mã hóa"
          aria-label="Sao chép chuỗi mã hóa"
        >
          {copiedText ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          )}
          <span className="truncate">Copy link</span>
        </button>
      </div>
    </div>
  );
};
