"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_1 = __importDefault(require("./API"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FakeAPI extends API_1.default {
    constructor(opts) {
        super(opts);
        /**
         * Loading fake data from file
         * @returns {ResponseData}
         */
        this.loadFakeData = () => {
            const data = fs_1.default.readFileSync(path_1.default.resolve('../mockup/itemList.json'));
            const itemList = JSON.parse(data.toString());
            return itemList;
        };
        /**
         * Get items from API
         * @returns {Promise<ResponseData | null>}
         */
        this.getItems = async () => {
            return new Promise(async (res, rej) => {
                // If rate limitter blocks our request
                if (!this._rateLimitter.process()) {
                    return rej(`You can call this only ${this._rateLimitter._maxRequestAmount} times in ${this._rateLimitter._delay} s`);
                }
                if (!this.cached) {
                    return rej(`Internal error while reading fake-data!`);
                }
                setTimeout(() => {
                    return res(this.cached);
                }, this.delay);
            });
        };
        this.delay = opts.delay || 1000;
        this.cached = this.loadFakeData();
    }
}
exports.default = FakeAPI;
