const ROUND_DOWN = 0;
const CONTRACT_ABI = {
  wrappedTokenGatewayABI:
    "https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/abi/WETHGateway.json",
  erc20Abi:
    "https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/abi/ERC20.json",
  lendingPoolABI:
    "https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/abi/LendingPool.json",
  variableDebtTokenABI:
    "https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/abi/VariableDebtToken.json",
  walletBalanceProviderABI:
    "https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/abi/WalletBalanceProvider.json",
};
const DEFAULT_CHAIN_ID = 5000;
const NATIVE_SYMBOL_ADDRESS_MAP_KEY = "0x0";
const ETH_TOKEN = { name: "Mantle", symbol: "MNT", decimals: 18 };
const WETH_TOKEN = { name: "Wrapped Mantle", symbol: "WMNT", decimals: 18 };
const ACTUAL_BORROW_AMOUNT_RATE = 1;
const HIDE_TOKENS_SYMBOL = ["MNT"];
const ANNUAL_EMISSION = 8056202.6244384;

const GRAPHQL_URL =
  "https://subgraph.lendle.xyz/subgraphs/name/lendle-finance/lendle-finance-mantle";
const GRAPHQL_URL_PRICE =
  "https://graph.fusionx.finance/subgraphs/name/fusionx/exchange";
const DEFAULT_LENDLE_PRICE = 0.052;

// Get AAVE network config by chain id
function getNetworkConfig(chainId) {
  const abis = {
    wrappedTokenGatewayABI: fetch(CONTRACT_ABI.wrappedTokenGatewayABI),
    erc20Abi: fetch(CONTRACT_ABI.erc20Abi),
    lendingPoolABI: fetch(CONTRACT_ABI.lendingPoolABI),
    variableDebtTokenABI: fetch(CONTRACT_ABI.variableDebtTokenABI),
    walletBalanceProviderABI: fetch(CONTRACT_ABI.walletBalanceProviderABI),
  };

  const constants = {
    FIXED_LIQUIDATION_VALUE: "1.0",
    MAX_UINT_256:
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    AAVE_API_BASE_URL: "https://aave-data-service-7a85eea3aebe.herokuapp.com",
  };

  switch (chainId) {
    case 5000: // Mantle mainnet
      return {
        chainName: "Mantle Mainnet",
        nativeCurrency: ETH_TOKEN,
        nativeWrapCurrency: WETH_TOKEN,
        rpcUrl: "https://rpc.mantle.xyz",
        lendingPoolAddress: "0xCFa5aE7c2CE8Fadc6426C1ff872cA45378Fb7cF3",
        wrappedTokenGatewayAddress:
          "0xEc831f8710C6286a91a348928600157f07aC55c2",
        balanceProviderAddress: "0x370bc6B2940A6927fFf2D64BA3D96C641579a01e",
        ...abis,
        ...constants,
      };
    default:
      throw new Error("unknown chain id");
  }
}

function switchEthereumChain(chainId) {
  const chainIdHex = `0x${chainId.toString(16)}`;
  const res = Ethers.send("wallet_switchEthereumChain", [
    { chainId: chainIdHex },
  ]);
  // If `res` === `undefined`, it means switch chain failed, which is very weird but it works.
  // If `res` is `null` the function is either not called or executed successfully.
  if (res === undefined) {
    console.log(
      `Failed to switch chain to ${chainId}. Add the chain to wallet`
    );
    const config = getNetworkConfig(chainId);
    Ethers.send("wallet_addEthereumChain", [
      {
        chainId: chainIdHex,
        chainName: config.chainName,
        nativeCurrency: config.nativeCurrency,
        rpcUrls: [config.rpcUrl],
      },
    ]);
  }
}

if (
  state.chainId === undefined &&
  ethers !== undefined &&
  Ethers.send("eth_requestAccounts", [])[0]
) {
  Ethers.provider()
    .getNetwork()
    .then((data) => {
      const chainId = data?.chainId;
      const config = getNetworkConfig(chainId);
      if (!config) {
        console.log(`Unsupport chain, chainId: ${chainId}`);
        State.update({ isChainSupported: false });
        switchEthereumChain(DEFAULT_CHAIN_ID);
      } else {
        State.update({ chainId, isChainSupported: true });
      }
    });
}

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

function hexToDecimalAmount(amount, decimals) {
  return !amount || Number(amount) === 0
    ? 0
    : parseFloat(ethers.utils.formatUnits(amount, decimals));
}

