const { headers, data, config } = props;

if (!headers || !data) {
  return null;
}

const CardsTable = styled.div`
  margin-top: 20px;
  padding: 0 30px;

  width: 100%;

  table {
    width: 100%;
  }

  thead {
    color: #777790;
    font-size: 14px;
    font-weight: normal;
  }
  tr td {
    width: 18%;
    padding: 15px 0;
    border-top: 1px solid #42307d;
  }
  tr td:first-child {
   width: 28%;
  }

  display: none;
  @media (min-width: 640px) {
    display: table;
  }
`;
return (
  <>
    <Widget
      src={`${config.ownerId}/widget/Lendle.Card.Divider`}
      props={{ config }}
    />
    <CardsTable>
      <table>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((rows, idx) => (
            <tr key={idx}>
              {rows.map((data, idx) => (
                <td key={idx}>{data}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardsTable>
  </>
);
