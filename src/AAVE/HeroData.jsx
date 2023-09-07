const { netWorth, netApy, healthFactor, showHealthFactor } = props;

if (!netWorth || !netApy || !healthFactor) {
  return <div />;
}

const HeroDataContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  gap: 20px;
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    width: auto;
    display: grid;
    grid-template-columns: 1fr 1fr ${showHealthFactor ? "1fr" : ""};
    gap: 90px;
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
    color: #2cffa7;
  }
`;

const heroData = [
  {
    name: "Net Worth",
    value: netWorth,
  },
  {
    name: "Net APY",
    value: netApy,
  },
  showHealthFactor
    ? {
        name: "Health Factor",
        value: healthFactor,
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
