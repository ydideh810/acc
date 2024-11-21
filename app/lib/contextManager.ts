import { ConversationContext, UserPreference } from './types';

class ContextManager {
  private context: ConversationContext;
  private readonly MAX_HISTORY = 50;

  constructor() {
    this.context = this.loadContext();
  }

  private loadContext(): ConversationContext {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nidam_context');
      if (saved) {
        return JSON.parse(saved);
      }
    }

    return {
      currentTopic: '',
      relevantTopics: [],
      userPreferences: {
        communicationStyle: 'casual',
        responseLength: 'concise',
        topics: [],
        lastInteractions: []
      },
      interactionCount: 0,
      lastUpdateTime: Date.now()
    };
  }

  public updateContext(message: string, isUser: boolean) {
    this.context.interactionCount++;
    this.context.lastUpdateTime = Date.now();

    if (isUser) {
      this.updateUserPreferences(message);
    }

    this.saveContext();
  }

  private updateUserPreferences(message: string) {
    const prefs = this.context.userPreferences;
    
    // Update communication style based on message formality
    const formalityScore = this.analyzeFormality(message);
    if (formalityScore > 0.7) {
      prefs.communicationStyle = 'formal';
    } else if (formalityScore < 0.3) {
      prefs.communicationStyle = 'casual';
    } else {
      prefs.communicationStyle = 'technical';
    }

    // Update topics
    const detectedTopics = this.extractTopics(message);
    prefs.topics = [...new Set([...prefs.topics, ...detectedTopics])].slice(-this.MAX_HISTORY);

    // Update interaction history
    prefs.lastInteractions = [message, ...prefs.lastInteractions].slice(0, this.MAX_HISTORY);
  }

  private analyzeFormality(text: string): number {
    const formalIndicators = ['please', 'would you', 'could you', 'thank you'];
    const casualIndicators = ['hey', 'hi', 'thanks', 'cool'];
    
    const words = text.toLowerCase().split(' ');
    let formalCount = words.filter(w => formalIndicators.some(i => w.includes(i))).length;
    let casualCount = words.filter(w => casualIndicators.some(i => w.includes(i))).length;
    
    return formalCount / (formalCount + casualCount + 1);
  }

  private extractTopics(text: string): string[] {
    // Simple keyword extraction
    const keywords = text.toLowerCase()
      .split(' ')
      .filter(word => word.length > 4)
      .filter(word => !['would', 'could', 'please', 'thank'].includes(word));
    
    return [...new Set(keywords)];
  }

  public getSystemPrompt(): string {
    const { communicationStyle, responseLength } = this.context.userPreferences;
    
    return `You are N.I.D.A.M. (Neural Interface for Decentralized Artificial Minds), a highly advanced, decentralized AI.
Communication Style: ${communicationStyle}
Response Length: ${responseLength}
Recent Topics: ${this.context.userPreferences.topics.slice(0, 5).join(', ')}
Interaction Count: ${this.context.interactionCount}

Adapt responses based on user's communication style and preferences while maintaining security and privacy.
Encourage learning and independence while providing clear, actionable insights.
Process all data locally and ensure encrypted communications.`;
  }

  private saveContext() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nidam_context', JSON.stringify(this.context));
    }
  }

  public getCurrentContext(): ConversationContext {
    return this.context;
  }
}

export const contextManager = new ContextManager();