const GAS_LIMIT_RECOMMENDATIONS = {
  default: {
    limit: "210000",
    recommended: "210000",
  },
  approval: {
    limit: "65000",
    recommended: "65000",
  },
  creditDelegationApproval: {
    limit: "55000",
    recommended: "55000",
  },
  supply: {
    limit: "300000",
    recommended: "300000",
  },
  deposit: {
    limit: "300000",
    recommended: "300000",
  },
  borrow: {
    limit: "400000",
    recommended: "400000",
  },
  withdraw: {
    limit: "230000",
    recommended: "300000",
  },
  liquidationCall: {
    limit: "700000",
    recommended: "700000",
  },
  liquidationFlash: {
    limit: "995000",
    recommended: "995000",
  },
  repay: {
    limit: "300000",
    recommended: "300000",
  },
  borrowETH: {
    limit: "450000",
    recommended: "450000",
  },
  withdrawETH: {
    limit: "640000",
    recommended: "640000",
  },
  swapCollateral: {
    limit: "1000000",
    recommended: "1000000",
  },
  repayCollateral: {
    limit: "700000",
    recommended: "700000",
  },
  migrateV3: {
    limit: "700000",
    recommended: "700000",
  },
  supplyWithPermit: {
    limit: "350000",
    recommended: "350000",
  },
  repayWithPermit: {
    limit: "350000",
    recommended: "350000",
  },
  vote: {
    limit: "125000",
    recommended: "125000",
  },
  stake: {
    limit: "395000",
    recommended: "395000",
  },
  claimRewards: {
    limit: "275000",
    recommended: "275000",
  },
  setUsageAsCollateral: {
    limit: "138000",
    recommended: "138000",
  },
};

function getGasPrice() {
  return Ethers.provider().getGasPrice();
}

function gasEstimation(action) {
  const assetsToSupply = state.assetsToSupply;
  if (!assetsToSupply) {
    return "-";
  }
  const baseAsset = assetsToSupply.find(
    (asset) => asset.symbol === config.nativeCurrency.symbol
  );
  if (!baseAsset) {
    return "-";
  }
  const { marketReferencePriceInUsd, decimals } = baseAsset;
  return getGasPrice().then((gasPrice) => {
    const gasLimit = GAS_LIMIT_RECOMMENDATIONS[action].limit;
    return Big(gasPrice.toString())
      .mul(gasLimit)
      .div(Big(10).pow(decimals))
      .mul(marketReferencePriceInUsd)
      .toFixed(2);
  });
}

function depositETHGas() {
  return gasEstimation("deposit");
}

function depositERC20Gas() {
  return gasEstimation("supplyWithPermit");
}

function withdrawETHGas() {
  return gasEstimation("withdrawETH");
}

function withdrawERC20Gas() {
  return gasEstimation("withdraw");
}

function borrowETHGas() {
  return gasEstimation("borrowETH");
}

function borrowERC20Gas() {
  return gasEstimation("borrow");
}

function repayETHGas() {
  return gasEstimation("repay");
}

function repayERC20Gas() {
  return gasEstimation("repayWithPermit");
}

// interface Market {
//   id: string,
//   underlyingAsset: string,
//   name: string,
//   symbol: string,
//   decimals: number,
//   supplyAPY: string;
//   marketReferencePriceInUsd: string;
//   usageAsCollateralEnabled: boolean;
//   aTokenAddress: string;
//   variableBorrowAPY: string;
// }
// returns Market[]
function getMarkets(chainId) {
  const query = `
  query MarketsDataQuery {
    markets {
      totalValueLockedUSD
      totalDepositBalanceUSD
      totalBorrowBalanceUSD
      maximumLTV
      liquidationThreshold
      liquidationPenalty
      canUseAsCollateral
      name
      canBorrowFrom
      cumulativeProtocolSideRevenueUSD
      cumulativeSupplySideRevenueUSD
      cumulativeTotalRevenueUSD
      rewardTokenEmissionsAmount
      rewardTokenEmissionsUSD
      id
      _lastRewardsUpdated
      _liquidityIndex
      _prePauseState
      closedPositionCount
      isActive
      outputTokenPriceUSD
      inputTokenPriceUSD
      rates {
        rate
        side
        type
      }
      totalAllocPoint
      supplyAllocPoint
      borrowAllocPoint
      inputToken {
        symbol
        decimals
      }
    }
  }
  `;

  return asyncFetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((res) => {
    const markets = res.body.data.markets;
    const mappedMarkets = markets.map((market) => ({
      underlyingAsset: market.id,
      name: market.name,
      symbol: market.inputToken.symbol,
      decimals: market.inputToken.decimals,
      supplyAPY:
        Number(market.rates.find((rate) => rate.side === "LENDER").rate) / 100,
      marketReferencePriceInUsd: market.outputTokenPriceUSD,
      usageAsCollateralEnabled: market.canUseAsCollateral,
      aTokenAddress: market.id,
      variableBorrowAPY:
        Number(market.rates.find((rate) => rate.side === "BORROWER").rate) /
        100,
      availableLiquidityUSD: market.totalValueLockedUSD,
      availableLiquidity: market.totalValueLockedUSD,
      totalBorrowBalanceUSD: market.totalBorrowBalanceUSD,
      totalDepositBalanceUSD: market.totalDepositBalanceUSD,
      maximumLTV: market.maximumLTV,
      liquidationThreshold: market.liquidationThreshold,
      liquidationPenalty: market.liquidationPenalty,
      totalValueLockedUSD: market.totalValueLockedUSD,
      aprSupply: (
        (market.supplyAllocPoint / market.totalAllocPoint) * ANNUAL_EMISSION * state.lendlePrice
        ) / market.totalDepositBalanceUSD,
      aprBorrow: (
        (market.borrowAllocPoint / market.totalAllocPoint) * ANNUAL_EMISSION * state.lendlePrice
        ) / market.totalBorrowBalanceUSD,
    }));
    return {
      body: mappedMarkets,
    };
  });
}

