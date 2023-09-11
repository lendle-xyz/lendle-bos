const {
  config,
  data,
  onRequestClose,
  onActionSuccess,
  chainId,
  onlyOneBorrow,
  repayETHGas,
  repayERC20Gas,
  formatHealthFactor,
} = props;

if (!data) {
  return <div />;
}

const ROUND_DOWN = 0;
function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

const {
  symbol,
  marketReferencePriceInUsd,
  healthFactor,
  availableBorrows,
  availableBorrowsUSD,
  decimals,
  underlyingAsset,
  variableBorrows,
  name: tokenName,
  balance,
  supportPermit,
} = data;

const disabled =
  !state.amount || !isValid(state.amount) || Number(state.amount) === 0;

const RepayContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TokenTexture = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const TokenWrapper = styled.div`
  display: flex;
  img {
    margin-right: 4px;
  }
`;

const GrayTexture = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #7c7c86;
`;

const PurpleTexture = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #8a8db9;
`;

const GreenTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #12b76a;
`;

const RedTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #f04438;
`;

const WhiteTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;
const TransactionOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;

  font-size: 20px;
  font-weight: bold;
  color: white;
  flex: 1;
  width: 160px;

  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Max = styled.span`
  color: #9e77ed;
  cursor: pointer;
`;

State.init({
  amount: "",
  amountInUSD: "0.00",
  loading: false,
  newHealthFactor: "-",
  gas: "-",
  allowanceAmount: "0",
  needApprove: false,
});

function updateGas() {
  if (symbol === config.nativeCurrency.symbol) {
    repayETHGas().then((value) => {
      State.update({ gas: value });
    });
  } else {
    repayERC20Gas().then((value) => {
      State.update({ gas: value });
    });
  }
}

updateGas();

function bigMin(_a, _b) {
  const a = Big(_a);
  const b = Big(_b);
  return a.gt(b) ? b : a;
}

function getAvailableBalance() {
  if (symbol === config.nativeCurrency.symbol) {
    const newBalance = Number(balance) - 0.01;
    if (newBalance <= 0) {
      return 0;
    } else {
      return newBalance;
    }
  } else {
    return balance;
  }
}

const actualMaxValue =
  isValid(balance) && isValid(variableBorrows)
    ? bigMin(
        getAvailableBalance(),
        Big(variableBorrows).times(1.01).toNumber()
      ).toFixed()
    : "0";
const shownMaxValue =
  isValid(balance) && isValid(variableBorrows)
    ? bigMin(getAvailableBalance(), variableBorrows).toFixed(decimals)
    : Big("0").toFixed(decimals);

/**
 *
 * @param {string} chainId
 * @param {string} address user address
 * @param {string} asset asset address
 * @param {string} action 'deposit' | 'withdraw' | 'borrow' | 'repay'
 * @param {string} amount amount in USD with 2 fixed decimals
 * @returns
 */
function getNewHealthFactor(chainId, address, asset, action, amount) {
  const url = `${config.AAVE_API_BASE_URL}/${chainId}/health/${address}`;
  return asyncFetch(`${url}?asset=${asset}&action=${action}&amount=${amount}`);
}

function debounce(fn, wait) {
  let timer = state.timer;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, wait);
    State.update({ timer });
  };
}

const updateNewHealthFactor = debounce(() => {
  State.update({ newHealthFactor: "-" });

  Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      getNewHealthFactor(
        chainId,
        address,
        data.underlyingAsset,
        "repay",
        state.amountInUSD
      ).then((response) => {
        const newHealthFactor = formatHealthFactor(response.body);
        State.update({ newHealthFactor });
      });
    });
}, 1000);

const changeValue = (value) => {
  let amountInUSD = "0.00";
  if (Number(value) > Number(shownMaxValue)) {
    value = shownMaxValue;
  }
  if (Number(value) < 0) {
    value = "0";
  }
  if (isValid(value)) {
    amountInUSD = Big(value)
      .mul(marketReferencePriceInUsd)
      .toFixed(2, ROUND_DOWN);
  }
  State.update({ amount: value, amountInUSD });
  updateNewHealthFactor();
};

function getNonce(tokenAddress, userAddress) {
  const token = new ethers.Contract(
    tokenAddress,
    config.erc20Abi.body,
    Ethers.provider().getSigner()
  );

  return token.nonces(userAddress).then((nonce) => nonce.toNumber());
}

