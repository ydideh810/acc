'use client';

import { useState } from 'react';
import { Timer, X, Wallet, CreditCard } from 'lucide-react';
import { Button } from '@getalby/bitcoin-connect-react';

interface TimePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (duration: number) => void;
  isWalletConnected: boolean;
}

export interface TIME_PACKAGE_TYPE {
  duration: number;
  price: number;
  priceUSD: number;
  label: string;
  paypalLink: string;
}

const TIME_PACKAGES: TIME_PACKAGE_TYPE[] = [
  { 
    duration: 3, 
    price: 573, 
    priceUSD: 0.25, 
    label: '3 min',
    paypalLink: 'https://www.paypal.com/ncp/payment/XZ3QDHLZLATWS'
  },
  { 
    duration: 5, 
    price: 873, 
    priceUSD: 0.35, 
    label: '5 min',
    paypalLink: 'https://www.paypal.com/ncp/payment/XZ3QDHLZLATWS'
  },
  { 
    duration: 10, 
    price: 1573, 
    priceUSD: 0.60, 
    label: '10 min',
    paypalLink: 'https://www.paypal.com/ncp/payment/XZ3QDHLZLATWS'
  },
  { 
    duration: 30, 
    price: 3573, 
    priceUSD: 1.25, 
    label: '30 min',
    paypalLink: 'https://www.paypal.com/ncp/payment/XZ3QDHLZLATWS'
  },
];

export function TimePaymentDialog({ 
  isOpen, 
  onClose, 
  onPurchaseSuccess,
  isWalletConnected 
}: TimePaymentDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState(TIME_PACKAGES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'bitcoin' | 'paypal'>('bitcoin');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBitcoinPurchase = async () => {
    if (!isWalletConnected || !window.webln) {
      setError('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const invoice = await window.webln.makeInvoice({
        amount: selectedPackage.price,
        defaultMemo: `N.I.D.A.M Access: ${selectedPackage.duration} minutes`,
      });

      await window.webln.sendPayment(invoice.paymentRequest);
      onPurchaseSuccess(selectedPackage.duration * 60);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPurchase = () => {
    window.open(selectedPackage.paypalLink, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-[400px] border border-[#ff0000] bg-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#ff0000] text-lg font-mono flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Purchase Access Time
          </h2>
          <button 
            onClick={onClose}
            className="text-[#ff0000] hover:opacity-80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod('bitcoin')}
              className={`flex items-center gap-2 px-4 py-2 border border-[#ff0000] ${
                paymentMethod === 'bitcoin' ? 'bg-[#ff0000] text-black' : 'text-[#ff0000]'
              }`}
            >
              <Wallet size={16} />
              Bitcoin
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`flex items-center gap-2 px-4 py-2 border border-[#ff0000] ${
                paymentMethod === 'paypal' ? 'bg-[#ff0000] text-black' : 'text-[#ff0000]'
              }`}
            >
              <CreditCard size={16} />
              PayPal
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TIME_PACKAGES.map((pkg) => (
              <button
                key={pkg.duration}
                onClick={() => setSelectedPackage(pkg)}
                className={`p-4 border border-[#ff0000] font-mono text-sm ${
                  selectedPackage.duration === pkg.duration 
                    ? 'bg-[#ff0000] text-black' 
                    : 'text-[#ff0000]'
                }`}
              >
                <div className="text-lg mb-1">{pkg.label}</div>
                <div>
                  {paymentMethod === 'bitcoin' 
                    ? `${pkg.price} sats`
                    : `$${pkg.priceUSD.toFixed(2)}`
                  }
                </div>
              </button>
            ))}
          </div>

          {paymentMethod === 'bitcoin' ? (
            !isWalletConnected ? (
              <Button 
                onConnect={() => {}}
                className="w-full py-3 border border-[#ff0000] text-[#ff0000] font-mono hover:bg-[#ff0000]/10 flex items-center justify-center gap-2"
              >
                <Wallet size={16} />
                Connect Wallet
              </Button>
            ) : (
              <button
                onClick={handleBitcoinPurchase}
                disabled={isProcessing}
                className="w-full py-3 border border-[#ff0000] text-[#ff0000] font-mono hover:bg-[#ff0000]/10 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Purchase ${selectedPackage.duration} minutes`}
              </button>
            )
          ) : (
            <button
              onClick={handlePayPalPurchase}
              className="w-full py-3 border border-[#ff0000] text-[#ff0000] font-mono hover:bg-[#ff0000]/10"
            >
              Pay with PayPal
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 text-[#ff0000] font-mono text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}