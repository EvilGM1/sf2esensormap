import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Smartphone } from 'lucide-react';

interface QrConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrConnectModal: React.FC<QrConnectModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://evilgm1.github.io/sf2esensormap/';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(
        currentUrl,
        {
          width: 256,
          margin: 1.5,
          color: {
            dark: '#070b14',
            light: '#ffffff',
          },
        },
        (err, url) => {
          if (!err) {
            setQrDataUrl(url);
          } else {
            console.error('Failed to generate QR code', err);
          }
        }
      );
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-void-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-center">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm font-mono">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Connect Phones at Table</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-300 font-mono">
            Players can scan this QR code with their phone camera to open the Sensor Map directly at the table.
          </p>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-700">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code to connect" className="w-52 h-52 object-contain" />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-500 font-mono text-xs">
                Generating QR...
              </div>
            )}
          </div>

          {/* URL Box and Copy */}
          <div className="w-full flex items-center gap-1.5 p-2 bg-void-950 rounded-lg border border-slate-800 text-xs font-mono">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent flex-1 text-slate-400 focus:outline-none truncate select-all"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            Tip: Switch to <strong>Player View</strong> on player devices for fog of war!
          </p>
        </div>
      </div>
    </div>
  );
};
