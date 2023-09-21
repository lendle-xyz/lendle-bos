const {
  config,
  assetsToSupply,
  showSupplyModal,
  setShowSupplyModal,
  onActionSuccess,
  chainId,
  healthFactor,
  formatHealthFactor,
  depositETHGas,
  depositERC20Gas,
  hideTokens,
  yourSupplies,
  yourBorrows,
} = props;

State.init({
  data: undefined,
});

const TokenChain = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #6f6f6f;
  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const SupplyButton = ({ data }) => (
  <Widget
    src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
    props={{
      config,
      children: "Supply",
      onClick: () => {
        State.update({ data });
        setShowSupplyModal(true);
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
        title: "Assets to supply",
        body:
          !assetsToSupply || assetsToSupply.length === 0 ? (
            <Widget
              src={`${config.ownerId}/widget/Lendle.Card.CardEmpty`}
              props={{
                config,
                children: "Nothing supplied yet",
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
                    "Asset",
                    "Wallet Balance",
                    "Supply APY",
                    "Can be Collateral",
                    "",
                  ],
                  data: assetsToSupply.map((row) => hideTokens.includes(row.symbol) ? [] : [
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
                            <div className="token-title">{row.symbol}</div>
                            <div className="token-chain">$ {Number(row.marketReferencePriceInUsd).toFixed(2)}</div>
                          </div>,
                        ],
                      }}
                    />,
                    
                    <div>
                      <div>{Number(row.balance).toFixed(7)}</div>
                      <TokenChain>$ {row.balanceInUSD}</TokenChain>
                    </div>,
                    <div>
                      <div>
                        {`${(Number(row.supplyAPY) * 100).toFixed(2)} %`}
                      </div>
                      <TokenChain>
                        {(row.aprSupply * 100).toFixed(2)}{" % APR"}
                      </TokenChain>
                    </div>,
                    <div>
                      {(row.isIsolated ||
                        (!row.isIsolated && !row.usageAsCollateralEnabled)) &&
                        "—"}
                      {!row.isIsolated && row.usageAsCollateralEnabled && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" heigh="16"><path stroke="#12B76A" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.333 4 6 11.333 2.667 8"></path></svg>
                      )}
                    </div>,
                    <SupplyButton data={row} />,
                  ]),
                }}
              />
              {/* mobile view */}
              {assetsToSupply.map((row) => {
                if (hideTokens.includes(row.symbol)) {return null}
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
                                      <div className="token-chain">
                                        $ {Number(row.marketReferencePriceInUsd).toFixed(2)}
                                      </div>
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
                                        Wallet Balance
                                      </div>
                                      <div className="card-data-value">
                                        <div>
                                          {Number(row.balance).toFixed(7)}
                                        </div>
                                        <TokenChain>$ {row.balanceInUSD}</TokenChain>
                                      </div>
                                    </div>,
                                    <div className="card-data-row">
                                      <div className="card-data-key">
                                        Supply APY
                                        <div>
                                          Supply APR
                                        </div>
                                      </div>
                                        <div className="card-data-value">
                                          <div>
                                            {`${(Number(row.supplyAPY) * 100).toFixed(2)} %`}
                                          </div>
                                          <div>
                                            {(row.aprSupply * 100).toFixed(2)}{" %"}
                                          </div>
                                        </div>
                                    </div>,
                                    <div className="card-data-row">
                                      <div className="card-data-key">
                                        Can be Collateral
                                      </div>
                                      <div className="card-data-value">
                                        {row.isIsolated && "—"}
                                        {!row.isIsolated && (
                                          <>
                                            {row.usageAsCollateralEnabled && (
                                              <img
                                                src={`${config.ipfsPrefix}/bafkreibsy5fzn67veowyalveo6t34rnqvktmok2zutdsp4f5slem3grc3i`}
                                                width={16}
                                                height={16}
                                              />
                                            )}
                                            {!row.usageAsCollateralEnabled && (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" heigh="16"><path stroke="#12B76A" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.333 4 6 11.333 2.667 8"></path></svg>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>,
                                  ],
                                }}
                              />,
                              <SupplyButton data={row} />,
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
    {showSupplyModal && (
      <Widget
        src={`${config.ownerId}/widget/Lendle.Modal.SupplyModal`}
        props={{
          config,
          onRequestClose: () => setShowSupplyModal(false),
          data: {
            ...state.data,
            healthFactor: yourBorrows.healthFactor,
            userTotalAvailableLiquidityUSD: yourSupplies.userTotalAvailableLiquidityUSD,
            userTotalDebtUSD: yourBorrows.userTotalDebtUSD,
          },
          onActionSuccess,
          chainId,
          depositETHGas,
          depositERC20Gas,
          formatHealthFactor,
        }}
      />
    )}
  </>
);
