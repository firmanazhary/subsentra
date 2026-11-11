export type Language = "en" | "ja" | "id";
export type Currency = "USD" | "JPY" | "IDR";

export type CurrencyConfig = {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
  rateFromUSD: number;
  hasDecimals: boolean;
};

export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    rateFromUSD: 1,
    hasDecimals: true,
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    locale: "ja-JP",
    rateFromUSD: 155,
    hasDecimals: false,
  },
  IDR: {
    code: "IDR",
    symbol: "Rp",
    name: "Indonesian Rupiah",
    locale: "id-ID",
    rateFromUSD: 16000,
    hasDecimals: false,
  },
};
