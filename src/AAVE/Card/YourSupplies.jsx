const {
  config,
  chainId,
  yourSupplies,
  onActionSuccess,
  showWithdrawModal,
  setShowWithdrawModal,
  healthFactor,
  withdrawETHGas,
  withdrawERC20Gas,
  formatHealthFactor,
} = props;

State.init({
  data: undefined,
});

const WithdrawButton = ({ data }) => (
  <Widget
    src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
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
      src={`${config.ownerId}/widget/AAVE.Card.CardsView`}
      props={{
        config,
        style: {
          marginTop: "16px",
        },
        title: "Your supplies",
        body:
          !yourSupplies || yourSupplies.length === 0 ? (
            <Widget
              src={`${config.ownerId}/widget/AAVE.Card.CardEmpty`}
              props={{
                config,
                children: "Nothing supplied yet",
              }}
            />
          ) : (
            <>
              {/* mobileView */}
              {yourSupplies.map((row) => (
                <Widget
                  src={`${config.ownerId}/widget/AAVE.Card.CardContainer`}
                  props={{
                    children: [
                      <Widget
                        src={`${config.ownerId}/widget/AAVE.Card.Divider`}
                        props={{ config }}
                      />,
                      <Widget
                        src={`${config.ownerId}/widget/AAVE.Card.CardsBody`}
                        props={{
                          config,
                          children: [
                            <Widget
                              src={`${config.ownerId}/widget/AAVE.Card.TokenWrapper`}
                              props={{
                                children: [
                                  <img
                                    width={64}
                                    height={64}
                                    src={`https://app.aave.com/icons/tokens/${row.symbol.toLowerCase()}.svg`}
                                  />,
                                  <div>
                                    <div className="token-title">
                                      {row.symbol}
                                    </div>
                                    <div className="token-chain">
                                      {row.name}
                                    </div>
                                  </div>,
                                ],
                              }}
                            />,
                            <Widget
                              src={`${config.ownerId}/widget/AAVE.Card.CardDataWrapper`}
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
                                      <div>
                                        ${" "}
                                        {Number(
                                          row.underlyingBalanceUSD
                                        ).toFixed(2)}
                                      </div>
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
                src={`${config.ownerId}/widget/AAVE.Card.CardsTable`}
                props={{
                  config,
                  headers: ["Asset", "Supply Balance", "Supply APY", ""],
                  data: yourSupplies.map((row) => {
                    return [
                      <Widget
                        src={`${config.ownerId}/widget/AAVE.Card.TokenWrapper`}
                        props={{
                          children: [
                            <img
                              width={64}
                              height={64}
                              src={`https://app.aave.com/icons/tokens/${row.symbol.toLowerCase()}.svg`}
                            />,
                            <div>
                              <div className="token-title">{row.symbol}</div>
                              <div className="token-chain">{row.name}</div>
                            </div>,
                          ],
                        }}
                      />,
                      <div>
                        <div>{Number(row.underlyingBalance).toFixed(7)}</div>
                        <div>
                          $ {Number(row.underlyingBalanceUSD).toFixed(2)}
                        </div>
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
        src={`${config.ownerId}/widget/AAVE.Modal.WithdrawModal`}
        props={{
          config,
          chainId,
          data: {
            ...state.data,
            healthFactor,
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
