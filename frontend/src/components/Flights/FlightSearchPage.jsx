import FlightSearchFields from "./FlightSearchFields";
import FlightCard from "./FlightCard";
const FlightSearchPage = ({
    startDate,
    setStartDate,
    returnDate,
    setReturnDate,
    setDepartureAirport,
    setArrivalAirport,
    setAdults,
    setChildren,
    handleSearch,
    isLoading,
    error,
    flightOffers,
    airlines,
    handleView,
}) => {
    return (
        <div>
            <FlightSearchFields
                startDate={startDate}
                setStartDate={setStartDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
                setDepartureAirport={setDepartureAirport}
                setArrivalAirport={setArrivalAirport}
                setAdults={setAdults}
                setChildren={setChildren}
                handleSearch={handleSearch}
                isLoading={isLoading}
                error={error}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                }}
            >
                {flightOffers.map((flightOffer, index) => (
                    <FlightCard
                        key={index}
                        trip={flightOffer}
                        airlines={airlines}
                        handleClick={() => handleView(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FlightSearchPage;
