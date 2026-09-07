import React, { useEffect, useRef, useMemo } from 'react';
import { QrCode, ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { QRDesignConfig, QRDataState } from '../types/qr';
import { renderQRToCanvas } from '../lib/qr';
import { evaluateContrast } from '../lib/contrast';
import { DownloadButtons } from './DownloadButtons';

interface QRPreviewProps {
  payload: string;
  dataState: QRDataState;
  displayTitle: string;
  displaySummary: string;
  config: QRDesignConfig;
  onPrint: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  dataState,
  displayTitle,
  displaySummary,
  config,
  onPrint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasPayload = !!payload.trim();

  // 1. Contrast Check
  const contrast = useMemo(() => {
    return evaluateContrast(config.fgColor, config.bgColor);
  }, [config.fgColor, config.bgColor]);

  // 2. Logo Size Check
  const isLogoTooLarge = Boolean(
    config.includeLogo && config.logoUrl && config.logoSizeRatio > 0.22
  );

  // 3. Content Length Check
  const isContentLong = payload.length > 150;

  // Render QR to canvas
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
      {/* Main SaaS QR Card */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center">
        {/* Card Header Status */}
        <div className="w-full flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Xem trước trực tiếp
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Static QR Code</span>
          </span>
        </div>

        {/* QR Display Canvas Wrapper */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-white border border-slate-200 dark:border-slate-700/80 shadow-inner overflow-hidden mx-auto">
          {hasPayload ? (
            <canvas
              ref={canvasRef}
              width={360}
              height={360}
              className="max-w-full max-h-full w-full h-full object-contain rounded-xl block"
              style={{
                backgroundColor: config.bgColor,
                maxWidth: '100%',
                maxHeight: '100%',
                width: '100%',
                height: '100%',
                aspectRatio: '1 / 1',
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500 animate-pulse">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center mb-3">
                <QrCode className="w-10 h-10 opacity-40 text-slate-500" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Chưa có dữ liệu
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
                Nhập nội dung ở cột bên trái để hiển thị mã QR
              </p>
            </div>
          )}

          {/* Size watermark badge */}
          {hasPayload && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-mono text-white/90">
              {config.size} × {config.size} px
            </div>
          )}
        </div>

        {/* Sub-label & Privacy guarantee */}
        <div className="mt-4 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Static QR Code</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed mx-auto">
            Quét trực tiếp đến nội dung của bạn – không qua máy chủ trung gian.
          </p>
        </div>

        {/* QR Quality Checker Banner */}
        {hasPayload && (contrast.ratio < 3.0 || isLogoTooLarge || isContentLong) && (
          <div className="w-full mt-4 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/40 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Kiểm tra chất lượng quét (Quality Check)</span>
            </div>
            {contrast.ratio < 3.0 && (
              <p className="text-[11px] leading-tight text-red-700 dark:text-red-300 flex items-start gap-1">
                <span>•</span>
                <span>⚠ Màu sắc có thể khiến QR khó quét ({contrast.ratio}:1). Hãy tăng độ tương phản.</span>
              </p>
            )}
            {isLogoTooLarge && (
              <p className="text-[11px] leading-tight flex items-start gap-1">
                <span>•</span>
                <span>⚠ Logo đang chiếm diện tích lớn, có thể ảnh hưởng khả năng quét.</span>
              </p>
            )}
            {isContentLong && (
              <p className="text-[11px] leading-tight text-blue-700 dark:text-blue-300 flex items-start gap-1">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>ℹ URL dài sẽ tạo QR phức tạp hơn. Cân nhắc dùng URL ngắn gọn nếu in ấn kích thước nhỏ.</span>
              </p>
            )}
          </div>
        )}

        {/* Payload summary preview */}
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-left">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-400 mb-0.5">
            {displayTitle}
          </div>
          <div
            className="text-xs font-mono text-slate-700 dark:text-slate-200 break-all line-clamp-2"
            title={payload}
          >
            {hasPayload ? displaySummary : 'Chưa có dữ liệu'}
          </div>
        </div>

        {/* Download Center */}
        <div className="w-full mt-5">
          <DownloadButtons
            payload={payload}
            dataState={dataState}
            config={config}
            onPrint={onPrint}
          />
        </div>
      </div>
    </div>
  );
};
