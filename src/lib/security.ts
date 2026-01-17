/**
 * Simple Token Bucket Rate Limiter for Client-Side Protection
 * (Note: Real protection must happen on the server/edge, but this prevents accidental spam)
 */
export class RateLimiter {
    private tokens: number;
    private lastRefill: number;
    private readonly maxTokens: number;
    private readonly refillRate: number; // tokens per millisecond
  
    constructor(maxTokens: number, refillIntervalMs: number) {
      this.maxTokens = maxTokens;
      this.tokens = maxTokens;
      this.lastRefill = Date.now();
      this.refillRate = maxTokens / refillIntervalMs;
    }
  
    tryConsume(cost: number = 1): boolean {
      this.refill();
      if (this.tokens >= cost) {
        this.tokens -= cost;
        return true;
      }
      return false;
    }
  
    private refill() {
      const now = Date.now();
      const elapsed = now - this.lastRefill;
      const newTokens = elapsed * this.refillRate;
      
      if (newTokens > 0) {
        this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
        this.lastRefill = now;
      }
    }
  }
  
  // Singleton instance: 5 requests per 10 seconds
  export const chatRateLimiter = new RateLimiter(5, 10000);
