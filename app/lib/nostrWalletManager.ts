import { NostrWebLNProvider } from '@getalby/sdk';

class NostrWalletManager {
  private provider: NostrWebLNProvider | null = null;
  private isInitializing: boolean = false;

  private async initializeProvider(): Promise<NostrWebLNProvider | null> {
    if (this.provider) return this.provider;
    if (this.isInitializing) return null;

    try {
      this.isInitializing = true;
      
      // Create provider with specific configuration
      const nwc = NostrWebLNProvider.withNewSecret();
      
      // Initialize with required parameters
      await nwc.initNWC({ 
        name: 'N.I.D.A.M',
        relayUrl: 'wss://nostr-relay.getalby.com',
        walletPubkey: '', // Will be set by the wallet during connection
        secret: '', // Will be generated during connection
      });
      
      // Enable the provider
      await nwc.enable();
      
      // Store the provider instance
      this.provider = nwc;
      
      return nwc;
    } catch (error) {
      console.warn('NWC initialization failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to initialize wallet');
    } finally {
      this.isInitializing = false;
    }
  }

  public async sendPayment(amount: number, memo: string): Promise<{
    success: boolean;
    error?: string;
    preimage?: string;
  }> {
    try {
      const provider = await this.initializeProvider();
      if (!provider) {
        return {
          success: false,
          error: 'No wallet connection available'
        };
      }

      // Create and send invoice
      const invoice = await provider.makeInvoice({
        amount,
        defaultMemo: memo,
      });

      const response = await provider.sendPayment(invoice.paymentRequest);

      return {
        success: true,
        preimage: response.preimage
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      console.error('Payment error:', error);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  public async getInfo(): Promise<{
    connected: boolean;
    pubkey?: string;
  }> {
    try {
      const provider = await this.initializeProvider();
      if (!provider) {
        return { connected: false };
      }

      const info = await provider.getInfo();
      return {
        connected: true,
        pubkey: info.node.pubkey
      };
    } catch (error) {
      console.warn('Failed to get wallet info:', error);
      return { connected: false };
    }
  }

  public async disconnect(): Promise<void> {
    if (this.provider) {
      try {
        await this.provider.disable();
      } catch (error) {
        console.warn('Error disconnecting wallet:', error);
      }
      this.provider = null;
    }
  }
}

export const nostrWalletManager = new NostrWalletManager();