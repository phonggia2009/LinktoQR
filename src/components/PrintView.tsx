import React, { useEffect, useRef } from 'react';
import { QRDesignConfig } from '../types/qr';
import { renderQRToCanvas } from '../lib/qr';

interface PrintViewProps {
  payload: string;
  title: string;
  summary: string;
  config: QRDesignConfig;
}

export const PrintView: React.FC<PrintViewProps> = ({
  payload,
  title,
  summary,
  config,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && payload) {
      // Render large high-DPI canvas for paper printing (600x600px)
      renderQRToCanvas(canvasRef.current, payload, config, 600).catch(console.error);
    }
  }, [payload, config]);

  return (
    <div id="print-container" className="text-center font-sans">
      <div className="max-w-md mx-auto p-8 border-2 border-black rounded-3xl flex flex-col items-center">
        {/* Brand header on paper */}
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-black font-display">
          MÃ QR CODE
        </h1>
        <p className="text-xs text-gray-600 mb-6 font-medium uppercase tracking-wider">
          {title}
        </p>

        {/* Crisp QR Canvas for Printing */}
        <div className="p-4 border border-gray-300 rounded-2xl bg-white shadow-none mb-6">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-[280px] h-[280px] object-contain"
          />
        </div>

        {/* Encoded payload info */}
        <div className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-center mb-6">
          <span className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1">
            Nội dung mã hóa
          </span>
          <div className="text-sm font-mono text-black font-semibold break-all">
            {summary || payload}
          </div>
        </div>

        {/* Scan instruction */}
        <p className="text-xs text-gray-500 leading-normal">
          Mở ứng dụng Camera hoặc Google Lens trên điện thoại của bạn để quét mã QR này.
        </p>

        <div className="mt-8 pt-4 border-t border-gray-200 w-full flex justify-between items-center text-[10px] text-gray-400">
          <span>Tạo miễn phí bởi QR Generator</span>
          <span>100% Static QR Code • Không quảng cáo</span>
        </div>
      </div>
    </div>
  );
};
