const { gas, config } = props;

const GasEstimationContainer = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: bold;
  color: #8247e5;

  img {
    margin-right: 8px;
  }
`;
return (
  <GasEstimationContainer>
    <img
      src={`${config.ipfsPrefix}/bafkreifh4sxj4nvzy7obmfmolblviq4fqmrttigvbvvnrwv3pa2sgqvic4`}
      width={16}
      height={16}
    />
    <div>${gas}</div>
  </GasEstimationContainer>
);
