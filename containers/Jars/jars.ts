import { PriceIds } from "../Prices";

export const PICKLE_JARS = {
  psCRV: "0x68d14d66B2B0d6E157c06Dc8Fefa3D8ba0e66a89",
  prenBTCWBTC: "0x2E35392F4c36EBa7eCAFE4de34199b2373Af22ec",
  p3CRV: "0x1BB74b5DdC1f4fC91D6f9E7906cf68bc93538e33",
  pSUSHIETHDAI: "0x55282da27a3a02ffe599f6d11314d239dac89135",
  pSUSHIETHUSDC: "0x8c2d16b7f6d3f989eb4878ecf13d695a7d504e43",
  pSUSHIETHUSDT: "0xa7a37ae5cb163a3147de83f15e15d8e5f94d6bce",
  pSUSHIETHWBTC: "0xde74b6c547bd574c3527316a2ee30cd8f6041525",
  pSUSHIETHYFI: "0x3261D9408604CC8607b687980D40135aFA26FfED",
  pUNIETHDAI: "0xCffA068F1E44D98D3753966eBd58D4CFe3BB5162",
  pUNIETHUSDC: "0x53Bf2E62fA20e2b4522f05de3597890Ec1b352C6",
  pUNIETHUSDT: "0x09FC573c502037B149ba87782ACC81cF093EC6ef",
  pUNIETHWBTC: "0xc80090AA05374d336875907372EE4ee636CBC562",
  pDAI: "0x6949Bb624E8e8A90F87cD2058139fcd77D2F3F87",
};

export const JAR_DEPOSIT_TOKENS = {
  sCRV: "0xC25a3A3b969415c80451098fa907EC722572917F",
  renCRV: "0x49849C98ae39Fff122806C06791Fa73784FB3675",
  "3CRV": "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
  SUSHI_ETH_DAI: "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
  SUSHI_ETH_USDC: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
  SUSHI_ETH_USDT: "0x06da0fd433C1A5d7a4faa01111c044910A184553",
  SUSHI_ETH_WBTC: "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58",
  SUSHI_ETH_YFI: "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C",
  UNIV2_ETH_DAI: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
  UNIV2_ETH_USDC: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
  UNIV2_ETH_USDT: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
  UNIV2_ETH_WBTC: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
};

export const DEPOSIT_TOKENS_NAME = {
  sCRV: "sCRV",
  renCRV: "renBTCCRV",
  "3CRV": "3poolCRV",
  UNIV2_ETH_DAI: "UNI DAI/ETH",
  UNIV2_ETH_USDC: "UNI USDC/ETH",
  UNIV2_ETH_USDT: "UNI USDT/ETH",
  UNIV2_ETH_WBTC: "UNI WBTC/ETH",
  SUSHI_ETH_DAI: "SLP DAI/ETH",
  SUSHI_ETH_USDC: "SLP USDC/ETH",
  SUSHI_ETH_USDT: "SLP USDT/ETH",
  SUSHI_ETH_WBTC: "SLP WBTC/ETH",
  SUSHI_ETH_YFI: "SLP YFI/ETH",
  DAI: "DAI",
};

export const JAR_ACTIVE: Record<string, boolean> = {
  [DEPOSIT_TOKENS_NAME.sCRV]: true,
  [DEPOSIT_TOKENS_NAME.renCRV]: true,
  [DEPOSIT_TOKENS_NAME["3CRV"]]: true,
  [DEPOSIT_TOKENS_NAME.UNIV2_ETH_DAI]: false,
  [DEPOSIT_TOKENS_NAME.UNIV2_ETH_USDC]: false,
  [DEPOSIT_TOKENS_NAME.UNIV2_ETH_USDT]: false,
  [DEPOSIT_TOKENS_NAME.UNIV2_ETH_WBTC]: false,
  [DEPOSIT_TOKENS_NAME.SUSHI_ETH_DAI]: true,
  [DEPOSIT_TOKENS_NAME.SUSHI_ETH_USDC]: true,
  [DEPOSIT_TOKENS_NAME.SUSHI_ETH_USDT]: true,
  [DEPOSIT_TOKENS_NAME.SUSHI_ETH_WBTC]: true,
  [DEPOSIT_TOKENS_NAME.SUSHI_ETH_YFI]: true,
  [DEPOSIT_TOKENS_NAME.DAI]: false,
};

