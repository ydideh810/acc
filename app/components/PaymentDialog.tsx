'use client';

import { useState } from 'react';
import { Zap, Bitcoin, X, Search } from 'lucide-react';
import { paymentManager } from '../lib/paymentManager';
import { Button } from '@getalby/bitcoin-connect-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentDialog({ isOpen, onClose, onSuccess }: PaymentDialogProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handlePurchase = async () => {
    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await paymentManager.addCredits(amount);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetrieveCredits = async () => {
    setIsRetrieving(true);
    setError(null);

    try {
      const success = await paymentManager.retrieveCreditsByMemo(memo);
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Invalid credit ID format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve credits');
    } finally {
      setIsRetrieving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-[400px] border border-[#ff0000] bg-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#ff0000] text-lg font-mono flex items-center gap-2">
            <Zap className="w-5 h-5" />
            PayPerQ
          </h2>
          <button 
            onClick={onClose}
            className="text-[#ff0000] hover:opacity-80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="border border-[#ff0000] p-4">
            <h3 className="text-[#ff0000] mb-4 font-mono flex items-center gap-2">
              <Bitcoin className="w-4 h-4" />
              Add Credits
            </h3>
            
            {!isWalletConnected && (
              <div className="mb-4">
                <Button 
                  onConnect={() => setIsWalletConnected(true)}
                  className="w-full py-2 border border-[#ff0000] text-[#ff0000] font-mono hover:bg-[#ff0000]/10"
                />
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1000, 5000, 10000, 50000].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value)}
                  className={`px-2 py-1 border border-[#ff0000] font-mono text-sm ${
                    amount === value ? 'bg-[#ff0000] text-black' : 'text-[#ff0000]'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <button
                onClick={handlePurchase}
                disabled={isProcessing || !isWalletConnected}
                className="w-full py-2 border border-[#ff0000] text-[#ff0000] font-mono hover:bg-[#ff0000]/10 disabled:opacity-50"
              >
                Pay {amount} sats
              </button>
            </div>
          </div>

          <div className="border border-[#ff0000] p-4">
            <h3 className="text-[#ff0000] mb-4 font-mono flex items-center gap-2">
              <Search className="w-4 h-4" />
              Retrieve Credits
            </h3>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Enter your credit ID"
              className="w-full bg-black border border-[#ff0000] p-2 mb-4 text-[#ff0000] font-mono placeholder-[#ff0000]/50"
            />
            <button
              onClick={handleRetrieveCredits}
              disabled={isRetrieving || !memo}
              className="w-full py-2 border border-[#ff0000] text-[#ff0000] font-mono hover:bg-[#ff0000]/10 disabled:opacity-50"
            >
              Retrieve Credits
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-[#ff0000] font-mono text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-[#ff0000]/70 font-mono text-xs">
          Your Credit ID: {paymentManager.getCreditId()}
        </div>
      </div>
    </div>
  );
}