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
      <div className="max-w-sm mx-auto p-6 border-2 border-black rounded-2xl flex flex-col items-center bg-white shadow-none break-inside-avoid">
        {/* Brand header on paper */}
        <h1 className="text-xl font-bold tracking-tight mb-1 text-black font-display uppercase">
          Mã QR Code
        </h1>
        <p className="text-xs text-gray-600 mb-4 font-medium uppercase tracking-wider">
          {title}
        </p>

        {/* Crisp QR Canvas for Printing */}
        <div className="w-[220px] h-[220px] p-2 border border-gray-300 rounded-xl bg-white shadow-none mb-4 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-full h-full object-contain block"
          />
        </div>

        {/* Encoded payload info */}
        <div className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-center mb-4">
          <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">
            Nội dung mã hóa
          </span>
          <div className="text-xs font-mono text-black font-semibold break-all leading-tight">
            {summary || payload}
          </div>
        </div>

        {/* Scan instruction */}
        <p className="text-[11px] text-gray-500 leading-normal mb-4">
          Mở ứng dụng Camera hoặc Google Lens trên điện thoại của bạn để quét mã QR này.
        </p>

        <div className="pt-3 border-t border-gray-200 w-full flex justify-between items-center text-[9px] text-gray-400">
          <span>Tạo miễn phí bởi QR Generator</span>
          <span>100% Static QR Code • Không quảng cáo</span>
        </div>
      </div>
    </div>
  );
};
