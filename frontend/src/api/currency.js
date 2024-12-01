import axios from "axios";
const api_key = import.meta.env.VITE_CURRENCY_RATE_API_KEY;

export const getExchangeRates = async () => {
    const baseCurrency = "EGP";
    const url = `https://v6.exchangerate-api.com/v6/${api_key}/latest/${baseCurrency}`;
    try {
        const response = await axios.get(url);
        return response.data.conversion_rates;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
};

export const convertCurrency = async (amount, from, to) => {
    const rates = await getExchangeRates(from);
    return Math.round(amount * rates[to] * 100) / 100;
};
