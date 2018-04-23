# SteemPay NodeJS REST API Documentaion

## Public API Methods

### Get user info

- #### Endpoint
    `https://host.com/username`
    #### Example:
    `https://api.steempay.org/kodaxx`

- #### Response
    ```
    {
      "balance_sbd": "15.492 SBD",
      "balance_steem": "2.348 STEEM",
      "avatar": "https://avatars3.githubusercontent.com/u/6633675?v=3&s=460",
      "location": "Wyoming, USA"
    }
    ```

If a property does not exist on a user, it's key will have a value of `null`

If a user doesn't exist, you will recieve back a response of `false`

### Get user public keys

- #### Endpoint
    `https://host.com/username/pub`
    #### Example:
    `https://api.steempay.org/kodaxx/pub`

- #### Response
    ```
    {
      "active_pub": "STM5EmQF3UiwQ8tvMe5WbeWuYaVzRZSqf1RPwxdzGteJumbVWTKwG",
      "owner_pub": "STM6ApiGTJahPTK6DDxYisJ3ZRBqXdj8xN8CvAgHki571pYZTG2gu",
      "memo_pub": "STM7zufmp2UqpmUQmKHwXn5zcRjPLSW8jRpyoQCV2rPAmMkLh8r1n"
    }
    ```

This endpoint is useful for verifying that the private keys generated client-side are correct.

### Get user transfer history

- #### Endpoint
    `https://host.com/username/history`
    `https://host.com/username/history/limit`
    #### Example:
    `https://api.steempay.org/kodaxx/history/1000`

- #### Response
    ```
    [
      {
        "tx_id": "dcb389fa0acd27b8f22dc9aecd98536578033db9",
        "timestamp": "2018-04-22T18:29:54",
        "details": {
          "from": "cptnduras",
          "to": "kodaxx",
          "amount": "0.001 SBD",
          "memo": "test memo"
        }
      }
    ]
    ```
This endpoint returns an array of objects, each object being a transfer - most recent transfer is first.

The `limit` parameter is optional (default will be 30) and upper limit is 10,000.

### Get exchange rates

- #### Endpoint
    `https://host.com/rates/token`
    #### Example:
    `https://api.steempay.org/rates/steem`
    `https://api.steempay.org/rates/steem-dollar`

- #### Response
    ```
    {
      "price_usd": "3.27341"
    }
    ```
Theoretically, you can get any USD price from coinmarketcap with this endpoint, but this will be useful to calculate USD account values
