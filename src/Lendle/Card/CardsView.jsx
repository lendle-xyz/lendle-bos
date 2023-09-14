const { title, body, style, config, headerData } = props;

const CardsContainer = styled.div`
  border-radius: 10px;
  background: #42307D;

  padding: 18px 0;
`;

const CardsTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 14px;
  color: white;
  font-size: 14px;
  font-weight: 800;
`;

const InformerContainer = styled.div`
  display: flex;
  padding: 0 14px;
  color: white;
  font-size: 14px;
  font-weight: 800;
`;

return (
  <CardsContainer style={style}>
    <CardsTitle>
      {title}
      <InformerContainer>{headerData}</InformerContainer>
    </CardsTitle>
    {body}
  </CardsContainer>
);
