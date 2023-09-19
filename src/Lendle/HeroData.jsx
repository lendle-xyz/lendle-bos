const {
  netWorth,
  netApy,
  healthFactor,
  showHealthFactor,
  totalValueLockedUSD,
  totalLoanOriginations,
  currentLoans,
  lendTotalSupply,
  lendCirculatingSupply,
  globalHealthFactor,
  lendlePrice
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
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr ${showHealthFactor ? "1fr" : ""};
    gap: 5px;
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
    color: #A097BE;
    @media (min-width: 640px) {
      font-size: 12px;
    }
    @media (min-width: 1024px) {
      font-size: 16px;
    }
  }
  .value {
    font-size: 18px;
    font-weight: 700;
    @media (min-width: 640px) {
      font-size: 16px;
    }
    @media (min-width: 1024px) {
      font-size: 22px;
    }
  }
  .text-green {
    color: #12B76A;
  }
`;

const numberFormat = (numberString) => {
  const number = Number(numberString)
  if (number > 1000000) {
    return (number / 1000000).toFixed(2) + "M"
  }
  if (number > 1000) {
    return (number / 1000).toFixed(2) + "K"
  }
}

const heroData = [
  {
    name: "Total Value Locked",
    value: "$ " + numberFormat(totalValueLockedUSD),
  },
  {
    name: "Total Loan Originals",
    value: "$ " + numberFormat(totalLoanOriginations),
  },
  {
    name: "Current Loan Outstanding",
    value: "$ " + numberFormat(currentLoans),
  },
  {
    name: "LEND Price",
    value: "$ " + Number(lendlePrice).toFixed(4),
  },
  {
    name: "LEND Market Cap",
    value: "$ " + numberFormat(lendTotalSupply * Number(lendlePrice)),
  },
  {
    name: "LEND Circulating Supply",
    value: numberFormat(lendCirculatingSupply),
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
