const { config } = props;

const Header = styled.div`
  padding: 18px 15px;
  background: #42307D;
  border-bottom: 1px solid #55458A;

  display: flex;
  justify-content: space-between;

  .web3-connect {
    font-size: 12px;
    font-weight: bold;

    display: grid;
    place-content: center;

    background: #534386;
    border-radius: 8px;
    border: 1px solid #7669A1;

    color: white;
    transition: all 300ms ease-in-out;
    &:hover {
      background: #9E77ED;
    }
    &:active {
      background: #9E77ED !important;
    }
  }
`;

const LendleLogo = () => (
  <img
    height={30}
    src={`${config.ipfsPrefixLendle}/QmarDti6UVtyp4XmMD35seVnCdtaf2ZQ1HbfW9CUEKtPAC?filename=Logo.svg`}
  />
);

return (
  <Header>
    <LendleLogo />
    <Web3Connect className="web3-connect" connectLabel="Connect Wallet" />
  </Header>
);
