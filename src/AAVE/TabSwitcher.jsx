const { config, select, setSelect } = props;

const TabContainer = styled.div`
  background: #42307D;

  display: flex;
  padding: 4px;
  border-radius: 8px;

  margin-top: 30px;

  @media (min-width: 640px) {
    max-width: 355px;
    margin: 0 auto;
    margin-top: 50px;
  }
`;

const TabItem = styled.div`
  flex: 1;
  height: 48px;

  display: grid;
  place-content: center;
  border-radius: 4px;

  ${(props) => props.selected && "background: #FFFFFF; color: #1B0027;"}
  ${(props) =>
    props.disabled &&
    `
    opacity: 0.3;
    cursor: not-allowed;
  `}

  font-size: 16px;
  font-weight: bold;

  transition: all 0.3s ease-in-out;
  ${(props) =>
    !props.selected &&
    `
    cursor: pointer;
    &:hover {
      background: #FFFFFF;
      color: #1B0027;
      opacity: 0.7;
    }
  `}
`;

return (
  <TabContainer>
    <TabItem selected={select === "supply"} onClick={() => setSelect("supply")}>
      Supply
    </TabItem>
    <TabItem selected={select === "borrow"} onClick={() => setSelect("borrow")}>
      Borrow
    </TabItem>
  </TabContainer>
);