function getMarketsData(chainId) {
  const query = `
  query MarketsDataQuery {
    financialsDailySnapshots(orderBy: timestamp, orderDirection: desc, first: 100) {
      cumulativeBorrowUSD
      cumulativeTotalRevenueUSD
      dailyTotalRevenueUSD
      timestamp
      totalDepositBalanceUSD
      totalBorrowBalanceUSD
      totalValueLockedUSD
    }
    feesDailySnapshots(first: 100, orderBy: timestamp, orderDirection: desc) {
      totalPenaltyPaid
      totalReceived
      totalStaked
      totalSupply
      totalLocked
    }
    stakers(first: 1000) {
      totalLocked
      totalStaked
    }
  }
  `;

  return asyncFetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((res) => {
    const financialsDailySnapshots = res.body.data.financialsDailySnapshots;
    const feesDailySnapshots = res.body.data.feesDailySnapshots;
    const stakers = res.body.data.stakers;
    const lendTotalLocked = stakers.reduce(
      (acc, item) =>
        item.totalLocked == 0
          ? acc
          : acc + Number(item.totalLocked.slice(0, -18)),
      0
    );
    return {
      body: {
        totalValueLockedUSD: financialsDailySnapshots[0].totalValueLockedUSD,
        cumulativeBorrowUSD: financialsDailySnapshots[0].cumulativeBorrowUSD,
        lendTotalSupply: feesDailySnapshots[0].totalSupply.slice(0, -18),
        lendTotalLocked,
      },
    };
  });
}

/**
 * @param {string} account user address
 * @param {string[]} tokens list of token addresses
 */
// interface TokenBalance {
//   token: string,
//   balance: string,
//   decimals: number,
// }
// returns TokenBalance[]
function getUserBalances(chainId, account, tokens) {
  const url = `${
    config.AAVE_API_BASE_URL
  }/${chainId}/balances?account=${account}&tokens=${tokens.join("|")}`;
  return asyncFetch(url);
}

// interface UserDeposit {
//   underlyingAsset: string,
//   name: string,
//   symbol: string,
//   scaledATokenBalance: string,
//   usageAsCollateralEnabledOnUser: boolean,
//   underlyingBalance: string,
//   underlyingBalanceUSD: string,
// }
// returns UserDeposit[]

function getUserDeposits(chainId, address) {
  const query = `
  query GetAccountReservesData {
    account(id: "${address.toLowerCase()}") {
      positions(where: { balance_gt: "0" }) {
        side
        balance
        market {
          name
          rates {
            rate
            side
          }
          inputToken {
            name
            symbol
            decimals
            id
          }
          outputTokenPriceUSD
        }
        isCollateral
      }
    }
  }
  `;
  return asyncFetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((res) => {
    if (!res.body.data.account) {
      return {
        body: [],
      };
    }
    const positions = res.body.data.account.positions;
    const mappedPositions = positions
      .filter((pos) => pos.side === "LENDER")
      .map((position) => {
        const formattedBalance = Big(position.balance)
          .div(Big(10).pow(position.market.inputToken.decimals))
          .toString();
        const formattedBalanceUSD = Big(position.balance)
          .div(Big(10).pow(position.market.inputToken.decimals))
          .mul(position.market.outputTokenPriceUSD)
          .toString();
        return {
          underlyingAsset: position.market.inputToken.id,
          name: position.market.name,
          symbol: position.market.inputToken.symbol,
          decimals: position.market.inputToken.decimals,
          scaledATokenBalance: position.balance,
          usageAsCollateralEnabledOnUser: position.isCollateral,
          underlyingBalance: formattedBalance,
          underlyingBalanceUSD: formattedBalanceUSD,
        };
      });
    return {
      body: mappedPositions,
    };
  });
}