function getAllowance() {
  const tokenAddress = underlyingAsset;
  Ethers.provider()
    .getSigner()
    .getAddress()
    .then((userAddress) => {
      const token = new ethers.Contract(
        tokenAddress,
        config.erc20Abi.body,
        Ethers.provider().getSigner()
      );
      token
        .allowance(userAddress, config.aavePoolV3Address)
        .then((allowanceAmount) => allowanceAmount.toString())
        .then((allowanceAmount) => {
          State.update({
            allowanceAmount: Big(allowanceAmount)
              .div(Big(10).pow(decimals))
              .toFixed(),
          });
        });
    });
}
getAllowance();

function repayFromApproval(amount) {
  const tokenAddress = underlyingAsset;
  const pool = new ethers.Contract(
    config.aavePoolV3Address,
    config.aavePoolV3ABI.body,
    Ethers.provider().getSigner()
  );

  return Ethers.provider()
    .getSigner()
    .getAddress()
    .then((userAddress) => {
      return pool["repay(address,uint256,uint256,address)"](
        tokenAddress,
        amount,
        2, // variable interest rate
        userAddress
      );
    });
}

function approve(amount) {
  const tokenAddress = underlyingAsset;
  const token = new ethers.Contract(
    tokenAddress,
    config.erc20Abi.body,
    Ethers.provider().getSigner()
  );
  return token["approve(address,uint256)"](config.aavePoolV3Address, amount);
}

function update() {
  if (supportPermit) {
    return;
  }
  if (
    !isValid(state.amount) ||
    !isValid(state.allowanceAmount) ||
    Number(state.allowanceAmount) < Number(state.amount) ||
    Number(state.amount) === 0
  ) {
    State.update({ needApprove: true });
  } else {
    State.update({ needApprove: false });
  }
}
update();

/**
 *
 * @param {string} user user address
 * @param {string} reserve AAVE reserve address (token to supply)
 * @param {string} tokenName token name
 * @param {string} amount token amount in full decimals
 * @param {number} deadline unix timestamp in SECONDS
 * @returns raw signature string will could be used in supplyWithPermit
 */
function signERC20Approval(user, reserve, tokenName, amount, deadline) {
  return getNonce(reserve, user).then((nonce) => {
    const typeData = {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: "Permit",
      domain: {
        name: tokenName,
        version: "1",
        chainId,
        verifyingContract: reserve,
      },
      message: {
        owner: user,
        spender: config.aavePoolV3Address,
        value: amount,
        nonce,
        deadline,
      },
    };

    const dataToSign = JSON.stringify(typeData);

    return Ethers.provider().send("eth_signTypedData_v4", [user, dataToSign]);
  });
}

/**
 *
 * @param {*} rawSig signature from signERC20Approval
 * @param {string} address user address
 * @param {string} asset asset address (e.g. USDT)
 * @param {string} amount repay amount in full decimals
 * @param {number} deadline UNIX timestamp in SECONDS
 * @returns
 */
function repayERC20(shownAmount, actualAmount) {
  State.update({
    loading: true,
  });
  const asset = underlyingAsset;
  const deadline = Math.floor(Date.now() / 1000 + 3600); // after an hour
  Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      if (!supportPermit) {
        repayFromApproval(actualAmount)
          .then((tx) => {
            tx.wait()
              .then((res) => {
                const { status } = res;
                if (status === 1) {
                  onActionSuccess({
                    msg: `You repaid ${Big(shownAmount).toFixed(8)} ${symbol}`,
                    callback: () => {
                      onRequestClose();
                      State.update({
                        loading: false,
                      });
                    },
                  });
                  console.log("tx succeeded", res);
                } else {
                  State.update({
                    loading: false,
                  });
                  console.log("tx failed", res);
                }
              })
              .catch(() => State.update({ loading: false }));
          })
          .catch(() => State.update({ loading: false }));
      } else {
        return signERC20Approval(
          address,
          asset,
          tokenName,
          actualAmount,
          deadline
        )
          .then((rawSig) => {
            const sig = ethers.utils.splitSignature(rawSig);
            const pool = new ethers.Contract(
              config.aavePoolV3Address,
              config.aavePoolV3ABI.body,
              Ethers.provider().getSigner()
            );

            return pool[
              "repayWithPermit(address,uint256,uint256,address,uint256,uint8,bytes32,bytes32)"
            ](
              asset,
              actualAmount,
              2, // variable interest rate
              address,
              deadline,
              sig.v,
              sig.r,
              sig.s
            ).then((tx) => {
              tx.wait()
                .then((res) => {
                  const { status } = res;
                  if (status === 1) {
                    onActionSuccess({
                      msg: `You repaid ${Big(shownAmount).toFixed(
                        8
                      )} ${symbol}`,
                      callback: () => {
                        onRequestClose();
                        State.update({
                          loading: false,
                        });
                      },
                    });
                    console.log("tx succeeded", res);
                  } else {
                    State.update({
                      loading: false,
                    });
                    console.log("tx failed", res);
                  }
                })
                .catch(() => State.update({ loading: false }));
            });
          })
          .catch(() => State.update({ loading: false }));
      }
    })
    .catch(() => State.update({ loading: false }));
}

