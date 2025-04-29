import CurrencyList from 'currency-list';

// 10 most common currencies
const COMMON_CURRENCY_CODES = [
  'USD', // US Dollar
  'EUR', // Euro
  'GBP', // British Pound
  'JPY', // Japanese Yen
  'CNY', // Chinese Yuan
  'AUD', // Australian Dollar
  'CAD', // Canadian Dollar
  'MYR', // Ringgit
  'HKD', // Hong Kong Dollar
  'SGD', // Singapore Dollar
];

class CommonCurrencyList {
  /**
   * Returns information about a specific currency
   * @param code Currency code (e.g. USD, EUR)å
   * @param locale Optional locale (defaults to en_US)
   * @returns Currency information or undefined if not in common list
   */
  static get(code: string, locale: string = 'en') {
    if (!COMMON_CURRENCY_CODES.includes(code)) {
      return CurrencyList.get('USD', locale); // TODO: Remove this line after all currency become supported ones
      throw new Error(
        `Currency code ${code} is not in the common currency list`
      );
    }
    return CurrencyList.get(code, locale);
  }

  /**
   * Returns all common currencies
   * @param locale Optional locale (defaults to en_US)
   * @returns Object containing all common currencies
   */
  static getAll(locale: string = 'en_US') {
    const allCurrencies = CurrencyList.getAll(locale);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredCurrencies: Record<string, any> = {};

    COMMON_CURRENCY_CODES.forEach((code) => {
      if (allCurrencies[code]) {
        filteredCurrencies[code] = allCurrencies[code];
      }
    });

    return filteredCurrencies;
  }

  /**
   * Returns array of common currency codes
   * @returns Array of currency codes
   */
  static getCodes() {
    return [...COMMON_CURRENCY_CODES];
  }
}

export default CommonCurrencyList;
