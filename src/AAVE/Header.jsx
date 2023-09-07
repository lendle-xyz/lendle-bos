const { config } = props;

const Header = styled.div`
  padding: 18px 15px;
  background: #151718;

  display: flex;
  justify-content: space-between;

  .web3-connect {
    font-size: 12px;
    font-weight: bold;

    display: grid;
    place-content: center;

    background: #262626;
    border-radius: 5px;
    border: 0;

    color: white;
    transition: all 300ms ease-in-out;
    &:hover {
      background: #262626;
      opacity: 0.5;
    }
    &:active {
      background: #262626 !important;
    }
  }
`;

const AAVELogo = () => (
  <img
    height={25}
    src={`${config.ipfsPrefix}/bafkreihd7awu5x6evyucm4u4qpbb7ezkddsut2mra7ugjxqd4x74bpbln4`}
  />
);

return (
  <Header>
    <AAVELogo />
    <Web3Connect className="web3-connect" connectLabel="Connect Wallet" />
  </Header>
);
