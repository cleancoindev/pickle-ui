import { useEffect, useState } from "react";

import { DEPOSIT_TOKENS_JAR_NAMES, JAR_DEPOSIT_TOKENS } from "./jars";
import { Prices } from "../Prices";
import {
  UNI_ETH_DAI_STAKING_REWARDS,
  UNI_ETH_USDC_STAKING_REWARDS,
  UNI_ETH_USDT_STAKING_REWARDS,
  UNI_ETH_WBTC_STAKING_REWARDS,
  SCRV_STAKING_REWARDS,
  Contracts,
} from "../Contracts";
import { Jar } from "./useFetchJars";
import { useCurveRawStats } from "./useCurveRawStats";
import { useCurveCrvAPY } from "./useCurveCrvAPY";
import { useCurveSNXAPY } from "./useCurveSNXAPY";
import { useUniPairDayData } from "./useUniPairDayData";
import { useSushiPairDayData } from "./useSushiPairDayData";
import { formatEther } from "ethers/lib/utils";
import { UniV2Pairs } from "../UniV2Pairs";
import { useCompAPY } from "./useCompAPY";
import erc20 from "@studydefi/money-legos/erc20";

import compound from "@studydefi/money-legos/compound";

import { Contract as MulticallContract } from "ethers-multicall";
import { Connection } from "../Connection";
import { SushiPairs } from "../SushiPairs";

const AVERAGE_BLOCK_TIME = 13.22;

interface SushiPoolId {
  [key: string]: number;
}

const sushiPoolIds: SushiPoolId = {
  "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f": 2,
  "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0": 1,
  "0x06da0fd433C1A5d7a4faa01111c044910A184553": 0,
  "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58": 21,
  "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C": 11,
};

export interface JarApy {
  [k: string]: number;
}

export interface JarWithAPY extends Jar {
  totalAPY: number;
  APYs: Array<JarApy>;
}

type Input = Array<Jar> | null;
type Output = {
  jarsWithAPY: Array<JarWithAPY> | null;
};

