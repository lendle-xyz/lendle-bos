const FlexBetweenContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

return (
  <FlexBetweenContainer>
    <div>{props.left}</div>
    <div>{props.right}</div>
  </FlexBetweenContainer>
);
