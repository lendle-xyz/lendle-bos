const {
  config,
  chainId,
  yourSupplies,
  yourBorrows,
  onActionSuccess,
  showWithdrawModal,
  setShowWithdrawModal,
  withdrawETHGas,
  withdrawERC20Gas,
  formatHealthFactor,
  hideTokens,
} = props;

State.init({
  data: undefined,
});

function getInformers() {
  return [
    {
      title: "Balance",
      data: yourSupplies?.userTotalDepositUSD
        ? `$ ${(yourSupplies.userTotalDepositUSD).toFixed(2)}`
        : "-",
    },
    {
      title: "APY",
      data: yourSupplies?.userAPYSupplies
        ? `${(yourSupplies.userAPYSupplies * 100).toFixed(2)} %`
        : "-",
    },
    {
      title: "Collateral",
      data: yourSupplies?.userTotalCollateralUSD
        ? `$ ${(yourSupplies.userTotalCollateralUSD).toFixed(2)}`
        : "-",
    },
    {
      title: "Health factor",
      data: yourBorrows?.healthFactor && !isNaN(yourBorrows.healthFactor) ? Number(yourBorrows.healthFactor).toFixed(2) : "-",
    },
  ];
};

const TokenChain = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #6f6f6f;
`;

const WithdrawButton = ({ data }) => (
  <Widget
    src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
    props={{
      config,
      children: "Withdraw",
      onClick: () => {
        State.update({ data });
        setShowWithdrawModal(true);
      },
    }}
  />
);

return (
  <>
    <Widget
      src={`${config.ownerId}/widget/Lendle.Card.CardsView`}
      props={{
        config,
        style: {
          marginTop: "16px",
          background: "#1B0027",
          border: "1px solid #42307D",
          borderRadius: "12px",
        },
        title: "Your supplies",
        headerData:
          !yourSupplies?.deposits || yourSupplies.deposits.length === 0 ? (
            null
          ) : (
            getInformers().map(({title, data}) => (
              <Widget
                src={`${config.ownerId}/widget/Lendle.Card.Informer`}
                props={{config, title, data}}
              />
            ))
          ),
        body:
          !yourSupplies?.deposits || yourSupplies.deposits.length === 0 ? (
            <Widget
              src={`${config.ownerId}/widget/Lendle.Card.CardEmpty`}
              props={{
                config,
                children: "Nothing supplied yet",
              }}
            />
          ) : (
            <>
              {/* mobileView */}
              {yourSupplies.deposits.map((row) => hideTokens.includes(row.symbol) ? [] : (
                <Widget
                  src={`${config.ownerId}/widget/Lendle.Card.CardContainer`}
                  props={{
                    children: [
                      <Widget
                        src={`${config.ownerId}/widget/Lendle.Card.Divider`}
                        props={{ config }}
                      />,
                      <Widget
                        src={`${config.ownerId}/widget/Lendle.Card.CardsBody`}
                        props={{
                          config,
                          children: [
                            <Widget
                              src={`${config.ownerId}/widget/Lendle.Card.TokenWrapper`}
                              props={{
                                children: [
                                  <img
                                    width={64}
                                    height={64}
                                    src={`https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/images/${row.symbol.toLowerCase()}.svg`}
                                  />,
                                  <div>
                                    <div className="token-title">
                                      {row.symbol}
                                    </div>
                                    {/* <div className="token-chain">
                                      {row.name}
                                    </div> */}
                                  </div>,
                                ],
                              }}
                            />,
                            <Widget
                              src={`${config.ownerId}/widget/Lendle.Card.CardDataWrapper`}
                              props={{
                                children: [
                                  <div className="card-data-row">
                                    <div className="card-data-key">
                                      Supply Balance
                                    </div>
                                    <div className="card-data-value">
                                      <div>
                                        {Number(row.underlyingBalance).toFixed(
                                          7
                                        )}
                                      </div>
                                      <TokenChain>
                                        ${" "}
                                        {Number(
                                          row.underlyingBalanceUSD
                                        ).toFixed(2)}
                                      </TokenChain>
                                    </div>
                                  </div>,
                                  <div className="card-data-row">
                                    <div className="card-data-key">
                                      Supply APY
                                    </div>
                                    <div className="card-data-value">{`${(
                                      Number(row.supplyAPY) * 100
                                    ).toFixed(2)} %`}</div>
                                  </div>,
                                ],
                              }}
                            />,
                            <WithdrawButton data={row} />,
                          ],
                        }}
                      />,
                    ],
                  }}
                />
              ))}
              {/* pcView */}
              <Widget
                src={`${config.ownerId}/widget/Lendle.Card.CardsTable`}
                props={{
                  config,
                  headers: ["Asset", "Supply Balance", "Supply APY", ""],
                  data: yourSupplies.deposits.map((row) => {
                    if (hideTokens.includes(row.symbol)) {return []}
                    return [
                      <Widget
                        src={`${config.ownerId}/widget/Lendle.Card.TokenWrapper`}
                        props={{
                          children: [
                            <img
                              width={64}
                              height={64}
                              src={`https://raw.githubusercontent.com/lendle-xyz/lendle-bos/main/src/images/${row.symbol.toLowerCase()}.svg`}
                            />,
                            <div className="token-title">
                              {row.symbol}
                              {/* <div className="token-title">{row.symbol}</div> */}
                              {/* <div className="token-chain">{row.name}</div> */}
                            </div>,
                          ],
                        }}
                      />,
                      <div>
                        <div>{Number(row.underlyingBalance).toFixed(7)}</div>
                        <TokenChain>
                          $ {Number(row.underlyingBalanceUSD).toFixed(2)}
                        </TokenChain>
                      </div>,
                      `${(Number(row.supplyAPY) * 100).toFixed(2)} %`,
                      <WithdrawButton data={row} />,
                    ];
                  }),
                }}
              />
            </>
          ),
      }}
    />
    {showWithdrawModal && (
      <Widget
        src={`${config.ownerId}/widget/Lendle.Modal.WithdrawModal`}
        props={{
          config,
          chainId,
          data: {
            ...state.data,
            healthFactor: yourBorrows.healthFactor,
            userTotalAvailableLiquidityUSD: yourSupplies.userTotalAvailableLiquidityUSD,
            userTotalDebtUSD: yourBorrows.userTotalDebtUSD,
          },
          onActionSuccess,
          withdrawETHGas,
          withdrawERC20Gas,
          formatHealthFactor,
          onRequestClose: () => setShowWithdrawModal(false),
        }}
      />
    )}
  </>
);
