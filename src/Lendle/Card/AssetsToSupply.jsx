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
} = props;

State.init({
  data: undefined,
});

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
                  data: assetsToSupply.map((row) => [
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
                            <div className="token-chain">{row.name}</div>
                          </div>,
                        ],
                      }}
                    />,
                    <div>
                      <div>{Number(row.balance).toFixed(7)}</div>
                      <div>$ {row.balanceInUSD}</div>
                    </div>,
                    `${(Number(row.supplyAPY) * 100).toFixed(2)} %`,
                    <div style={{ paddingLeft: "50px" }}>
                      {(row.isIsolated ||
                        (!row.isIsolated && !row.usageAsCollateralEnabled)) &&
                        "—"}
                      {!row.isIsolated && row.usageAsCollateralEnabled && (
                        <img
                          src={`${config.ipfsPrefix}/bafkreibsy5fzn67veowyalveo6t34rnqvktmok2zutdsp4f5slem3grc3i`}
                          width={16}
                          height={16}
                        />
                      )}
                    </div>,
                    <SupplyButton data={row} />,
                  ]),
                }}
              />
              {/* mobile view */}
              {assetsToSupply.map((row) => {
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
                                        {row.name}
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
                                        <div>$ {row.balanceInUSD}</div>
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
                                              <img
                                                src={`${config.ipfsPrefix}/bafkreie5skej6q2tik3qa3yldkep4r465poq33ay55uzp2p6hty2ifhkmq`}
                                                width={16}
                                                height={16}
                                              />
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
            healthFactor,
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
