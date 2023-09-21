const { children, loading, config, disabled, ...properties } = props;

const PrimaryButton = styled.button`
  border: 0;

  color: white;
  background: ${loading || disabled ? "#E9D7FE" : "#FFFFFF20"};
  border-radius: 8px;
  border: 1px solid #FFF;

  height: 48px;
  width: 100%;

  font-size: 16px;
  font-weight: bold;

  transition: all 0.3s ease;

  &:disabled {
    cursor: not-allowed;
  }
`;

const Loading = () => (
  <img
    width={40}
    height={20}
    src={`${config.ipfsPrefix}/bafkreib3s7t6npgjqrplyduxbcrnpx7rnncxzgmsgp5smo3byms272jkgm`}
  />
);

return (
  <PrimaryButton disabled={loading || disabled} {...properties}>
    {loading ? <Loading /> : children}
  </PrimaryButton>
);