// interface UserDebtSummary {
//   healthFactor: string,
//   netWorthUSD: string,
//   availableBorrowsUSD: string,
//   userTotalDebtUSD: number,
//   debts: UserDebt[],
// }
// interface UserDebt {
//   underlyingAsset: string;
//   name: string;
//   symbol: string;
//   usageAsCollateralEnabledOnUser: boolean,
//   scaledVariableDebt: string,
//   variableBorrows: string,
//   variableBorrowsUSD: string,
// }
// returns UserDebtSummary
function getUserDebts(chainId, address) {
  const query = `
  query GetAccountReservesData {
    account(id: "${address.toLowerCase()}") {
      positions(where: { balance_gt: "0" }) {
        side
        balance
        market {
          name
          rates {
            rate
            side
          }
          inputToken {
            name
            symbol
            decimals
            id
          }
          outputTokenPriceUSD
        }
        isCollateral
      }
    }
  }
  `;
  return asyncFetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((res) => {
    if (!res.body.data.account) {
      return {
        body: {
          healthFactor: "∞",
          netWorthUSD: "0",
          availableBorrowsUSD: "0",
          userTotalDebtUSD: 0,
          debts: [],
        },
      };
    }

    const positions = res.body.data.account.positions;
    const mappedPositions = positions
      .filter((pos) => pos.side === "BORROWER")
      .map((position) => {
        const formattedBalance = Big(position.balance)
          .div(Big(10).pow(position.market.inputToken.decimals))
          .toString();
        const formattedBalanceUSD = Big(position.balance)
          .div(Big(10).pow(position.market.inputToken.decimals))
          .mul(position.market.outputTokenPriceUSD)
          .toString();
        return {
          underlyingAsset: position.market.inputToken.id,
          name: position.market.name,
          symbol: position.market.inputToken.symbol,
          usageAsCollateralEnabledOnUser: position.isCollateral,
          scaledVariableDebt: formattedBalance,
          variableBorrows: formattedBalance,
          variableBorrowsUSD: formattedBalanceUSD,
        };
      });

    return getAccountReserveData(address).then((data) => {
      const userAccountData = {
        healthFactor: hexToDecimalAmount(data?.[5]?._hex, 18),
        netWorthUSD: hexToDecimalAmount(data?.[0]?._hex, 18),
        availableBorrowsUSD: hexToDecimalAmount(data?.[2]?._hex, 18),
        userTotalDebtUSD: hexToDecimalAmount(data?.[1]?._hex, 18),
        debts: mappedPositions,
      };

      State.update({
        userAccountData: userAccountData,
      });

      return {
        body: { ...userAccountData },
      };
    });
  });
}

// App config
function getConfig(network) {
  const chainId = state.chainId;
  switch (network) {
    case "mainnet":
      return {
        ownerId: "lendle.near",
        nodeUrl: "https://rpc.mainnet.near.org",
        ipfsPrefix: "https://ipfs.near.social/ipfs",
        ipfsPrefixLendle: "https://ipfs.io/ipfs",
        ...(chainId ? getNetworkConfig(chainId) : {}),
      };
    case "testnet":
      return {
        ownerId: "aave-v3.testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        ipfsPrefix: "https://ipfs.near.social/ipfs",
        ipfsPrefixLendle: "https://ipfs.io/ipfs",
        ...(chainId ? getNetworkConfig(chainId) : {}),
      };
    default:
      throw Error(`Unconfigured environment '${network}'.`);
  }
}
const config = getConfig(context.networkId);

