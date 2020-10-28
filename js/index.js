"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeApi = exports.API = void 0;
const Api_1 = __importDefault(require("./Api"));
const FakeApi_1 = __importDefault(require("./FakeApi"));
exports.API = Api_1.default;
exports.FakeApi = FakeApi_1.default;
