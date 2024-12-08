import { useQuery, QueryClient } from "@tanstack/react-query";
import { getExchangeRates } from "../api/currency";

// Create a client with persistent caching
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 24 * 60 * 60 * 1000, // Data is fresh for 24 hours
            gcTime: 24 * 60 * 60 * 1000, // Keep data in cache for 24 hours
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1, // Retry once on failure
        },
    },
});

// Custom hook for currency conversion
export const useCurrencyConverter = (selectedCurrency = "EGP") => {
    const { data, isLoading, error, refetch } = useQuery({
        // Add a timestamp to ensure unique key but minimal refetching
        queryKey: ["exchangeRates", new Date().toDateString()],
        queryFn: getExchangeRates,
        // Use persistent storage to maintain rates across sessions
        persistence: {
            name: "exchangeRates",
            storage: localStorage,
        },
    });

    const convertPrice = (
        amount,
        fromCurrency = "EGP",
        toCurrency = selectedCurrency
    ) => {
        if (!data) return amount;

        const rates = data;
        const scaledAmount = 100 * 100 * amount;
        // Convert to EGP first (if not already in EGP)
        const inEGP =
            fromCurrency === "EGP" ? scaledAmount : scaledAmount / rates[fromCurrency];

        // Convert from USD to target currency
        return Math.round((inEGP * rates[toCurrency]) / 100) / 100;
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
