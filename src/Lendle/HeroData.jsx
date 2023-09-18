const {
  netWorth,
  netApy,
  healthFactor,
  showHealthFactor,
  totalValueLockedUSD,
  totalLoanOriginations,
  currentLoans,
  // lendTotalSupply,
  lendCirculatingSupply,
  globalHealthFactor
} = props;

if (!netWorth || !netApy || !healthFactor) {
  return <div />;
}

const HeroDataContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  gap: 5px;
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    width: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr ${showHealthFactor ? "1fr" : ""};
    gap: 60px;
    text-align: center;
  }
`;

const KVData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 640px) {
    width: auto;
    display: block;
  }

  .key {
    font-size: 14px;
    font-weight: 500;
    @media (min-width: 640px) {
      font-size: 14px;
    }
  }
  .value {
    font-size: 14px;
    font-weight: 700;
    @media (min-width: 640px) {
      font-size: 22px;
    }
  }
  .text-green {
    color: #12B76A;
  }
`;

const heroData = [
  {
    name: "Total Value Locked",
    value: "$ " + totalValueLockedUSD,
  },
  {
    name: "Total Loan Originals",
    value: "$ " + totalLoanOriginations,
  },
  {
    name: "Current Loan Outstanding",
    value: "$ " + currentLoans,
  },
  // {
  //   name: "LEND Market Cap",
  //   value: lendTotalSupply  + " LEND",
  // },
  {
    name: "LEND Circulating Supply",
    value: lendCirculatingSupply  + " LEND",
  },
  showHealthFactor
    ? {
        name: "Global Health factor",
        value: globalHealthFactor + " %",
      }
    : undefined,
].filter((element) => !!element);

return (
  <HeroDataContainer>
    {heroData.map((row) => (
      <KVData key={row.name}>
        <div className="key">{row.name}</div>
        <div
          className={[
            "value",
            row.value === "Health Factor" ? "text-green" : undefined,
          ]
            .filter((value) => !!value)
            .join(" ")}
        >
          {row.value}
        </div>
      </KVData>
    ))}
  </HeroDataContainer>
);
