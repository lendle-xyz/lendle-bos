const {
  config,
  assetsToBorrow,
  chainId,
  onActionSuccess,
  showBorrowModal,
  setShowBorrowModal,
  yourSupplies,
  borrowETHGas,
  borrowERC20Gas,
  formatHealthFactor,
} = props;

if (!assetsToBorrow) {
  return <div />;
}

const { debts, ...assetsToBorrowCommonParams } = assetsToBorrow;

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}
State.init({
  data: undefined,
});

const BorrowButton = ({ data }) => (
  <Widget
    src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
    props={{
      config,
      children: "Borrow",
      onClick: () => {
        State.update({ data });
        setShowBorrowModal(true);
      },
    }}
  />
);

const showAlert = yourSupplies && yourSupplies.length === 0;

const AlertContainer = styled.div`
  display: flex;
  border-radius: 8px;
  background: rgba(255, 0, 0, 0.12);

  padding: 12px;
  margin: 12px;

  font-size: 12px;

  @media (min-width: 640px) {
    font-size: 16px;
  }

  img {
    margin-right: 8px;
    @media (min-width: 640px) {
      margin-top: 4px;
    }
  }
`;
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
        title: "Assets to borrow",
        body: (
          <>
            {showAlert && (
              <>
                <Widget
                  src={`${config.ownerId}/widget/Lendle.Card.Divider`}
                  props={{ config }}
                />
                <AlertContainer>
                  <img
                    src={`${config.ipfsPrefix}/bafkreih3npgn6ydscd7mzjrxredamembxhlmdxnw5l4izpfru2rbucvdly`}
                    width={16}
                    height={16}
                  />
                  <div>
                    To borrow you need to supply any asset to be used as
                    collateral.
                  </div>
                </AlertContainer>
              </>
            )}
            {!debts || debts.length === 0 ? (
              <Widget
                src={`${config.ownerId}/widget/Lendle.Card.CardEmpty`}
                props={{
                  config,
                  children: "Nothing borrowed yet",
                }}
              />
            ) : (
              <>
                {/* mobile view */}
                {debts.map((row) => (
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
                                        Available to borrow
                                      </div>
                                      <div className="card-data-value">
                                        <div>
                                          {Number(row.availableBorrows).toFixed(
                                            7
                                          )}
                                        </div>
                                        <div>
                                          ${" "}
                                          {Number(
                                            row.availableBorrowsUSD
                                          ).toFixed(2)}
                                        </div>
                                      </div>
                                    </div>,
                                    <div className="card-data-row">
                                      <div className="card-data-key">
                                        APY, variable
                                      </div>
                                      <div className="card-data-value">{`${(
                                        Number(row.variableBorrowAPY) * 100
                                      ).toFixed(2)} %`}</div>
                                    </div>,
                                  ],
                                }}
                              />,
                              <BorrowButton
                                data={{
                                  ...row,
                                  ...assetsToBorrowCommonParams,
                                }}
                              />,
                            ],
                          }}
                        />,
                      ],
                    }}
                  />
                ))}
                {/* pc view */}
                <Widget
                  src={`${config.ownerId}/widget/Lendle.Card.CardsTable`}
                  props={{
                    config,
                    headers: [
                      "Asset",
                      "Available to borrow",
                      "APY, variable",
                      "",
                    ],
                    data: debts.map((row) => {
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
                              <div>
                                <div className="token-title">{row.symbol}</div>
                                <div className="token-chain">{row.name}</div>
                              </div>,
                            ],
                          }}
                        />,
                        <div>
                          <div>{Number(row.availableBorrows).toFixed(7)}</div>
                          <div>
                            $ {Number(row.availableBorrowsUSD).toFixed(2)}
                          </div>
                        </div>,
                        `${(Number(row.variableBorrowAPY) * 100).toFixed(2)} %`,
                        <BorrowButton
                          data={{
                            ...row,
                            ...assetsToBorrowCommonParams,
                          }}
                        />,
                      ];
                    }),
                  }}
                />
              </>
            )}
          </>
        ),
      }}
    />
    {showBorrowModal && (
      <Widget
        src={`${config.ownerId}/widget/Lendle.Modal.BorrowModal`}
        props={{
          config,
          onRequestClose: () => setShowBorrowModal(false),
          data: state.data,
          onActionSuccess,
          chainId,
          borrowETHGas,
          borrowERC20Gas,
          formatHealthFactor,
        }}
      />
    )}
  </>
);
