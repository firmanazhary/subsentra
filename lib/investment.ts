
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

export function formatInvestmentCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
