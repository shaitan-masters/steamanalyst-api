import {
    FakeApiConfig,
    ResponseData
} from "./types";
import path from "path";
import fs from "fs";

export default class FakeApi {
    private readonly data: ResponseData
    private readonly config: FakeApiConfig;
    constructor(config: FakeApiConfig = {}) {
        // Get path to fake json file
        const pathToFakeDataFile: string = path.resolve('fakeData.json');
        this.config = config;
        // Get Fake Data from file
        this.data = FakeApi.readItemsFromFile(pathToFakeDataFile);
    }

    static readItemsFromFile = (pathToFile: string): ResponseData => {
        let data: string = fs.readFileSync(pathToFile, {encoding: "utf8"})
        return JSON.parse(data) as ResponseData;
    }

    public getItems = (): Promise<ResponseData> => {
        return new Promise<ResponseData>((res: any) => {
            const {delay: cDelay, itemsAmount: cIAmount} = this.config;
            let amount: number = this.data.length; // Amount of responded items
            let delay: number = 0; // Delay before response in seconds
            if (typeof cIAmount === 'number' && cIAmount <= this.data.length) {
                amount = cIAmount;
            }
            if (typeof cDelay === 'number' && cDelay >= 0) {
                delay = cDelay;
            }
            setTimeout(() => {
                const result = [...this.data].splice(0, amount);
                res(result)
            }, delay * 1000)
        })
    }

}
