const { data, config, isToggleOn } = props;

const {
  usageAsCollateralEnabledOnUser,
} = data;

State.init({
  isToggleOn: usageAsCollateralEnabledOnUser || false,
});

const Body = styled.div`
  display: flex;
  align-items: center;
`;
const Button = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 20px;
  width: 38px;
  padding: 2px 4px;
  border-radius: 10px;
  border: none;
  background-color: #12B76A;
`;
const  Switch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: none;
  height: 16px;
  width: 16px;
  background-color: #FFF;
  -webkit-box-shadow: 0px 2px 10px 0px #00000050;
  -moz-box-shadow: 0px 2px 10px 0px #00000050;
  box-shadow: 0px 2px 10px 0px #00000050;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
`;

return (
  <Body>
    <Button
      type="button"
      style={state.isToggleOn
        ? { backgroundColor: "#12B76A" }
        : { backgroundColor: "#5F4C68" }}
      onClick={() => {
        State.update({ isToggleOn: !state.isToggleOn })
        setTimeout(() => {
          State.update({ isToggleOn: !state.isToggleOn })
        }, 600)
      }}
    >
      <Switch style={state.isToggleOn
        ? { transform: "translate(14px, 0px)" }
        : { transform: "translate(0px, 0px)" }}>

      </Switch>
    </Button>
    <div style={{visibility: "hidden"}}>
      {isToggleOn === true ? (
        <div>No</div>
      ) : (
        <div>Yes</div>
      )}
    </div>
  </Body>
);
