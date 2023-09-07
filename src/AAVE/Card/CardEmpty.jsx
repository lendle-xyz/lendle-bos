const { config } = props;

const CardEmpty = styled.div`
  min-height: 220px;

  font-size: 14px;

  display: grid;
  place-content: center;
`;

return (
  <>
    <Widget
      src={`${config.ownerId}/widget/AAVE.Card.Divider`}
      props={{ config }}
    />
    <CardEmpty>{props.children}</CardEmpty>
  </>
);
