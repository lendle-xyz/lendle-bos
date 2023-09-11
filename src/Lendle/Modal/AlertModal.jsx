const { config, onRequestClose } = props;

const AlertModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 32px;
`;

const Right = () => (
  <img
    style={{ marginBottom: "12px" }}
    src={`${config.ipfsPrefix}/bafkreigjsujyien6eb5ml3hmfigwwcgkse3emc2e6fkdhwzjp7yw7zue3u`}
    width={80}
    height={80}
  />
);

return (
  <Widget
    src={`${config.ownerId}/widget/Lendle.Modal.BaseModal`}
    props={{
      title: "",
      onRequestClose,
      children: (
        <AlertModalContainer>
          <Right />
          <Title>{props.title}</Title>
          <Description>{props.description}</Description>
          <Widget
            src={`${config.ownerId}/widget/Lendle.PrimaryButton`}
            props={{
              config,
              children: "Ok, Close",
              onClick: onRequestClose,
            }}
          />
        </AlertModalContainer>
      ),
      config,
    }}
  />
);
