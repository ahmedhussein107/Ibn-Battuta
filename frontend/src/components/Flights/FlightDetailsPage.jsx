import Button from "../Button";
import FlightDetails from "./FlightDetails";
const FlightDetailsPage = ({
    mode = 1,
    handleBack,
    handleBook,
    isLoading,
    flightData,
    airlines,
}) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <FlightDetails flightData={flightData} airlines={airlines} />

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "3vh 0 3vh 0",
                }}
            >
                <Button text="Back" stylingMode="2" handleClick={handleBack} />
                {mode == 1 && (
                    <Button
                        text="Book"
                        stylingMode="1"
                        handleClick={handleBook}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default FlightDetailsPage;
