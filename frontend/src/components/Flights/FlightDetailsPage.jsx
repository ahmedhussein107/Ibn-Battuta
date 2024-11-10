import Button from "../Button";
const FlightDetailsPage = ({ handleBack, handleBook }) => {
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
            <Button text="Book" stylingMode="1" handleClick={handleBook} />
        </div>
    );
};

export default FlightDetailsPage;
