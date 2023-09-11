const CardContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    display: none;
  }
`;

return <CardContainer>{props.children}</CardContainer>;
