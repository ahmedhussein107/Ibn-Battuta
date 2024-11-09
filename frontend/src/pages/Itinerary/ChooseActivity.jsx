// import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChooseActivity = () => {
    const location = useLocation();
    const {
        name,
        language,
        description,
        date,
        time,
        pickupLocationlatitude,
        pickupLocationlongitude,
        dropOffLocationlatitude,
        dropOffLocationlongitude,
        tags,
        accessibilityTypes,
        price,
    } = location.state;

    console.log(
        name,
        language,
        description,
        date,
        time,
        pickupLocationlatitude,
        pickupLocationlongitude,
        dropOffLocationlatitude,
        dropOffLocationlongitude,
        tags,
        accessibilityTypes,
        price
    );
};

export default ChooseActivity;
