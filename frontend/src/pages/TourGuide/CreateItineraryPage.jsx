import React, { useState } from "react";

import Step1 from "../../components/Itinerary/Step1";
import Step2 from "../../components/Itinerary/Step2";

const CreateItineraryPage = () => {
    const [step, setStep] = useState(2); // TODO: step1 should be the default

    return (
        <>
            {step === 1 && <Step1 setStep={setStep} />}
            {step === 2 && <Step2 setStep={setStep} />}
        </>
    );
};

export default CreateItineraryPage;
