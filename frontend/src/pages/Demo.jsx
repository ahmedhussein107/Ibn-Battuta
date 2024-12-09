import React, { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
const steps = [
    { image: "/room1.jpeg", description: "Step 1", title: "step 1" },
    { image: "/room2.jpeg", description: "Step 2", title: "step 1" },
    { image: "/room3.jpeg", description: "Step 1", title: "step 1" },
    { image: "/room4.jpeg", description: "Step 2", title: "step 1" },
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
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h2 style={{ marginBottom: "20px" }}>{steps[currentStep].title}</h2>
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
            </div>
        </div>
    );
};

export default Demo;
