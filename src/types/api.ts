export interface Phase {
    min: number,
    max: number,
    avg: number,
}

export interface ItemModel {
    market_name: string,
    avg_price_7_days: string,
    avg_price_7_days_raw: number,
    avg_price_30_days: string,
    avg_price_30_days_raw: number,
    avg_price_60_days: string,
    avg_price_60_days_raw: number,
    link: string,
    current_price: string,
    current_price_last_checked: string,
    sold_last_24h: number,
    sold_last_7d: string,
    avg_daily_volume: string,
    img: string,
    rarity: string,
    ongoing_price_manipulation: string,
    avg7_1yr: number,
    avg30_1yr: number,
    avg60_1yr: number,
    phases?: {[key: string]: Phase} | 0 | null
}

export type ResponseData = Array<ItemModel>;