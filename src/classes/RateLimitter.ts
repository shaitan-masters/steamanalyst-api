import { RateLimitterOpts } from "../types";

class RateLimitter {
  public readonly _maxRequestAmount: number;
  public readonly _delay: number;

  private tail: number[];
  
  constructor({ delay, maxRequestAmount }: RateLimitterOpts) {
    this._delay = delay;
    this._maxRequestAmount = maxRequestAmount;

    this.tail = [];
  }

  /**
   * Formatted delay in MS
   */
  get delay(): number {
    return this._delay * 1000;
  }

  /**
   * Clean tail for out-timed requests
   */
  public cleanTail() {
    const now = Date.now();

    this.tail = this.tail.filter(v => v + this.delay < now);
  }

  /**
   * Process rate limitted action
   */
  public process(): boolean {
    if (!this.canProcess) {
      return false;
    }

    this.tail.push(Date.now());

    return true;
  }

  /**
   * Can process rate limitted action
   */
  private canProcess(): boolean {
    this.cleanTail();

    if (this.tail.length >= this._maxRequestAmount) {
      return false;
    }

    return true;
  }
}

export default RateLimitter;