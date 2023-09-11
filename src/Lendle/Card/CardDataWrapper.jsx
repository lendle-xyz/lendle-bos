const DataWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .card-data-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .card-data-key {
    color: hsla(0,0%,100%,.6);
    font-size: 15px;
    font-weight: 500;
  }
  .card-data-value {
    font-size: 15px;
    font-weight: bold;
    text-align: right;
  }
  .card-data-usd-price {
    color: hsla(0,0%,100%,.6);
  }
`;

return <DataWrapper>{props.children}</DataWrapper>;
