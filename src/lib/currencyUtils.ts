import CommonCurrencyList from './commonCurrencyList';

export const formatCurrencyAmount = (amount: number, currency: string) => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  const selectedCurrency = CommonCurrencyList.get(currency);
  const formattedCurrencyAmount = `${selectedCurrency.symbol} ${amount.toFixed(selectedCurrency.decimal_digits)}`;
  return formattedCurrencyAmount;
};

export const formatCurrency = (currencyCode: string) => {
  const selectedCurrency = CommonCurrencyList.get(currencyCode);
  return selectedCurrency.symbol;
};
