import FlightSearchFields from "./FlightSearchFields";
import FlightCard from "./FlightCard";
import FlightList from "./FlightList";
import FlightControls from "./FlightControls";
const FlightSearchPage = ({
    keyword,
    setKeyword,
    keyword2,
    setKeyword2,
    startDate,
    setStartDate,
    returnDate,
    setReturnDate,
    departureAirport,
    setDepartureAirport,
    arrivalAirport,
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
            <div style={{ width: "95%", margin: "2vh auto" }}>
                <FlightControls
                    keyword={keyword}
                    setKeyword={setKeyword}
                    keyword2={keyword2}
                    setKeyword2={setKeyword2}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    returnDate={returnDate}
                    setReturnDate={setReturnDate}
                    departureAirport={departureAirport}
                    setDepartureAirport={setDepartureAirport}
                    arrivalAirport={arrivalAirport}
                    setArrivalAirport={setArrivalAirport}
                    adults={adults}
                    setAdults={setAdults}
                    children={children}
                    setChildren={setChildren}
                    handleSearch={handleSearch}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
            <FlightList
                flightOffers={flightOffers}
                airlines={airlines}
                handleView={handleView}
            />
        </div>
    );
};

export default FlightSearchPage;
