"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeAPI = exports.API = void 0;
const API_1 = __importDefault(require("./classes/API"));
const FakeAPI_1 = __importDefault(require("./classes/FakeAPI"));
exports.API = API_1.default;
exports.FakeAPI = FakeAPI_1.default;
