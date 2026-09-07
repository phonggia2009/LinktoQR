import React from 'react';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import { QRType } from '../types/qr';

interface QRTypeSelectorProps {
  currentType: QRType;
  onSelectType: (type: QRType) => void;
}

interface TypeTab {
  id: QRType;
  label: string;
  icon: React.ElementType;
}

const TABS: TypeTab[] = [
  { id: 'url', label: 'URL', icon: Globe },
  { id: 'text', label: 'Văn bản', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Điện thoại', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
];

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
  currentType,
  onSelectType,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentType === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectType(tab.id)}
              className={`flex-1 min-w-[90px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
