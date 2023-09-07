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
    color: #777790;
    font-size: 15px;
    font-weight: 500;
  }
  .card-data-value {
    font-size: 15px;
    font-weight: bold;
    text-align: right;
  }
`;

return <DataWrapper>{props.children}</DataWrapper>;
