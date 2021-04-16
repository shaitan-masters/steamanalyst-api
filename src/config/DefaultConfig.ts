import { RateLimitterOpts } from './../types';

export const API_URL: string = 'https://api.steamanalyst.com/v2/';
export const LIMIT_SETTINGS: RateLimitterOpts = {
    maxRequestAmount: 5, // Max request amount
    delay: 5 // Delay in minutes before sending next 5 request
}