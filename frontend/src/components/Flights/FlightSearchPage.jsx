import FlightSearchFields from "./FlightSearchFields";
import FlightCard from "./FlightCard";
import FlightList from "./FlightList";
const FlightSearchPage = ({
    keyword,
    setKeyword,
    keyword2,
    setKeyword2,
    startDate,
    setStartDate,
    returnDate,
    setReturnDate,
    setDepartureAirport,
    setArrivalAirport,
    adults,
    setAdults,
    children,
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
                keyword={keyword}
                setKeyword={setKeyword}
                keyword2={keyword2}
                setKeyword2={setKeyword2}
                startDate={startDate}
                setStartDate={setStartDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
                setDepartureAirport={setDepartureAirport}
                setArrivalAirport={setArrivalAirport}
                adults={adults}
                setAdults={setAdults}
                children={children}
                setChildren={setChildren}
                handleSearch={handleSearch}
                isLoading={isLoading}
                error={error}
            />

            <FlightList
                flightOffers={flightOffers}
                airlines={airlines}
                handleView={handleView}
            />
        </div>
    );
};

export default FlightSearchPage;
