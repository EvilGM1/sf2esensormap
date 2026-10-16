import React, { useState } from 'react';
import { useSensor } from '../context/SensorContext';
import { X, KeyRound, AlertCircle } from 'lucide-react';

interface GmPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GmPinModal: React.FC<GmPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { authenticateGm, gmPin } = useSensor();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateGm(pinInput)) {
      setError(false);
      setPinInput('');
      onSuccess();
    } else {
      setError(true);
      setPinInput('');
    }
  };

  const handleKeypad = (digit: string) => {
    if (pinInput.length < 8) {
      setPinInput((prev) => prev + digit);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xs bg-void-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-center">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-void-950">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <KeyRound className="w-4 h-4" />
            <span>GM SECURITY CLEARANCE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col items-center gap-3">
          <p className="text-xs text-slate-400 font-mono">
            Enter GM Security PIN to access encounter controls and cloaked vessels.
          </p>

          {/* PIN Display */}
          <div className="w-full py-2.5 px-4 bg-void-950 border border-slate-700 rounded-xl text-center font-mono text-xl tracking-widest text-cyan-300 min-h-[44px] flex items-center justify-center">
            {pinInput ? '•'.repeat(pinInput.length) : <span className="text-xs text-slate-600">ENTER PIN</span>}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Invalid PIN. (Default: {gmPin})</span>
            </div>
          )}

          {/* Sci-Fi Keypad */}
          <div className="grid grid-cols-3 gap-1.5 w-full mt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypad(digit)}
                className="py-2.5 rounded-lg bg-void-800 hover:bg-void-700 active:bg-cyan-900 text-slate-200 font-mono text-base font-bold transition-colors"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-lg bg-void-950 hover:bg-void-800 text-rose-400 font-mono text-xs font-bold transition-colors"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleKeypad('0')}
              className="py-2.5 rounded-lg bg-void-800 hover:bg-void-700 active:bg-cyan-900 text-slate-200 font-mono text-base font-bold transition-colors"
            >
              0
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors shadow"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
