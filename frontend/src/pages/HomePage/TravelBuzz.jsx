import React from "react";
import i1 from "../../assets/backgrounds/map2.jpg";
import im1 from "../../assets/homepage/image1.png";
import im2 from "../../assets/homepage/image2.png";
import im3 from "../../assets/homepage/image3.png";
import im4 from "../../assets/homepage/image4.png";
import { useState } from "react";
const TravelBuzz = () => {
    const [isHovered, setHovered] = useState(false);
    const [isHovered1, setHovered1] = useState(false);
    const [isHovered2, setHovered2] = useState(false);
    const [isHovered3, setHovered3] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* <img
                src={i1}
                alt="Desert Background"
                style={{
                    width: "98vw",
                    height: "80vh",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            /> */}
            <h2
                style={{
                    fontSize: "2.5rem",
                    color: "#A0522D",
                    fontWeight: "bold",
                    fontFamily: "serif",
                    textAlign: "center",
                    zIndex: 1,
                    position: "absolute",
                    top: "5vh",
                    width: "100%",
                    userSelect: "none",
                }}
            >
                Latest Travel Buzz
            </h2>
            <div
                style={{
                    width: "100vw",
                    height: "90vh",
                    backgroundImage: `url(${i1})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-evenly",
                    }}
                >
                    {/* Card 1 */}
                    <div style={cardStyle}>
                        <img src={im1} alt="Explore World" style={imageStyle} />
                        <h3 style={titleStyle}>Exp World Like Never Before</h3>
                        <p style={textStyle}>
                            Discover our App activities, transforms travel
                            planning into a breeze!
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div style={cardStyle}>
                        <img
                            src={im2}
                            alt="Unleash Explorer"
                            style={imageStyle}
                        />
                        <h3 style={titleStyle}>Unleash Your Inner Explorer</h3>
                        <p style={textStyle}>
                            Find itineraries and local favorites with just a
                            tap!
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div style={cardStyle}>
                        <img
                            src={im3}
                            alt="Upcoming Plans"
                            style={imageStyle}
                        />
                        <h3 style={titleStyle}>Explore our Upcoming plans</h3>
                        <p style={textStyle}>
                            Say goodbye to overspending and hello to smart
                            travel!
                        </p>
                    </div>
                    {/* Card 4 */}
                    <div style={cardStyle}>
                        <img src={im4} alt="Gift Shop" style={imageStyle} />
                        <h3 style={titleStyle}>Gift Shop for Travel Lovers</h3>
                        <p style={textStyle}>
                            Shop unique souvenirs that scream 'I traveled!' and
                            make your friends jealous!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "10px",
    width: "17%",
    textAlign: "center",
    userSelect: "none",
};

const imageStyle = {
    width: "100%",
    height: "20vh",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "0.5rem",
    userSelect: "none",
};

const titleStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "0.5rem 0",
    color: "#333",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    userSelect: "none",
};

const textStyle = {
    fontSize: "0.9rem",
    margin: "0.5rem 0",
    color: "#555",
    height: "3rem",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    userSelect: "none",
};

const buttonStyle = {
    backgroundColor: "#A0522D",
    color: "#fff",
    border: "none",
    padding: "0.7rem 2rem",
    borderRadius: "23px",
    cursor: "pointer",
    marginTop: "5vh",
    fontSize: "1.2rem",
    transition: "background-color 0.3s ease, transform 0.2s ease",
};

const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#8B4513", // Darker shade
    transform: "scale(1.1)", // Zoom effect
};

export default TravelBuzz;