export const useJarWithAPY = (jars: Input): Output => {
  const { multicallProvider } = Connection.useContainer();
  const { controller, strategy } = Contracts.useContainer();
  const { prices } = Prices.useContainer();
  const { getPairData: getSushiPairData } = SushiPairs.useContainer();
  const { getPairData: getUniPairData } = UniV2Pairs.useContainer();
  const {
    stakingRewards,
    susdPool,
    susdGauge,
    renGauge,
    renPool,
    threeGauge,
    threePool,
    sushiChef,
  } = Contracts.useContainer();
  const { getUniPairDayAPY } = useUniPairDayData();
  const { getSushiPairDayAPY } = useSushiPairDayData();
  const { rawStats: curveRawStats } = useCurveRawStats();
  const { APYs: susdCrvAPY } = useCurveCrvAPY(
    jars,
    prices?.usdc || null,
    susdGauge,
    susdPool,
  );
  const { APYs: threePoolCrvAPY } = useCurveCrvAPY(
    jars,
    prices?.usdc || null,
    threeGauge,
    threePool,
  );
  const { APYs: ren2CrvAPY } = useCurveCrvAPY(
    jars,
    prices?.wbtc || null,
    renGauge,
    renPool,
  );
  const { APYs: susdSNXAPY } = useCurveSNXAPY(
    jars,
    susdPool,
    stakingRewards ? stakingRewards.attach(SCRV_STAKING_REWARDS) : null,
  );

  const { APYs: compDaiAPYs } = useCompAPY(compound.cDAI.address);

  const [jarsWithAPY, setJarsWithAPY] = useState<Array<JarWithAPY> | null>(
    null,
  );

  const calculateUNIAPY = async (rewardsAddress: string) => {
    if (stakingRewards && prices?.uni && getUniPairData && multicallProvider) {
      const multicallUniStakingRewards = new MulticallContract(
        rewardsAddress,
        stakingRewards.interface.fragments,
      );

      const [
        rewardsDurationBN,
        uniRewardsForDurationBN,
        stakingToken,
        totalSupplyBN,
      ] = await multicallProvider.all([
        multicallUniStakingRewards.rewardsDuration(),
        multicallUniStakingRewards.getRewardForDuration(),
        multicallUniStakingRewards.stakingToken(),
        multicallUniStakingRewards.totalSupply(),
      ]);

      const totalSupply = parseFloat(formatEther(totalSupplyBN));
      const rewardsDuration = rewardsDurationBN.toNumber(); //epoch
      const uniRewardsForDuration = parseFloat(
        formatEther(uniRewardsForDurationBN),
      );

      const { pricePerToken } = await getUniPairData(stakingToken);

      const uniRewardsPerYear =
        uniRewardsForDuration * ((360 * 24 * 60 * 60) / rewardsDuration);
      const valueRewardedPerYear = prices.uni * uniRewardsPerYear;

      const totalValueStaked = totalSupply * pricePerToken;
      const uniAPY = valueRewardedPerYear / totalValueStaked;

      // no more UNI being distributed
      return [{ uni: 0 * 100 * 0.725 }];
    }

    return [];
  };

  const calculateSushiAPY = async (lpTokenAddress: string) => {
    if (sushiChef && prices?.sushi && getSushiPairData && multicallProvider) {
      const poolId = sushiPoolIds[lpTokenAddress];
      const multicallSushiChef = new MulticallContract(
        sushiChef.address,
        sushiChef.interface.fragments,
      );
      const lpToken = new MulticallContract(lpTokenAddress, erc20.abi);

      const [
        sushiPerBlockBN,
        totalAllocPointBN,
        poolInfo,
        totalSupplyBN,
      ] = await multicallProvider.all([
        multicallSushiChef.sushiPerBlock(),
        multicallSushiChef.totalAllocPoint(),
        multicallSushiChef.poolInfo(poolId),
        lpToken.balanceOf(sushiChef.address),
      ]);

      const totalSupply = parseFloat(formatEther(totalSupplyBN));
      const sushiRewardsPerBlock =
        (parseFloat(formatEther(sushiPerBlockBN)) *
          0.9 *
          poolInfo.allocPoint.toNumber()) /
        totalAllocPointBN.toNumber();

      const { pricePerToken } = await getSushiPairData(lpTokenAddress);

      const sushiRewardsPerYear =
        sushiRewardsPerBlock * ((360 * 24 * 60 * 60) / AVERAGE_BLOCK_TIME);
      const valueRewardedPerYear = prices.sushi * sushiRewardsPerYear;

      const totalValueStaked = totalSupply * pricePerToken;
      const sushiAPY = valueRewardedPerYear / totalValueStaked;

      // no more UNI being distributed
      return [{ sushi: sushiAPY * 100 * 0.8 }];
    }

    return [];
  };

  const calculateAPY = async () => {
    if (jars && controller && strategy) {
      const [
        uniEthDaiApy,
        uniEthUsdcApy,
        uniEthUsdtApy,
        uniEthWBtcApy,
        sushiEthDaiApy,
        sushiEthUsdcApy,
        sushiEthUsdtApy,
        sushiEthWBtcApy,
        sushiEthYfiApy,
      ] = await Promise.all([
        calculateUNIAPY(UNI_ETH_DAI_STAKING_REWARDS),
        calculateUNIAPY(UNI_ETH_USDC_STAKING_REWARDS),
        calculateUNIAPY(UNI_ETH_USDT_STAKING_REWARDS),
        calculateUNIAPY(UNI_ETH_WBTC_STAKING_REWARDS),
        calculateSushiAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_DAI),
        calculateSushiAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_USDC),
        calculateSushiAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_USDT),
        calculateSushiAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_WBTC),
        calculateSushiAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_YFI),
      ]);

      const promises = jars.map(async (jar) => {
        let APYs: Array<JarApy> = [];

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.sCRV) {
          APYs = [
            { lp: curveRawStats?.ren2 || 0 },
            ...susdCrvAPY,
            ...susdSNXAPY,
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.renCRV) {
          APYs = [{ lp: curveRawStats?.susd || 0 }, ...ren2CrvAPY];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES["3CRV"]) {
          APYs = [
            { lp: curveRawStats ? curveRawStats["3pool"] : 0 },
            ...threePoolCrvAPY,
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.UNIV2_ETH_DAI) {
          APYs = [
            ...uniEthDaiApy,
            ...getUniPairDayAPY(JAR_DEPOSIT_TOKENS.UNIV2_ETH_DAI),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.UNIV2_ETH_USDC) {
          APYs = [
            ...uniEthUsdcApy,
            ...getUniPairDayAPY(JAR_DEPOSIT_TOKENS.UNIV2_ETH_USDC),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.UNIV2_ETH_USDT) {
          APYs = [
            ...uniEthUsdtApy,
            ...getUniPairDayAPY(JAR_DEPOSIT_TOKENS.UNIV2_ETH_USDT),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.UNIV2_ETH_WBTC) {
          APYs = [
            ...uniEthWBtcApy,
            ...getUniPairDayAPY(JAR_DEPOSIT_TOKENS.UNIV2_ETH_WBTC),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.SUSHI_ETH_DAI) {
          APYs = [
            ...sushiEthDaiApy,
            ...getSushiPairDayAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_DAI),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.SUSHI_ETH_USDC) {
          APYs = [
            ...sushiEthUsdcApy,
            ...getSushiPairDayAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_USDC),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.SUSHI_ETH_USDT) {
          APYs = [
            ...sushiEthUsdtApy,
            ...getSushiPairDayAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_USDT),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.SUSHI_ETH_WBTC) {
          APYs = [
            ...sushiEthWBtcApy,
            ...getSushiPairDayAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_WBTC),
          ];
        }

        if (jar.jarName === DEPOSIT_TOKENS_JAR_NAMES.SUSHI_ETH_YFI) {
          APYs = [
            ...sushiEthYfiApy,
            ...getSushiPairDayAPY(JAR_DEPOSIT_TOKENS.SUSHI_ETH_YFI),
          ];
        }

        // if (jar.strategyName === STRATEGY_NAMES.DAI.COMPOUNDv2) {
        //   const leverageBN = await jar.strategy.callStatic.getCurrentLeverage();
        //   const leverage = parseFloat(formatEther(leverageBN));

        //   const compDaiAPYsWithLeverage = compDaiAPYs.map((x) => {
        //     const key = Object.keys(x)[0];
        //     return {
        //       [key]: x[key] * leverage,
        //     };
        //   });

        //   APYs = [...compDaiAPYsWithLeverage];
        // }

        const totalAPY = APYs.map((x) => {
          return Object.values(x).reduce((acc, y) => acc + y, 0);
        }).reduce((acc, x) => acc + x, 0);

        return {
          ...jar,
          APYs,
          totalAPY,
        };
      });

      const newJarsWithAPY = await Promise.all(promises);

      setJarsWithAPY(newJarsWithAPY);
    }
  };

  useEffect(() => {
    calculateAPY();
  }, [jars, prices]);

  return { jarsWithAPY };
};
