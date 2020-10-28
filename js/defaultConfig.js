"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestDelimiterOptions = exports.API_URL = void 0;
exports.API_URL = 'https://api.steamanalyst.com/v2/';
exports.RequestDelimiterOptions = {
    maxRequestAmount: 5,
    delay: 5 // Delay in minutes before sending next 5 request
};
