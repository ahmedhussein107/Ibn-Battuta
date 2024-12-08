import React, { useState } from "react";
const steps = [
    { image: "https://picsum.photos/200", text: "Step 1" },
    { image: "https://picsum.photos/200", text: "Step 2" },
    { image: "https://picsum.photos/200", text: "Step 1" },
    { image: "https://picsum.photos/200", text: "Step 2" },
];
const Demo = () => {
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
                maxWidth: "600px",
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
                    height: "auto",
                    borderRadius: "10px",
                    marginBottom: "20px",
                }}
            />
            <p style={{ marginBottom: "20px" }}>{steps[currentStep].description}</p>
            <div style={{ display: "flex", gap: "10px" }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    style={{
                        padding: "10px 20px",
                        background: "#f0f0f0",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: currentStep === 0 ? "not-allowed" : "pointer",
                    }}
                >
                    Previous
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    style={{
                        padding: "10px 20px",
                        background: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor:
                            currentStep === steps.length - 1 ? "not-allowed" : "pointer",
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Demo;
