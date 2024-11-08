import usePageHeader from "../../components/Header/UseHeaderPage";
import backgroundImage from "../../assets/images/flightsBackgroundImage.png";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

const Flights = () => {
    usePageHeader(null, null);
    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <NavBar />
            </div>
            {/* Add your flight search form here */}
            {/* Add your flight listings here */}

            <Footer />
        </div>
    );
};

export default Flights;
