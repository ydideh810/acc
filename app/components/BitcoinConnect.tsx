'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@getalby/bitcoin-connect-react';

interface BitcoinConnectProps {
  onConnect: () => void;
}

export function BitcoinConnect({ onConnect }: BitcoinConnectProps) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.webln) {
        try {
          await window.webln.enable();
          setIsConnected(true);
          onConnect();
        } catch (error) {
          console.warn('Wallet connection failed:', error);
        }
      }
    };

    checkConnection();
  }, [onConnect]);

  const handleConnect = () => {
    setIsConnected(true);
    onConnect();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {!isConnected ? (
        <Button 
          onConnect={handleConnect}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ff0000',
            color: '#ff0000',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Wallet size={16} />
          Connect Wallet
        </Button>
      ) : (
        <div className="text-[#ff0000] flex items-center gap-2">
          <Wallet size={16} />
          Connected
        </div>
      )}
      <div className="text-[#ff0000]/70 text-xs">
        573 sats per command
      </div>
    </div>
  );
}