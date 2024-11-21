'use client';

import { encode } from 'gpt-tokenizer';
import { initBitcoinConnect } from '@getalby/bitcoin-connect';

export interface PaymentPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export interface TokenUsage {
  input: number;
  output: number;
}

class PaymentManager {
  private credits: number = 0;
  private creditId: string | null = null;
  private readonly STORAGE_KEY = 'nidam_credits';
  private readonly CREDIT_ID_KEY = 'nidam_credit_id';
  private readonly MAX_CONTEXT_TOKENS = 1024;
  private readonly INPUT_TOKEN_COST = 1;
  private readonly OUTPUT_TOKEN_COST = 2;
  private isInitialized: boolean = false;

  constructor() {
    this.loadCredits();
    this.loadCreditId();
  }

  private async ensureWalletInitialized() {
    if (!this.isInitialized) {
      try {
        await initBitcoinConnect();
        if (window.webln) {
          await window.webln.enable();
        }
        this.isInitialized = true;
      } catch (error) {
        console.warn('Bitcoin Connect initialization failed:', error);
        throw new Error('Failed to initialize Bitcoin wallet');
      }
    }
  }

  private generateCreditId(): string {
    return 'NIDAM-' + Math.random().toString(36).substring(2, 15);
  }

  private loadCreditId(): void {
    if (typeof window !== 'undefined') {
      this.creditId = localStorage.getItem(this.CREDIT_ID_KEY);
      if (!this.creditId) {
        this.creditId = this.generateCreditId();
        localStorage.setItem(this.CREDIT_ID_KEY, this.creditId);
      }
    }
  }

  public getCreditId(): string {
    return this.creditId || this.generateCreditId();
  }

  public async retrieveCreditsByMemo(memo: string): Promise<boolean> {
    if (!memo.startsWith('NIDAM-')) {
      return false;
    }

    this.creditId = memo;
    localStorage.setItem(this.CREDIT_ID_KEY, memo);
    return true;
  }

  public calculateTokenCost(usage: TokenUsage): number {
    return (usage.input * this.INPUT_TOKEN_COST) + 
           (usage.output * this.OUTPUT_TOKEN_COST);
  }

  public getTokenCount(text: string): number {
    return encode(text).length;
  }

  private loadCredits(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.credits = parseInt(saved, 10);
      }
    }
  }

  private saveCredits(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, this.credits.toString());
    }
  }

  public async addCredits(amount: number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureWalletInitialized();

      if (!window.webln) {
        return { 
          success: false, 
          error: 'Please install a Bitcoin wallet extension' 
        };
      }

      const invoice = await window.webln.makeInvoice({
        amount,
        defaultMemo: this.getCreditId(),
      });

      await window.webln.sendPayment(invoice.paymentRequest);
      
      this.credits += amount;
      this.saveCredits();
      
      return { success: true };
    } catch (error) {
      console.error('Payment error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment failed' 
      };
    }
  }

  public async payForQuery(input: string, expectedOutputTokens: number): Promise<{ 
    success: boolean; 
    error?: string;
    exceedsMaxContext?: boolean;
  }> {
    const inputTokens = this.getTokenCount(input);
    
    if (inputTokens > this.MAX_CONTEXT_TOKENS) {
      return {
        success: false,
        exceedsMaxContext: true,
        error: `Input exceeds maximum context length of ${this.MAX_CONTEXT_TOKENS} tokens`
      };
    }

    const cost = this.calculateTokenCost({
      input: inputTokens,
      output: expectedOutputTokens
    });

    if (this.credits >= cost) {
      this.credits -= cost;
      this.saveCredits();
      return { success: true };
    }

    return {
      success: false,
      error: 'Insufficient credits'
    };
  }

  public getCredits(): number {
    return this.credits;
  }

  public hasCredits(): boolean {
    return this.credits > 0;
  }

  public getMaxContextTokens(): number {
    return this.MAX_CONTEXT_TOKENS;
  }
}

export const paymentManager = new PaymentManager();