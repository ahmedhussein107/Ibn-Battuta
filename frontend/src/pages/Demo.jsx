import React, { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
const steps = [
    {
        image: "/iti/1.png",
        description: "Select Explore and then Itineraries",
        title: "Open Home",
    },
    {
        image: "/iti/2.png",
        description: "Choose itinerary you want to book",
        title: "Explore Itineraries",
    },
    {
        image: "/iti/3.png",
        description: "Explore images, availability, dates and included Activities",
        title: "Explore itinerary details",
    },
    {
        image: "/iti/4.png",
        description: "Hear from the travelers about their experience",
        title: "Ratings",
    },
    {
        image: "/iti/5.png",
        description: "Click Book, a Popup will appear",
        title: "Booking",
    },
    {
        image: "/iti/6.png",
        description: "Fill the form and click Book",
        title: "Complete Booking",
    },
];
const Demo = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                width: "50%",
                height: "100%",
                margin: "auto",

                marginTop: "15vh",
                marginBottom: "5vh",

                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <iframe
                src="https://scribehow.com/embed/Booking_a_Sunrise_Adventure_Getaway_Online__1tFBATtTTNmVyXQ0Tv7-CA"
                width="100%"
                height="640"
                allowfullscreen
                frameborder="0"
            ></iframe>

            {/* <h2 style={{ marginBottom: "20px" }}>{steps[currentStep].title}</h2>
            <img
                src={steps[currentStep].image}
                alt={`Step ${currentStep + 1}`}
                style={{
                    maxWidth: "100%",
                    height: "500px",
                    width: "90%",
                    borderRadius: "10px",
                    marginBottom: "20px",
                }}
            />
            <p style={{ marginBottom: "20px" }}>{steps[currentStep].description}</p>
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button
                    stylingMode="dark-when-hovered"
                    disabled={currentStep === 0}
                    text="Previous"
                    customStyle={{
                        height: "4vh",
                        borderRadius: "60px",
                        padding: "10px",
                        width: "100px",
                    }}
                    handleClick={prevStep}
                />
                <Button
                    stylingMode="always-dark"
                    disabled={currentStep === steps.length - 1}
                    text={currentStep === steps.length - 1 ? "Done" : "Next"}
                    customStyle={{
                        borderRadius: "60px",
                        padding: "10px",
                        height: "4vh",
                        width: "100px",
                    }}
                    handleClick={
                        currentStep === steps.length - 1
                            ? () => {
                                  navigate("/tourist");
                              }
                            : nextStep
                    }
                />
            </div> */}
        </div>
    );
};

export default Demo;
