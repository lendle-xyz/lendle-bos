const {
  config,
  markets,
  // showVestModal,
  // setShowVestModal,
  // onActionSuccess,
  // chainId,
  // healthFactor,
  // formatHealthFactor,
  // depositETHGas,
  // depositERC20Gas,
} = props;

console.log("markets2", markets);

State.init({
  data: undefined,
});

// const VestButton = ({ data }) => (
//   <Widget
//     src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
//     props={{
//       config,
//       children: "Vest",
//       onClick: () => {
//         State.update({ data });
//         setShowVestModal(true);
//       },
//     }}
//   />
// );

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
        title: "",
        body:
          !markets || markets.length < 1 ? (
            <Widget
              src={`${config.ownerId}/widget/Lendle.Card.CardEmpty`}
              props={{
                config,
                children: "Markets data not loaded",
              }}
            />
          ) : (
            <>
              {/* pcView */}
              <Widget
                src={`${config.ownerId}/widget/Lendle.Card.CardsTable`}
                props={{
                  config,
                  headers: [
                    "Assets",
                    "Market size",
                    "Supply APY",
                    "Borrow APY",
                    "Total borrowed",
                    "",
                  ],
                  data: markets.map((row) =>
                    row.underlyingAsset
                      ? [
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
                                  {/* <div className="token-chain">{row.name}</div> */}
                                </div>,
                              ],
                            }}
                          />,
                          <div>
                            <div>
                              {Number(
                                row.totalDepositBalanceUSD /
                                  row.marketReferencePriceInUsd
                              ).toFixed(0)}
                            </div>
                            <div>
                              $ {Number(row.totalDepositBalanceUSD).toFixed(0)}
                            </div>
                          </div>,
                          `${(Number(row.supplyAPY) * 100).toFixed(2)} %`,
                          `${(Number(row.variableBorrowAPY) * 100).toFixed(
                            2
                          )} %`,
                          <div>
                            <div>
                              {Number(
                                row.totalBorrowBalanceUSD /
                                  row.marketReferencePriceInUsd
                              ).toFixed(0)}
                            </div>
                            <div>
                              $ {Number(row.totalBorrowBalanceUSD).toFixed(0)}
                            </div>
                          </div>,
                          // <VestButton data={row} />,
                        ]
                      : []
                  ),
                }}
              />
              {/* mobile view */}
              {markets.map((row) => {
                return (
                  <Widget
                    src={`${config.ownerId}/widget/Lendle.Card.CardContainer`}
                    props={{
                      children: [
                        <Widget
                          src={`${config.ownerId}/widget/Lendle.Card.CardsBody`}
                          props={{
                            config,
                            children: [
                              <Widget
                                src={`${config.ownerId}/widget/Lendle.Card.TokenWrapper`}
                                props={{
                                  children: row.underlyingAsset
                                    ? [
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
                                      ]
                                    : [],
                                }}
                              />,
                              <Widget
                                src={`${config.ownerId}/widget/Lendle.Card.CardDataWrapper`}
                                props={{
                                  children: row.underlyingAsset
                                    ? [
                                        <div className="card-data-row">
                                          <div className="card-data-key">
                                            Market size
                                          </div>
                                          <div className="card-data-value">
                                            <div>
                                              {Number(
                                                row.totalDepositBalanceUSD /
                                                  row.marketReferencePriceInUsd
                                              ).toFixed(0)}
                                            </div>
                                            <div className="card-data-usd-price">
                                              ${" "}
                                              {Number(
                                                row.totalDepositBalanceUSD
                                              ).toFixed(0)}
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
                                        <div className="card-data-row">
                                          <div className="card-data-key">
                                            Borrow APY
                                          </div>
                                          <div className="card-data-value">{`${(
                                            Number(row.variableBorrowAPY) * 100
                                          ).toFixed(2)} %`}</div>
                                        </div>,
                                        <div className="card-data-row">
                                          <div className="card-data-key">
                                            Total borrowed
                                          </div>
                                          <div className="card-data-value">
                                            <div>
                                              {Number(
                                                row.totalBorrowBalanceUSD /
                                                  row.marketReferencePriceInUsd
                                              ).toFixed(0)}
                                            </div>
                                            <div className="card-data-usd-price">
                                              ${" "}
                                              {Number(
                                                row.totalBorrowBalanceUSD
                                              ).toFixed(0)}
                                            </div>
                                          </div>
                                        </div>,
                                      ]
                                    : [],
                                }}
                              />,
                              // <VestButton data={row} />,
                            ],
                          }}
                        />,
                        <Widget
                          src={`${config.ownerId}/widget/Lendle.Card.Divider`}
                          props={{ config }}
                        />,
                      ],
                    }}
                  />
                );
              })}
            </>
          ),
      }}
    />
    {/* {showVestModal && (
      <Widget
        src={`${config.ownerId}/widget/Lendle.Modal.VestModal`}
        props={{
          config,
          onRequestClose: () => setShowVestModal(false),
          data: {
            ...state.data,
            healthFactor,
          },
          onActionSuccess,
          chainId,
          depositETHGas,
          depositERC20Gas,
          formatHealthFactor,
        }}
      />
    )} */}
  </>
);
