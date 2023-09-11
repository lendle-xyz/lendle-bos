const {
  config,
  yourBorrows,
  showRepayModal,
  showBorrowModal,
  setShowRepayModal,
  setShowBorrowModal,
  onActionSuccess,
  chainId,
  repayETHGas,
  repayERC20Gas,
  borrowETHGas,
  borrowERC20Gas,
  formatHealthFactor,
} = props;

State.init({
  data: undefined,
});

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

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

const RepayButton = ({ data }) => (
  <Widget
    src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
    props={{
      config,
      children: "Repay",
      onClick: () => {
        State.update({ data });
        setShowRepayModal(true);
      },
    }}
  />
);

if (!yourBorrows) {
  return <div />;
}

const { debts, ...yourBorrowsCommonParams } = yourBorrows;

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
        title: "Your borrows",
        body: (
          <>
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
                                      <div className="card-data-key">Debt</div>
                                      <div className="card-data-value">
                                        <div>
                                          {Number(row.variableBorrows).toFixed(
                                            7
                                          )}
                                        </div>
                                        <div>
                                          ${" "}
                                          {Number(
                                            row.variableBorrowsUSD
                                          ).toFixed(2)}
                                        </div>
                                      </div>
                                    </div>,
                                    <div className="card-data-row">
                                      <div className="card-data-key">APY</div>
                                      <div className="card-data-value">{`${(
                                        Number(row.variableBorrowAPY) * 100
                                      ).toFixed(2)} %`}</div>
                                    </div>,
                                  ],
                                }}
                              />,
                              <ButtonGroup>
                                <RepayButton
                                  data={{ ...row, ...yourBorrowsCommonParams }}
                                />
                                <BorrowButton
                                  data={{
                                    ...row,
                                    ...yourBorrowsCommonParams,
                                  }}
                                />
                              </ButtonGroup>,
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
                    headers: ["Asset", "Debt", "APY", ""],
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
                          <div>{Number(row.variableBorrows).toFixed(7)}</div>
                          <div>
                            $ {Number(row.variableBorrowsUSD).toFixed(2)}
                          </div>
                        </div>,
                        `${(Number(row.variableBorrowAPY) * 100).toFixed(2)} %`,
                        <ButtonGroup>
                          <RepayButton
                            data={{ ...row, ...yourBorrowsCommonParams }}
                          />
                          <BorrowButton
                            data={{
                              ...row,
                              ...yourBorrowsCommonParams,
                            }}
                          />
                        </ButtonGroup>,
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
    {showRepayModal && (
      <Widget
        src={`${config.ownerId}/widget/Lendle.Modal.RepayModal`}
        props={{
          config,
          onRequestClose: () => setShowRepayModal(false),
          data: state.data,
          onActionSuccess,
          onlyOneBorrow: debts.length === 1,
          chainId,
          repayETHGas,
          repayERC20Gas,
          formatHealthFactor,
        }}
      />
    )}
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
