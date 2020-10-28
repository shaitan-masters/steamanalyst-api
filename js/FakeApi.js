"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FakeApi {
    constructor(config = {}) {
        this.getItems = () => {
            return new Promise((res) => {
                const { delay: cDelay, itemsAmount: cIAmount } = this.config;
                let amount = this.data.length; // Amount of responded items
                let delay = 0; // Delay before response in seconds
                if (typeof cIAmount === 'number' && cIAmount <= this.data.length) {
                    amount = cIAmount;
                }
                if (typeof cDelay === 'number' && cDelay >= 0) {
                    delay = cDelay;
                }
                setTimeout(() => {
                    const result = [...this.data].splice(0, amount);
                    res(result);
                }, delay * 1000);
            });
        };
        // Get path to fake json file
        const pathToFakeDataFile = path_1.default.resolve('fakeData.json');
        this.config = config;
        // Get Fake Data from file
        this.data = FakeApi.readItemsFromFile(pathToFakeDataFile);
    }
}
exports.default = FakeApi;
FakeApi.readItemsFromFile = (pathToFile) => {
    let data = fs_1.default.readFileSync(pathToFile, { encoding: "utf8" });
    return JSON.parse(data);
};
