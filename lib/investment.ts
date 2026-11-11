export type InvestmentProjection = {
  month: number;
  year: number;
  contributed: number;
  investmentValue: number;
  profit: number;
};

export function calculateInvestmentGrowth(
  monthlyContribution: number,
  annualReturn: number,
  years: number
): InvestmentProjection[] {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  let balance = 0;
  let totalContributed = 0;

  const projections: InvestmentProjection[] = [
    {
      month: 0,
      year: 0,
      contributed: 0,
      investmentValue: 0,
      profit: 0,
    },
  ];

  for (let month = 1; month <= totalMonths; month++) {
    // Deposit at the end of each month
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    totalContributed += monthlyContribution;

    projections.push({
      month,
      year: month / 12,
      contributed: totalContributed,
      investmentValue: balance,
      profit: balance - totalContributed,
    });
  }

  return projections;
}

export function generateGrowthSeries(
  monthlyContribution: number,
  annualReturn: number,
  years: number
) {
  const full = calculateInvestmentGrowth(monthlyContribution, annualReturn, years);
  const yearly: {
    year: number;
    contributed: number;
    investmentValue: number;
    profit: number;
  }[] = [];

  for (let y = 1; y <= years; y++) {
    const item = full[y * 12];
    if (item) {
      yearly.push({
        year: y,
        contributed: Math.round(item.contributed),
        investmentValue: Math.round(item.investmentValue),
        profit: Math.round(item.profit),
      });
    }
  }

  return yearly;
}

export function getFinalProjection(
  monthlyContribution: number,
  annualReturn: number,
  years: number
) {
  const full = calculateInvestmentGrowth(monthlyContribution, annualReturn, years);
  const finalItem = full[full.length - 1];

  return {
    contributed: finalItem ? Math.round(finalItem.contributed) : 0,
    investmentValue: finalItem ? Math.round(finalItem.investmentValue) : 0,
    profit: finalItem ? Math.round(finalItem.profit) : 0,
  };
}

export function formatInvestmentCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
