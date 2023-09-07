const TokenWrapper = styled.div`
  display: flex;

  img {
    margin-right: 10px;
  }

  .token-title {
    font-size: 24px;
    font-weight: bold;
  }

  .token-chain {
    font-size: 16px;
    font-weight: 500;
    color: #6f6f6f;
  }

  @media (min-width: 640px) {
    img {
      width: 48px;
      height: 48px;
    }
    .token-title {
      font-size: 20px;
      font-weight: bold;
    }
  }
`;

return <TokenWrapper>{props.children}</TokenWrapper>;
