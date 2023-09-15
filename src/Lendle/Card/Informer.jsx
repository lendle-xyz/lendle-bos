const { config, title, data } = props;

const BodyWrapper = styled.div`
  min-height: 28px;
  margin: 3px 6px;
  padding: 0 6px;
  border: 1px solid #FFFFFF10;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF50;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DataWrapper = styled.div`
  margin-left: 6px;
  font-weight: 700;
  color: #FFFFFF;
`;

return (
    <BodyWrapper>
      {title}
      <DataWrapper>{data}</DataWrapper>
    </BodyWrapper>
);
