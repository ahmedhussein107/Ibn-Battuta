import { useQuery, QueryClient } from "@tanstack/react-query";
import { getExchangeRates } from "../api/currency";

// Create a client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 24 * 60 * 60 * 1000, // Consider data fresh for 24 hours
            cacheTime: 24 * 60 * 60 * 1000, // Keep unused data in cache for 24 hours
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
        console.log("data", data);
        if (!data) return amount;

        const rates = data;
        // Convert to EGP first (if not already in EGP)
        const inEGP = fromCurrency === "EGP" ? amount : amount / rates[fromCurrency];

        // Convert from USD to target currency
        return (inEGP * rates[toCurrency]).toFixed(2);
    };

    const formatPrice = (amount, currency = selectedCurrency) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    return {
        rates: data?.rates,
        isLoading,
        error,
        convertPrice,
        formatPrice,
        refetch,
    };
};
