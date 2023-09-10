const { config, chainId, switchNetwork, disabled } = props;

const ETH_MATIC = () => (
  <img
    height={36}
    src={`${config.ipfsPrefix}/bafkreibcyx5qsxnzwklrar7vcksny2us5ijavtfcxwlwj2plabspzenwii`}
  />
);

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: ${disabled ? "auto" : "pointer"};

  position: relative;

  .dropdown-pc {
    display: none;
    position: absolute;
    right: 0;
    top: 80px;
    min-width: 260px;

    background: #42307D;
    padding: 20px 16px;
    border-radius: 10px;
    font-size: 12px;
    z-index: 1;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  }

  .network-img {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    transition: all 0.3s ease-in-out;
  }

  .dropdown-img {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    transition: all 0.3s ease-in-out;

    transform: rotate(${() => (state.showDropdown ? "0deg" : "180deg")});
  }

  @media (min-width: 640px) {
    justify-content: center;

    img {
      height: 60px;
    }

    .network-img {
      width: 32px;
      height: 32px;
    }

    .dropdown-img {
      width: 32px;
      height: 32px;
    }

    .dropdown-pc {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .dropdown-pc-item {
      display: flex;
      align-items: center;

      div {
        margin-left: 10px;
      }
    }
  }
`;

const SwitchTitle = styled.div`
  color: white;

  font-size: 18px;
  margin-left: 8px;

  @media (min-width: 640px) {
    font-size: 36px;
    font-weight: bold;
  }
`;

const DropdownMobile = styled.div`
  position: fixed;
  z-index: 9999;

  height: 80vh;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #42307D;

  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 20px 12px;
  font-size: 12px;

  .dropdown-mobile-item {
    .dropdown-img {
      width: 32px;
      height: 32px;
    }
    font-size: 14px;
    display: flex;
    align-items: center;

    div {
      margin-left: 10px;
    }
  }

  @media (min-width: 640px) {
    display: none;
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DropdownImage = () => (
  <img
    className="dropdown-img"
    src={`${config.ipfsPrefix}/bafkreiexo22bzy2dnto7xlzee5dgz3mkb5smmpvzdgx7ed3clbw3ad3jsa`}
  />
);

const PolygonImage = () => (
  <img
    className="network-img"
    src={`${config.ipfsPrefix}/bafkreieaobutw4ibjbh7cyom4wjzjc3rx2fxs2gpfhzasgsoj5f4hjxo2m`}
  />
);

const ArbImage = () => (
  <img
    className="network-img"
    src={`${config.ipfsPrefix}/bafkreibjsp3la57lxpt2zr3eo4bz4n6hrgr6iordyopkbd4yjy2hgxdrsy`}
  />
);

const EthImage = () => (
  <img
    className="network-img"
    src={`${config.ipfsPrefix}/bafkreih7c6cip4ckunan7c3n5ckyf56mfnqmu7u5zgvxvhqvjsyf76kwxy`}
  />
);

const MantleImage = () => (
  <img
    className="network-img"
    src={
      "https://app.lendle.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FMNT.dbd5e16f.png&w=64&q=75"
    }
  />
);

const toggleDropdown = disabled
  ? () => {}
  : () => State.update({ showDropdown: !state.showDropdown });

const getChainImage = (chainId) => {
  switch (chainId) {
    case 1:
      return EthImage;
    case 5000:
      return MantleImage;
    case 42161:
      return ArbImage;
    case 137:
    case 1442:
      return PolygonImage;
    default:
      throw new Error("unknown chain id");
  }
};

const ChainImage = getChainImage(chainId);

State.init({
  showDropdown: false,
});

return (
  <SwitchContainer>
    {state.showDropdown && (
      <DropdownMobile>
        <div>Select Network</div>
        <div
          className="dropdown-mobile-item"
          onClick={() => {
            State.update({ showDropdown: false });
            switchNetwork(5000);
          }}
        >
          <MantleImage />
          <div>Mantle</div>
        </div>
      </DropdownMobile>
    )}
    <DropdownContainer onClick={toggleDropdown}>
      <ChainImage />
      <SwitchTitle>{config.chainName}</SwitchTitle>
      {!disabled && <DropdownImage />}
    </DropdownContainer>
    {state.showDropdown && (
      <div className="dropdown-pc">
        <div>Select Network</div>
        <div
          className="dropdown-pc-item"
          onClick={() => {
            State.update({ showDropdown: false });
            switchNetwork(5000);
          }}
        >
          <MantleImage />
          <div>Mantle</div>
        </div>
      </div>
    )}
  </SwitchContainer>
);