//get LENDLE price
function getLendPrice(chainId, address) {
  const query = `
  query {
    token(id: "0x25356aeca4210ef7553140edb9b8026089e49396"){
      name
      derivedUSD
      derivedNATIVE
    }
  }
  `;
  return asyncFetch(GRAPHQL_URL_PRICE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((res) => {
    if (!res.body.data.token) {
      return {
        body: {
          price: DEFAULT_LENDLE_PRICE,
        },
      };
    }
    return {
      body: {
        price: res.body.data.token.derivedUSD,
      },
    };
  });
}

// App states
State.init({
  imports: {},
  chainId: undefined, // chainId is undefined in the case of unsupported chains
  isChainSupported: true,
  showWithdrawModal: false,
  showSupplyModal: false,
  showRepayModal: false,
  showBorrowModal: false,
  showAssetBorrowModal: false,
  walletConnected: false,
  assetsToSupply: undefined,
  yourSupplies: undefined,
  assetsToBorrow: undefined,
  yourBorrows: undefined,
  address: undefined,
  baseAssetBalance: undefined,
  selectTab: "supply", // supply | borrow
  markets: undefined,
  marketsData: undefined,
  lendlePrice: DEFAULT_LENDLE_PRICE,
  userAccountData: {},
});

const loading =
  !state.assetsToSupply ||
  !state.yourSupplies?.deposits ||
  !state.assetsToBorrow;

// Import functions to state.imports
function importFunctions(imports) {
  if (loading) {
    State.update({
      imports,
    });
  }
}

// Define the modules you'd like to import
const modules = {
  number: `${config.ownerId}/widget/Utils.Number`,
  date: `${config.ownerId}/widget/Utils.Date`,
  data: `${config.ownerId}/widget/Lendle.Data`,
};
// Import functions
// const { formatAmount } = state.imports.number;
// const { formatDateTime } = state.imports.date;

function checkProvider() {
  const provider = Ethers.provider();
  if (provider) {
    State.update({ walletConnected: true });
  } else {
    State.update({ walletConnected: false });
  }
}

//get calculated indicators
function calculateAvailableBorrows({
  availableBorrowsUSD,
  marketReferencePriceInUsd,
}) {
  return isValid(availableBorrowsUSD) && isValid(marketReferencePriceInUsd)
    ? Big(availableBorrowsUSD).div(marketReferencePriceInUsd).toFixed()
    : Number(0).toFixed();
}

function calculateTotalIndicator(data, indicator) {
  return data.reduce(
    (acc, item) =>
      isValid(item[indicator]) && item.symbol !== "WMNT"
        ? acc + Number(item[indicator])
        : acc,
    0
  );
}

function calculateTotalIndicatorNoException(data, indicator) {
  return data.reduce(
    (acc, item) =>
      isValid(item[indicator]) ? acc + Number(item[indicator]) : acc,
    0
  );
}

function calculateUserTotalCollateralUSD(deposits) {
  return deposits.reduce(
    (acc, deposit) =>
      isValid(deposit.underlyingBalanceUSD) &&
      deposit.usageAsCollateralEnabledOnUser
        ? acc + Number(deposit.underlyingBalanceUSD)
        : acc,
    0
  );
}

function calculateBorrowPowerUsed(debts) {
  const totalDebts = calculateTotalIndicatorNoException(
    debts,
    "variableBorrowsUSD"
  );
  return isValid(totalDebts)
    ? totalDebts / (totalDebts + Number(debts[0].availableBorrowsUSD))
    : 0;
}

function calculateUserTotalAPY(data, indicatorBase, indicatorRate) {
  const totalAPY = data.reduce(
    (acc, item) =>
      isValid(item[indicatorBase]) && isValid(item[indicatorRate])
        ? acc + Number(item[indicatorBase]) * item[indicatorRate]
        : acc,
    0
  );
  const totalBase = calculateTotalIndicator(data, indicatorBase);
  return totalAPY / totalBase;
}

function getHealthFactor() {
  const healthFactor = state.userAccountData?.healthFactor;
  return formatHealthFactor(healthFactor);
}

function bigMin(_a, _b) {
  const a = Big(_a);
  const b = Big(_b);
  return a.gt(b) ? b : a;
}

function formatHealthFactor(healthFactor) {
  if (healthFactor === "∞") return healthFactor;
  if (!healthFactor || !isValid(healthFactor)) return "-";
  if (Number(healthFactor) === -1) return "∞";
  return Big(healthFactor).toFixed(6, ROUND_DOWN);
}

function batchBalanceOf(chainId, userAddress, tokenAddresses, abi) {
  tokenAddresses = tokenAddresses.filter((ele) => !!ele);

  const balanceProvider = new ethers.Contract(
    config.balanceProviderAddress,
    abi,
    Ethers.provider().getSigner()
  );

  return balanceProvider.batchBalanceOf([userAddress], tokenAddresses);
}

function getAccountReserveData(userAddress) {
  const lpContract = new ethers.Contract(
    config.lendingPoolAddress,
    config.lendingPoolABI.body,
    Ethers.provider().getSigner()
  );

  const userAccountData = lpContract.getUserAccountData(userAddress);

  return userAccountData;
}

// update data in async manner
function updateData(refresh) {
  getMarkets(state.chainId || DEFAULT_CHAIN_ID).then((marketsResponse) => {
    if (!marketsResponse) {
      return;
    }
    const markets = marketsResponse.body;
    State.update({
      markets,
    });
    const marketsMapping = markets.reduce((prev, cur) => {
      prev[cur.underlyingAsset] = cur;
      return prev;
    }, {});

    const nativeMarket = markets.find(
      (market) => market.symbol === config.nativeWrapCurrency.symbol
    );
    markets.push({
      ...nativeMarket,
      ...{
        ...config.nativeCurrency,
        supportPermit: true,
      },
    });
    getMarketsData(state.chainId || DEFAULT_CHAIN_ID).then(
      (marketsDataResponse) => {
        if (!marketsDataResponse) {
          return;
        }
        const marketsData = marketsDataResponse.body;
        const lendCirculatingSupply =
          Number(marketsData.lendTotalSupply) - marketsData.lendTotalLocked;
        const totalValueLocked = calculateTotalIndicator(
          markets,
          "totalValueLockedUSD"
        );
        const totalDepositBalanceUSD = calculateTotalIndicator(
          markets,
          "totalDepositBalanceUSD"
        );
        const totalBorrowBalanceUSD = calculateTotalIndicator(
          markets,
          "totalBorrowBalanceUSD"
        );
        const globalHealthFactor =
          isValid(totalBorrowBalanceUSD) && isValid(totalValueLocked)
            ? totalValueLocked / totalBorrowBalanceUSD
            : 0;
        State.update({
          marketsData: {
            ...marketsData,
            totalBorrowBalanceUSD,
            lendCirculatingSupply,
            globalHealthFactor,
            totalDepositBalanceUSD,
          },
        });
      }
    );
    getLendPrice().then((lendlePrice) => {
      State.update({
        lendlePrice: lendlePrice.body.price,
      });
    });

    // check abi loaded
    if (
      Object.keys(CONTRACT_ABI)
        .map((key) => config[key])
        .filter((ele) => !!ele).length !== Object.keys(CONTRACT_ABI).length
    ) {
      return;
    }
    const provider = Ethers.provider();
    if (!provider) {
      return;
    }
    provider
      .getSigner()
      ?.getAddress()
      ?.then((address) => {
        State.update({ address });
      });
    provider
      .getSigner()
      ?.getBalance()
      .then((balance) => State.update({ baseAssetBalance: balance }));
    if (!state.address || !state.baseAssetBalance) {
      return;
    }

    // get user balances
    batchBalanceOf(
      state.chainId,
      state.address,
      markets.map((market) => market.underlyingAsset),
      config.walletBalanceProviderABI.body
    )
      .then((balances) => {
        return balances.map((balance) => balance.toString());
      })
      .then((userBalances) => {
        const assetsToSupply = markets
          .map((market, idx) => {
            const balanceRaw = Big(
              market.symbol === config.nativeCurrency.symbol
                ? state.baseAssetBalance
                : userBalances[idx]
            ).div(Big(10).pow(market.decimals));
            const balance = balanceRaw.toFixed(market.decimals, ROUND_DOWN);
            const balanceInUSD = balanceRaw
              .mul(market.marketReferencePriceInUsd)
              .toFixed(3, ROUND_DOWN);

            return {
              ...market,
              balance,
              balanceInUSD,
            };
          })
          .sort((asset1, asset2) => {
            const balanceInUSD1 = Number(asset1.balanceInUSD);
            const balanceInUSD2 = Number(asset2.balanceInUSD);
            if (balanceInUSD1 !== balanceInUSD2)
              return balanceInUSD2 - balanceInUSD1;
            return asset1.symbol.localeCompare(asset2.symbol);
          });

        State.update({
          assetsToSupply,
        });
        // get user borrow data
        updateUserDebts(markets, assetsToSupply, refresh);
      });
    // get user supplies
    updateUserSupplies(marketsMapping, refresh);
  });
}

function updateUserSupplies(marketsMapping, refresh) {
  const prevYourSupplies = state.yourSupplies?.deposits;
  getUserDeposits(state.chainId, state.address).then((userDepositsResponse) => {
    if (!userDepositsResponse) {
      return;
    }
    const userDeposits = userDepositsResponse.body.filter(
      (row) => Number(row.underlyingBalance) !== 0
    );
    const deposits = userDeposits.map((userDeposit) => {
      const market = marketsMapping[userDeposit.underlyingAsset];
      return {
        ...market,
        ...userDeposit,
        // ...(market.symbol === config.nativeWrapCurrency.symbol
        //   ? {
        //       ...config.nativeCurrency,
        //       supportPermit: true,
        //     }
        //   : {}),
        userAvailableLiquidityUSD:
          (Number(userDeposit.underlyingBalance) *
            Number(market.liquidationThreshold)) /
          100,
      };
    });

    State.update({
      yourSupplies: {
        deposits: deposits,
        userTotalAvailableLiquidityUSD: calculateTotalIndicator(
          deposits,
          "userAvailableLiquidityUSD"
        ),
        userTotalDepositUSD: calculateTotalIndicatorNoException(
          deposits,
          "underlyingBalanceUSD"
        ),
        userTotalCollateralUSD: calculateUserTotalCollateralUSD(deposits),
        userAPYSupplies: calculateUserTotalAPY(
          deposits,
          "underlyingBalanceUSD",
          "supplyAPY"
        ),
      },
    });

    if (
      refresh &&
      JSON.stringify(prevYourSupplies) === JSON.stringify(yourSupplies) &&
      yourSupplies.length !== 0
    ) {
      console.log("refresh supplies again ...", prevYourSupplies, yourSupplies);
      setTimeout(updateData, 500);
    }
  });
}

function updateUserDebts(markets, assetsToSupply, refresh) {
  if (!markets || !assetsToSupply) {
    return;
  }

  const prevYourBorrows = state.yourBorrows;
  // userDebts depends on the balance from assetsToSupply
  const assetsToSupplyMap = assetsToSupply.reduce((prev, cur) => {
    if (cur.symbol !== config.nativeCurrency.symbol) {
      prev[cur.underlyingAsset] = cur;
    } else {
      prev[NATIVE_SYMBOL_ADDRESS_MAP_KEY] = cur;
    }
    return prev;
  }, {});

  getUserDebts(state.chainId, state.address).then((userDebtsResponse) => {
    if (!userDebtsResponse) {
      return;
    }
    const userDebts = userDebtsResponse.body;
    const debts = markets
      .map((market) => {
        const userDebt = userDebts.debts.find(
          (debt) => debt.underlyingAsset === market.underlyingAsset
        );

        if (!market) {
          return;
        }
        const { availableLiquidityUSD } = market;
        const availableBorrowsUSD = bigMin(
          userDebts.availableBorrowsUSD,
          availableLiquidityUSD
        )
          .times(ACTUAL_BORROW_AMOUNT_RATE)
          .toFixed();
        const assetsToSupplyMapKey =
          market.symbol === config.nativeWrapCurrency.symbol
            ? NATIVE_SYMBOL_ADDRESS_MAP_KEY
            : userDebt.underlyingAsset;
        return {
          ...market,
          ...userDebt,
          // ...(market.symbol === config.nativeWrapCurrency.symbol
          //   ? {
          //       ...config.nativeCurrency,
          //       supportPermit: true,
          //     }
          //   : {}),
          availableBorrows: calculateAvailableBorrows({
            availableBorrowsUSD,
            marketReferencePriceInUsd: market.marketReferencePriceInUsd,
          }),
          availableBorrowsUSD,
          balance: assetsToSupplyMap[assetsToSupplyMapKey].balance,
          balanceInUSD: assetsToSupplyMap[assetsToSupplyMapKey].balanceInUSD,
          borrowingEnabled: true,
        };
      })
      .filter((asset) => !!asset)
      .sort((asset1, asset2) => {
        const availableBorrowsUSD1 = Number(asset1.availableBorrowsUSD);
        const availableBorrowsUSD2 = Number(asset2.availableBorrowsUSD);
        if (availableBorrowsUSD1 !== availableBorrowsUSD2)
          return availableBorrowsUSD2 - availableBorrowsUSD1;
        return asset1.symbol.localeCompare(asset2.symbol);
      })
      .filter((asset) => {
        return asset.borrowingEnabled;
      });
    const assetsToBorrow = {
      ...userDebts,
      userTotalDebtUSD: calculateTotalIndicatorNoException(
        debts,
        "variableBorrowsUSD"
      ),
      borrowPowerUsed: calculateBorrowPowerUsed(debts),
      userAPYBorrows: calculateUserTotalAPY(
        debts,
        "variableBorrowsUSD",
        "variableBorrowAPY"
      ),
      debts: debts,
    };
    const yourBorrows = {
      ...assetsToBorrow,
      debts: assetsToBorrow.debts.filter(
        (row) =>
          !isNaN(Number(row.variableBorrowsUSD)) &&
          Number(row.variableBorrowsUSD) > 0
      ),
    };

    State.update({
      yourBorrows,
      assetsToBorrow,
    });

    // update health factor
    State.update({
      yourBorrows: {
        ...state.yourBorrows,
        healthFactor: getHealthFactor(),
      },
    });

    if (
      refresh &&
      JSON.stringify(prevYourBorrows) === JSON.stringify(yourBorrows)
    ) {
      console.log("refresh borrows again ...", prevYourBorrows, yourBorrows);
      setTimeout(updateData, 500);
    }
  });
}

function onActionSuccess({ msg, callback }) {
  // update data if action finishes
  updateData(true);
  // update UI after data has almost loaded
  setTimeout(() => {
    if (callback) {
      callback();
    }
    if (msg) {
      State.update({ alertModalText: msg });
    }
  }, 5000);
}

checkProvider();
// if (state.walletConnected && state.chainId && loading) {
updateData();
// }

const Body = styled.div`
  padding: 24px 15px;
  background: #1b0027;
  min-height: 100vh;
  color: white;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
// Component body
const body = loading ? (
  <>
    <Widget src={`${config.ownerId}/widget/Lendle.Header`} props={{ config }} />
    <Body>
      {state.walletConnected
        ? state.isChainSupported
          ? "Loading..."
          : `Please switch network to ${
              getNetworkConfig(DEFAULT_CHAIN_ID).chainName
            }`
        : "Connect your wallet to see your supplies, borrowings, and open positions."}
      <Widget
        src={`${config.ownerId}/widget/Lendle.Card.Markets`}
        props={{
          config,
          markets: state.markets,
          hideTokens: HIDE_TOKENS_SYMBOL,
          // chainId: state.chainId,
          // showVestModal: state.showVestModal,
          // setShowVestModal: (isShow) =>
          //   State.update({ showVestModal: isShow }),
          // onActionSuccess,
          // depositETHGas,
          // depositERC20Gas,
        }}
      />
    </Body>
  </>
) : (
  <>
    <Widget src={`${config.ownerId}/widget/Lendle.Header`} props={{ config }} />
    <Body>
      <FlexContainer>
        {/* <Widget
          src={`${config.ownerId}/widget/Lendle.NetworkSwitcher`}
          props={{
            chainId: state.chainId,
            config,
            switchNetwork: (chainId) => {
              switchEthereumChain(chainId);
            },
          }}
        /> */}
        <Widget
          src={`${config.ownerId}/widget/Lendle.HeroData`}
          props={{
            config,
            netWorth: `$ ${
              state.assetsToBorrow?.netWorthUSD
                ? Big(state.assetsToBorrow.netWorthUSD).toFixed(2)
                : "-"
            }`,
            netApy: `${
              state.assetsToBorrow?.netAPY
                ? Number(
                    Big(state.assetsToBorrow.netAPY).times(100).toFixed(2)
                  ) === 0
                  ? "0.00"
                  : Big(state.assetsToBorrow.netAPY).times(100).toFixed(2)
                : "-"
            }%`,
            healthFactor: state.yourBorrows.healthFactor,
            totalValueLockedUSD: Number(
              state.marketsData.totalValueLockedUSD
            ).toFixed(0),
            totalLoanOriginations: Number(
              state.marketsData.cumulativeBorrowUSD
            ).toFixed(0),
            currentLoans: Number(
              state.marketsData.totalBorrowBalanceUSD
            ).toFixed(0),
            lendTotalSupply: Number(state.marketsData.lendTotalSupply).toFixed(
              0
            ),
            lendCirculatingSupply: Number(
              state.marketsData.lendCirculatingSupply
            ).toFixed(0),
            globalHealthFactor: state.marketsData.globalHealthFactor.toFixed(2),
            lendlePrice: state.lendlePrice,
            showHealthFactor:
              state.yourBorrows &&
              state.yourBorrows.debts &&
              state.yourBorrows.debts.length > 0,
          }}
        />
      </FlexContainer>
      <Widget
        src={`${config.ownerId}/widget/Lendle.TabSwitcher`}
        props={{
          config,
          select: state.selectTab,
          setSelect: (tabName) => State.update({ selectTab: tabName }),
        }}
      />
      {state.selectTab === "supply" && (
        <>
          <Widget
            src={`${config.ownerId}/widget/Lendle.Card.YourSupplies`}
            props={{
              config,
              chainId: state.chainId,
              yourBorrows: state.yourBorrows,
              yourSupplies: state.yourSupplies,
              showWithdrawModal: state.showWithdrawModal,
              setShowWithdrawModal: (isShow) =>
                State.update({ showWithdrawModal: isShow }),
              onActionSuccess,
              formatHealthFactor,
              withdrawETHGas,
              withdrawERC20Gas,
              hideTokens: HIDE_TOKENS_SYMBOL,
            }}
          />
          <Widget
            src={`${config.ownerId}/widget/Lendle.Card.AssetsToSupply`}
            props={{
              config,
              chainId: state.chainId,
              assetsToSupply: state.assetsToSupply,
              yourBorrows: state.yourBorrows,
              yourSupplies: state.yourSupplies,
              showSupplyModal: state.showSupplyModal,
              setShowSupplyModal: (isShow) =>
                State.update({ showSupplyModal: isShow }),
              onActionSuccess,
              formatHealthFactor,
              depositETHGas,
              depositERC20Gas,
              hideTokens: HIDE_TOKENS_SYMBOL,
            }}
          />
        </>
      )}
      {state.selectTab === "borrow" && (
        <>
          <Widget
            src={`${config.ownerId}/widget/Lendle.Card.YourBorrows`}
            props={{
              config,
              chainId: state.chainId,
              yourBorrows: state.yourBorrows,
              yourSupplies: state.yourSupplies,
              showRepayModal: state.showRepayModal,
              setShowRepayModal: (isShow) =>
                State.update({ showRepayModal: isShow }),
              showBorrowModal: state.showBorrowModal,
              setShowBorrowModal: (isShow) =>
                State.update({ showBorrowModal: isShow }),
              formatHealthFactor,
              onActionSuccess,
              repayETHGas,
              repayERC20Gas,
              borrowETHGas,
              borrowERC20Gas,
              hideTokens: HIDE_TOKENS_SYMBOL,
            }}
          />
          <Widget
            src={`${config.ownerId}/widget/Lendle.Card.AssetsToBorrow`}
            props={{
              config,
              chainId: state.chainId,
              assetsToBorrow: state.assetsToBorrow,
              showBorrowModal: state.showAssetBorrowModal,
              yourBorrows: state.yourBorrows,
              yourSupplies: state.yourSupplies,
              setShowBorrowModal: (isShow) => {
                State.update({ showAssetBorrowModal: isShow });
              },
              formatHealthFactor,
              onActionSuccess,
              borrowETHGas,
              borrowERC20Gas,
              hideTokens: HIDE_TOKENS_SYMBOL,
            }}
          />
        </>
      )}
      {state.alertModalText && (
        <Widget
          src={`${config.ownerId}/widget/Lendle.Modal.AlertModal`}
          props={{
            config,
            title: "All done!",
            description: state.alertModalText,
            onRequestClose: () => State.update({ alertModalText: false }),
          }}
        />
      )}
      <Widget
        src={`${config.ownerId}/widget/Lendle.Card.Markets`}
        props={{
          config,
          markets: state.markets,
          hideTokens: HIDE_TOKENS_SYMBOL,
          // chainId: state.chainId,
          // showVestModal: state.showVestModal,
          // setShowVestModal: (isShow) =>
          //   State.update({ showVestModal: isShow }),
          // onActionSuccess,
          // depositETHGas,
          // depositERC20Gas,
        }}
      />
    </Body>
  </>
);

return (
  <div>
    {/* Component Head */}
    <Widget
      src={`${config.ownerId}/widget/Utils.Import`}
      props={{ modules, onLoad: importFunctions }}
    />
    {/* Component Body */}
    {body}
  </div>
);
