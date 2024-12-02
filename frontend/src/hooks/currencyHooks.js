import { useQuery, QueryClient } from "@tanstack/react-query";
import { getExchangeRates } from "../api/currency";

// Create a client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1024 * 24 * 60 * 60 * 1000, // Consider data fresh for 24 hours
            cacheTime: 1024 * 24 * 60 * 60 * 1000, // Keep unused data in cache for 24 hours
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

// Custom hook for currency conversion
export const useCurrencyConverter = (selectedCurrency = "EGP") => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["exchangeRates"],
        queryFn: getExchangeRates,
    });

    const convertPrice = (
        amount,
        fromCurrency = "EGP",
        toCurrency = selectedCurrency
    ) => {
        if (!data) return amount;

        const rates = data;
        const scaledAmount = 10000 * amount;
        // Convert to EGP first (if not already in EGP)
        const inEGP =
            fromCurrency === "EGP" ? scaledAmount : scaledAmount / rates[fromCurrency];

        // Convert from USD to target currency
        return Math.floor((inEGP * rates[toCurrency]) / 100) / 100;
    };

    const formatPriceHelper = (amount, currency = selectedCurrency) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    const formatPrice = (amount, currency = selectedCurrency) => {
        return formatPriceHelper(convertPrice(amount, "EGP", currency), currency);
    };

    return {
        rates: data,
        isLoading,
        error,
        convertPrice,
        formatPrice,
        refetch,
    };
};
