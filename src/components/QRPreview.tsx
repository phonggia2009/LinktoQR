import React, { useEffect, useRef } from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';
import { QRDesignConfig } from '../types/qr';
import { renderQRToCanvas } from '../lib/qr';
import { DownloadButtons } from './DownloadButtons';

interface QRPreviewProps {
  payload: string;
  displayTitle: string;
  displaySummary: string;
  config: QRDesignConfig;
  onPrint: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  displayTitle,
  displaySummary,
  config,
  onPrint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hasPayload = !!payload.trim();

  // Render QR code to canvas whenever payload or design configuration changes
  useEffect(() => {
    if (!canvasRef.current) return;

    if (hasPayload) {
      renderQRToCanvas(canvasRef.current, payload, config, 360).catch((err) => {
        console.error('Failed to render QR to canvas:', err);
      });
    }
  }, [payload, config, hasPayload]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* QR Canvas Card */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center">
        {/* Top badge */}
        <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Mã QR của bạn
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-medium">
            <ShieldCheck className="w-3 h-3" />
            Static QR
          </span>
        </div>

        {/* QR Display Area */}
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800/80 transition-all">
          {hasPayload ? (
            <canvas
              ref={canvasRef}
              width={360}
              height={360}
              className="w-full h-full object-contain rounded-xl drop-shadow-xs"
              style={{ backgroundColor: config.bgColor }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-600 animate-pulse">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mb-3">
                <QrCode className="w-10 h-10 opacity-40" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Chưa có dữ liệu
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-[180px]">
                Nhập nội dung ở panel bên trái để xem trước mã QR tức thì
              </p>
            </div>
          )}
        </div>

        {/* Payload display info */}
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-left">
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-0.5">
            {displayTitle}
          </div>
          <div
            className="text-xs font-mono text-slate-700 dark:text-slate-200 break-all line-clamp-2"
            title={payload}
          >
            {hasPayload ? displaySummary : 'Chưa có nội dung được mã hóa'}
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full mt-5">
          <DownloadButtons
            payload={payload}
            config={config}
            onPrint={onPrint}
          />
        </div>
      </div>
    </div>
  );
};
