"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RateLimitter {
    constructor({ delay, maxRequestAmount }) {
        this._delay = delay;
        this._maxRequestAmount = maxRequestAmount;
        this.tail = [];
    }
    /**
     * Formatted delay in MS
     */
    get delay() {
        return this._delay * 1000;
    }
    /**
     * Clean tail for out-timed requests
     */
    cleanTail() {
        const now = Date.now();
        this.tail = this.tail.filter(v => v + this.delay < now);
    }
    /**
     * Process rate limitted action
     */
    process() {
        if (!this.canProcess) {
            return false;
        }
        this.tail.push(Date.now());
        return true;
    }
    /**
     * Can process rate limitted action
     */
    canProcess() {
        this.cleanTail();
        if (this.tail.length >= this._maxRequestAmount) {
            return false;
        }
        return true;
    }
}
exports.default = RateLimitter;
