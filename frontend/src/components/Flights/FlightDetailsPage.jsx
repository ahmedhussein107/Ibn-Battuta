import Button from "../Button";
const FlightDetailsPage = ({ handleBack, handleBook, isLoading }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "3vh 0 3vh 0",
            }}
        >
            <Button text="Back" stylingMode="2" handleClick={handleBack} />
            <Button
                text="Book"
                stylingMode="1"
                handleClick={handleBook}
                isLoading={isLoading}
            />
        </div>
    );
};

export default FlightDetailsPage;