export const DEPOSIT_TOKENS_LINK = {
  sCRV: "https://www.curve.fi/susdv2/deposit",
  renCRV: "https://www.curve.fi/ren/deposit",
  "3CRV": "https://www.curve.fi/3pool/deposit",
  UNIV2_ETH_DAI:
    "https://app.uniswap.org/#/add/0x6b175474e89094c44da98b954eedeac495271d0f/ETH",
  UNIV2_ETH_USDC:
    "https://app.uniswap.org/#/add/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH",
  UNIV2_ETH_USDT:
    "https://app.uniswap.org/#/add/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7",
  UNIV2_ETH_WBTC:
    "https://app.uniswap.org/#/add/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH",
  SUSHI_ETH_DAI:
    "https://exchange.sushiswapclassic.org/#/add/0x6b175474e89094c44da98b954eedeac495271d0f/ETH",
  SUSHI_ETH_USDC:
    "https://exchange.sushiswapclassic.org/#/add/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH",
  SUSHI_ETH_USDT:
    "https://exchange.sushiswapclassic.org/#/add/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7",
  SUSHI_ETH_WBTC:
    "https://exchange.sushiswapclassic.org/#/add/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH",
  SUSHI_ETH_YFI:
    "https://exchange.sushiswapclassic.org/#/add/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/ETH",
  DAI: "https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f",
};

export const DEPOSIT_TOKENS_JAR_NAMES = {
  sCRV: "pJar 0a",
  renCRV: "pJar 0b",
  "3CRV": "pJar 0c",
  UNIV2_ETH_DAI: "pJar 0.69a",
  UNIV2_ETH_USDC: "pJar 0.69b",
  UNIV2_ETH_USDT: "pJar 0.69c",
  UNIV2_ETH_WBTC: "pJar 0.69d",
  DAI: "pJar 0.88a",
  sCRV_OLD: "pJar 0 (old)",
  UNIV2_ETH_DAI_OLD: "pJar 0.69a (old)",
  UNIV2_ETH_USDC_OLD: "pJar 0.69b (old)",
  UNIV2_ETH_USDT_OLD: "pJar 0.69c (old)",
  SUSHI_ETH_DAI: "pJar 0.99a",
  SUSHI_ETH_USDC: "pJar 0.99b",
  SUSHI_ETH_USDT: "pJar 0.99c",
  SUSHI_ETH_WBTC: "pJar 0.99d",
  SUSHI_ETH_YFI: "pJar 0.99e",
};

export const STRATEGY_NAMES = {
  DAI: {
    COMPOUNDv1: "StrategyCompoundDaiV1",
    COMPOUNDv2: "StrategyCmpdDaiV2",
  },
};

export const getPriceId = (tokenAddress: string): PriceIds => {
  const l = tokenAddress.toLowerCase();

  if (l === "0x6b175474e89094c44da98b954eedeac495271d0f") {
    return "dai";
  }

  if (l === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
    return "usdc";
  }

  if (l === "0xdac17f958d2ee523a2206206994597c13d831ec7") {
    return "usdt";
  }

  if (l === "0x57ab1ec28d129707052df4df418d58a2d46d5f51") {
    return "susd";
  }

  if (l === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
    return "eth";
  }

  if (l === "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599") {
    return "wbtc";
  }

  if (l === "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e") {
    return "yfi";
  }

  throw new Error(`Unknown token address: ${tokenAddress}`);
};
