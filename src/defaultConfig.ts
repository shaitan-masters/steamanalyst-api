import {RequestDelimiterOptionsModel} from "./types";

export const API_URL: string = 'https://api.steamanalyst.com/v2/';
export const RequestDelimiterOptions: RequestDelimiterOptionsModel = {
    maxRequestAmount: 5, // Max request amount
    delay: 5 // Delay in minutes before sending next 5 request
}