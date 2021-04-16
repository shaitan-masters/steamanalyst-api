# Node module for [csgo.steamanalyst.com](https://csgo.steamanalyst.com/) API.
## Installation

`npm install steamanalyst-api`

## Usage
```javascript
const API = require('steamanalyst-api').API;
```
or
```javascript
import {API} from 'steamanalyst-api';
````
## Constructor options

- `options[key]`: your api key **required**
- `options[apiUrl]`: url to API. *Default: `https://api.steamanalyst.com/v2/`.*

#### Example
```javascript
import {API} from 'steamanalyst-api';

const options = {
    key: 'RTXBnMQAcLPpInDRU1'
}

const api = new API(options);
```

## Use proxy
### Proxy options

- `proxy[user]`: User name **required**
- `proxy[pass]`: User password **required**
- `proxy[host]`: Proxy hostname or ip **required**
- `proxy[port]`: Proxy host port **required**

#### Example
```javascript
import {API} from 'steamanalyst-api';

const options = {
    key: 'RTXBnMQAcLPpInDRU1',
    proxy: {
        user: 'userName',
        pass: 'qwerty123',
        host: '127.0.0.1',
        port: '8080'
    }
}

const api = new API(options);
```

## Api methods

* <b>getItems()</b> - Return Promise with items list
```javascript
api.getItems()
```
### Item data 
* **market_name** - Market Hash Name of Item
* **avg_price_7_days** - Average price for the last 7 days (as show on SteamAnalyst.com). Use this value for your CS:GO Project.
* **avg_price_7_days_raw** - Same as "avg_price_7_days" without formatting.
* **avg_price_30_days** - Average price for the last 30 days (as show on SteamAnalyst.com).
* **avg_price_30_days_raw** - Same as "avg_price_30_days" without formatting.
* **safe_price** - Returns a safe price to use if there is an ongoing price manipulation.
* **safe_price_raw** - Same as "safe_price" without formatting.
* **avg7_1yr** - Average price for 7 days exactly 1 year ago. Can be used to come up with your own solution against price manipulation.
* **avg30_1yr** - Average price for 30 days exactly 1 year ago. Can be used to come up with your own solution against price manipulation.
* **avg60_1yr** - Average price for 60 days exactly 1 year ago. Can be used to come up with your own solution against price manipulation.
* **suggested_amount_avg** - Average Price of Rare item as suggested by our community and other various sources. Use at your own risk for items such as fade, doppler, gamma doppler, etc... as they vary greatly.
* **suggested_amount_min** - Minimum Price of Rare item as suggested by our community and other various sources. This usually represents low tier patterns, fades, phases. This should be used for most projects.
* **suggested_amount_max** - Maximum Price of Rare item as suggested by our community and other various sources. This usually represents high tier patterns, fades, phases.
* **phases** - Only available for Doppler and Gamma Doppler knives. This value can be null or 0 for some items.
* **link** - Link to item's page on SteamAnalyst.com
* **current_price** - Current lowest price of item on Steam Market. Do not use this value for your CS:GO project. Use "avg_price_7_days" instead.
* **current_price_last_checked** - Date when Steam Market price was last checked
* **sold_last_24h** - Units sold on Steam Market last 24 hours (if available)
* **sold_last_7d** - Units sold on Steam Market last 7 days (if available)
* **avg_daily_volume** - Average daily volume sold on Steam Market for the last 7 days
* **img** - Image URL of item on Steam Community
* **rarity** - Rarity of an item
* **ongoing_price_manipulation** - Indicates if we have detected a price manipulation on Steam Market. Returns 0 or 1. If set to 1, "avg_price_7_days" will no longer be returned. "safe_price" should be used in your CS:GO project.
* **suspicious** - This item has an unusually high price for its wear. Consider assigning a price manually.

# FakeApi
Use Fake Api as Sandbox for getting items without connecting to the Internet. 
You can use options such as "delay" for emulated real-time delay of response 
from the server, and use "itemAmount" option for getting the number of items as you wish.

## Usage
```javascript
const FakeAPI = require('steamanalyst-api').FakeAPI;
```
or
```javascript
import {FakeAPI} from 'steamanalyst-api';
````
## FakeApi options

- `options[delay]`: Delay before response from `getItems` method in seconds

#### Example
```javascript
import {FakeAPI} from 'steamanalyst-api';

const options = {
    delay: 3
}

const fakeApi = new FakeAPI(options);
```


* <b>getItems()</b> - Return Promise with items list
```javascript
api.getItems()
```