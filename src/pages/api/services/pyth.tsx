import React from 'react';

// Define types for the price feed item and price data for clarity and type safety
type PriceFeedItem = {
  attributes: {
    base: string;
  };
  id: string;
};

type PriceData = {
  price: {
    price: number;
  };
  vaa: string;
};

export async function getTokenPriceAndVAA(blockTime: string, token: string): Promise<PriceData | null> {
  try {
    const priceFeedIdResponse = await fetch(`https://hermes.pyth.network/v2/price_feeds?query=${token}/USD&asset_type=crypto`);
    const priceFeedItems: PriceFeedItem[] = await priceFeedIdResponse.json();
    //returns:[
      //   {
      //     "id": "7f981f906d7cfe93f618804f1de89e0199ead306edc022d3230b3e8305f391b0",
      //     "attributes": {
      //         "asset_type": "Crypto",
      //         "base": "BETH",
      //         "description": "BINANCE BEACON ETH / US DOLLAR",
      //         "generic_symbol": "BETHUSD",
      //         "quote_currency": "USD",
      //         "symbol": "Crypto.BETH/USD",
      //         "weekly_schedule": "America/New_York,O,O,O,O,O,O,O"
      //     }
      // },
      // {
      //     "id": "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
      //     "attributes": {
      //         "asset_type": "Crypto",
      //         "base": "ETH",
      //         "description": "ETHEREUM / US DOLLAR",
      //         "generic_symbol": "ETHUSD",
      //         "quote_currency": "USD",
      //         "symbol": "Crypto.ETH/USD",
      //         "weekly_schedule": "America/New_York,O,O,O,O,O,O,O"
      //     }
      // }]
    const priceFeedIdItem = priceFeedItems.find(item => item.attributes.base === token);
    
    if (!priceFeedIdItem) {
      console.error('Price feed ID not found for token:', token);
      return null;
    }

    const priceFeedDataResponse = await fetch(`https://hermes.pyth.network/api/get_price_feed?id=${priceFeedIdItem.id}&publish_time=${blockTime}&binary=true`);
  //   returns:{
  //     "id": "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  //     "price": {
  //         "price": "6716036942967",
  //         "conf": "3626072967",
  //         "expo": -8,
  //         "publish_time": 1711351541
  //     },
  //     "ema_price": {
  //         "price": "6720643700000",
  //         "conf": "3357765800",
  //         "expo": -8,
  //         "publish_time": 1711351541
  //     },
  //     "vaa": "UE5BVQEAAAADuAEAAAADDQE8Y2sBjrNPICIlkUP3/wRIbSERPE9Hbe8CNL970C/oPEZe5DlHcUBRFFTiF47ZSw6cOcbmW5t7K7R55776ZmtUAAI+Fn0euMC4KzsgUahxxHjDA6e7rw1/B9QgH/mXMmF7XApZ5XyQXdCAPNVdl75JNEjxeCJd21cPrUqrOKKrCp2xAANw8goK9StQvOD7ZFRLt7YC36EvvN0BCKe5zrfKdXfaGQZj1R2bSMdUCVdpFN2h/3Gqr2QN+JjQGRUsm6n9gWasAAYQJai3of5VNXTS/5AljWjIIdQwVsfgnKu2QYNLP2jfDhHqpw52nAYpTTiN2llRsLdaQbuHwOg0MTOx57hdFws+AQeBZxziuPqos0idX6FOL+6FhNzrbGTY0nDdwEJAcRV9dndh7GrOH1WwukQQG+6994pK/UKnFG3l8TJsVpfaBXQOAQi4GAam+MhQGsqDC5Nza0H4sZOrkYR1zOqOOcfaGpfWEhKWC8Go3NBltxguQIY/aX++x38F+d9/AWAmhu90K9uzAQrShguAKJIuV9zpN4AbKE8if0OidcV803Nj1nwcWYdeKlhgiNGBN+Fdyf6sHWEWuOgyEuLaTZ8j4Nxg5zA6EF9UAQtmlVS43epiTeVh4I8UbT2S2/YxcmA3vZ+ayKnqOBGLs1tHtF7FtakIcRZpBSG65s60F3E4Y67Vet7F/NiFZj6HAAyqbvC0/B9POU7kpVM3tB6speoiCMuh6cx7glsxHshtXBjZpW6C+FgG2FLXvbualLDzyFM/X5sjnDc4mZP/uDYiAQ0I6lfWQQFGkWY03f8Uaxj40rY0K0276skUjLfDpMZqDnfW8e9nQQdl55HirS/YRXW9hr8YOIghOkzFpzEvhKxJAQ5leXFwW+pQP43NfY5YpRLpfHA+j91Lj+77ufK+E3Y5tBet7sWic03qSWrrj7NBDBlEd7KPfTBuS3SIohJQR8+0AA/8N1tstM6jgmAKUgku5+KKjpB1qhbrzYoX/C3Ub+f6VRos4VUHcD2+8rj4BgOWaGXR34VIOL3Au/ACw/u+9XXFARLphyvJQnQfvwAu8Mb0Gn/GMNLv+J+oXo4FitM6cRdaiXwKhV7v2IUVrF/EgBCIiG96bT8lWjicEwN8JkrR0TX/AGYBJvUAAAAAABrhAfrtrFhR4yubI7X5QRqMK6xKrj7U3XuBHdGnLqSqcQAAAAACx+/RAUFVV1YAAAAAAAfRR4wAACcQg4/8f6TI/M9Jk8Coogzqxxs/Ql0BAFUA5i32yLSoX+GmfbRNwS3l2zMPesZrctxliv7fD0pBW0MAAAYbsv8MdwAAAADYIXuH////+AAAAABmASb1AAAAAGYBJvQAAAYcxZSVIAAAAADII3CoCpQeF0X2Y7svDuqfjlGnA20opClj90KEzW6gBhxIptT+WeSlREvxPU9H7IHMPZ7kFbrKSyCNxUske+8y23A10xmslbu2k6EGAs9Hg1DC4h+fyxoSkP4e/BBGzWstCEL6o7zYgaz7KzWwRk8jta68fVcmUg6fB1GeQhWBjxKkv3FfVnqjNkwg0ZoggTGrL+GF4IFscfJvRED8iuta6TqUGZV+kfC7ZIdkpqpCz7wpjFHfl1xEtb6SUI9ZiHGN8Ts5xmw9SOF9tJZK"
  // }

    const priceFeedData: PriceData = await priceFeedDataResponse.json();
    
    return priceFeedData;
  } catch (error) {
    console.error('Failed to fetch token price and VAA:', error);
    return null;
  }
}

export default getTokenPriceAndVAA;