function repayETH(shownAmount, actualAmount) {
  State.update({ loading: true });
  const wrappedTokenGateway = new ethers.Contract(
    config.wrappedTokenGatewayV3Address,
    config.wrappedTokenGatewayV3ABI.body,
    Ethers.provider().getSigner()
  );

  Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      wrappedTokenGateway
        .repayETH(
          config.aavePoolV3Address,
          actualAmount,
          2, // variable interest rate
          address,
          {
            value: actualAmount,
          }
        )
        .then((tx) => {
          tx.wait()
            .then((res) => {
              const { status } = res;
              if (status === 1) {
                onActionSuccess({
                  msg: `You repaid ${Big(shownAmount).toFixed(8)} ${symbol}`,
                  callback: () => {
                    onRequestClose();
                    State.update({
                      loading: false,
                    });
                  },
                });
                console.log("tx succeeded", res);
              } else {
                State.update({
                  loading: false,
                });
                console.log("tx failed", res);
              }
            })
            .catch(() => State.update({ loading: false }));
        })
        .catch(() => State.update({ loading: false }));
    })
    .catch(() => State.update({ loading: false }));
}

return (
  <>
    <Widget
      src={`${config.ownerId}/widget/Lendle.Modal.BaseModal`}
      props={{
        title: `Repay ${symbol}`,
        onRequestClose: onRequestClose,
        children: (
          <RepayContainer>
            <Widget
              src={`${config.ownerId}/widget/Lendle.Modal.RoundedCard`}
              props={{
                title: "Amount",
                config,
                children: (
                  <>
                    <Widget
                      src={`${config.ownerId}/widget/Lendle.Modal.FlexBetween`}
                      props={{
                        left: (
                          <TokenTexture>
                            <Input
                              type="number"
                              value={state.amount}
                              onChange={(e) => {
                                changeValue(e.target.value);
                              }}
                              placeholder="0"
                            />
                          </TokenTexture>
                        ),
                        right: (
                          <TokenWrapper>
                            <img
                              width={26}
                              height={26}
                              src={`https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/images/${symbol.toLowerCase()}.svg`}
                            />
                            <TokenTexture>{symbol}</TokenTexture>
                          </TokenWrapper>
                        ),
                      }}
                    />
                    <Widget
                      src={`${config.ownerId}/widget/Lendle.Modal.FlexBetween`}
                      props={{
                        left: <GrayTexture>${state.amountInUSD}</GrayTexture>,
                        right: (
                          <GrayTexture>
                            Wallet balance:{" "}
                            {balance === "" || !isValid(balance)
                              ? "-"
                              : Number(balance).toFixed(7)}
                            <Max
                              onClick={() => {
                                changeValue(shownMaxValue);
                              }}
                            >
                              MAX
                            </Max>
                          </GrayTexture>
                        ),
                      }}
                    />
                  </>
                ),
              }}
            />
            <Widget
              src={`${config.ownerId}/widget/Lendle.Modal.RoundedCard`}
              props={{
                title: "Transaction Overview",
                config,
                children: (
                  <TransactionOverviewContainer>
                    <Widget
                      src={`${config.ownerId}/widget/Lendle.Modal.FlexBetween`}
                      props={{
                        left: <PurpleTexture>Remaining Debt</PurpleTexture>,
                        right: (
                          <div style={{ textAlign: "right" }}>
                            <WhiteTexture>
                              {Number(variableBorrows).toFixed(7) +
                                ` ${symbol}`}
                              <img
                                src={`${config.ipfsPrefix}/bafkreiesqu5jyvifklt2tfrdhv6g4h6dubm2z4z4dbydjd6if3bdnitg7q`}
                                width={16}
                                height={16}
                              />{" "}
                              {isValid(state.amount)
                                ? Big(variableBorrows)
                                    .minus(state.amount)
                                    .toFixed(7) + ` ${symbol}`
                                : `- ${symbol}`}
                            </WhiteTexture>
                            <WhiteTexture>
                              {isValid(variableBorrows) &&
                              isValid(marketReferencePriceInUsd)
                                ? "$ " +
                                  Big(variableBorrows)
                                    .times(marketReferencePriceInUsd)
                                    .toFixed(2)
                                : "$ -"}
                              <img
                                src={`${config.ipfsPrefix}/bafkreiesqu5jyvifklt2tfrdhv6g4h6dubm2z4z4dbydjd6if3bdnitg7q`}
                                width={16}
                                height={16}
                              />{" "}
                              {isValid(state.amount) &&
                              isValid(state.amount) &&
                              isValid(marketReferencePriceInUsd)
                                ? "$ " +
                                  Big(variableBorrows)
                                    .minus(state.amount)
                                    .times(marketReferencePriceInUsd)
                                    .toFixed(2)
                                : "$ -"}
                            </WhiteTexture>
                          </div>
                        ),
                      }}
                    />
                    <Widget
                      src={`${config.ownerId}/widget/Lendle.Modal.FlexBetween`}
                      props={{
                        left: <PurpleTexture>Health Factor</PurpleTexture>,
                        right: (
                          <div style={{ textAlign: "right" }}>
                            <GreenTexture>
                              {healthFactor}
                              <img
                                src={`${config.ipfsPrefix}/bafkreiesqu5jyvifklt2tfrdhv6g4h6dubm2z4z4dbydjd6if3bdnitg7q`}
                                width={16}
                                height={16}
                              />{" "}
                              {state.newHealthFactor}
                            </GreenTexture>
                            <WhiteTexture>
                              Liquidation at &lt;{" "}
                              {config.FIXED_LIQUIDATION_VALUE}
                            </WhiteTexture>
                          </div>
                        ),
                      }}
                    />
                  </TransactionOverviewContainer>
                ),
              }}
            />
            <Widget
              src={`${config.ownerId}/widget/Lendle.GasEstimation`}
              props={{ gas: state.gas, config }}
            />
            {state.needApprove && (
              <Widget
                src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
                props={{
                  config,
                  loading: state.loading,
                  children: `Approve ${symbol}`,
                  disabled,
                  onClick: () => {
                    State.update({
                      loading: true,
                    });
                    const amount = Big(state.amount)
                      .mul(Big(10).pow(decimals))
                      .toFixed(0);
                    approve(amount)
                      .then((tx) => {
                        tx.wait()
                          .then((res) => {
                            const { status } = res;
                            if (status === 1) {
                              State.update({
                                needApprove: false,
                                loading: false,
                              });
                            } else {
                              console.log("tx failed", res);
                              State.update({
                                loading: false,
                              });
                            }
                          })
                          .catch(() => State.update({ loading: false }));
                      })
                      .catch(() => State.update({ loading: false }));
                  },
                }}
              />
            )}
            {!state.needApprove && (
              <Widget
                src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
                props={{
                  config,
                  children: `Repay ${symbol}`,
                  loading: state.loading,
                  disabled,
                  onClick: () => {
                    const actualAmount = Big(
                      state.amount === shownMaxValue
                        ? actualMaxValue
                        : state.amount
                    )
                      .mul(Big(10).pow(decimals))
                      .toFixed(0);
                    const shownAmount = state.amount;
                    if (symbol === config.nativeCurrency.symbol) {
                      repayETH(shownAmount, actualAmount);
                    } else {
                      repayERC20(shownAmount, actualAmount);
                    }
                  },
                }}
              />
            )}
          </RepayContainer>
        ),
        config,
      }}
    />
  </>
);
