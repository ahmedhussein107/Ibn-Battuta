import React from "react";
import { useState } from "react";
import "./CommonForm.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
const TouristFields = ({ userData, onChange }) => {
    const handleDateChange = (part, value) => {
        const currentDate = userData.DOB ? userData.DOB.split("-") : ["", "", ""];
        if (part === "day") currentDate[2] = value;
        if (part === "month") currentDate[1] = value;
        if (part === "year") currentDate[0] = value;
        onChange({ target: { name: "DOB", value: currentDate.join("-") } });
    };

    return (
        <div className="common-form-step">
            {/* Mobile Number Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Mobile Number
                </label>
                <PhoneInput
                    preferredCountries={["us", "gb", "fr", "de", "it"]}
                    onChange={(value) => onChange({ target: { name: "mobile", value } })}
                    value={userData.mobileNumber || ""}
                    required
                    name="mobile"
                    className="custom-phone-input" // Add custom class for styling
                    defaultCountry="EG"
                    international
                    withCountryCallingCode
                    style={{
                        width: "420px",
                    }}
                />
            </div>

            {/* Date of Birth Input */}
            <div className="form-group" style={{ width: "420px" }}>
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Date of Birth
                </label>
                <div className="date-input-group">
                    <select
                        name="day"
                        value={userData.DOB ? userData.DOB.split("-")[2] : ""}
                        onChange={(e) => handleDateChange("day", e.target.value)}
                        required
                    >
                        <option value="">Day</option>
                        {[...Array(31).keys()].map((i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                {i + 1}
                            </option>
                        ))}
                    </select>

                    <select
                        name="month"
                        value={userData.DOB ? userData.DOB.split("-")[1] : ""}
                        onChange={(e) => handleDateChange("month", e.target.value)}
                        required
                    >
                        <option value="">Month</option>
                        {[...Array(12).keys()].map((i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                {i + 1}
                            </option>
                        ))}
                    </select>

                    <select
                        name="year"
                        value={userData.DOB ? userData.DOB.split("-")[0] : ""}
                        onChange={(e) => handleDateChange("year", e.target.value)}
                        required
                    >
                        <option value="">Year</option>
                        {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Nationality Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Nationality
                </label>
                <input
                    type="text"
                    name="nationality"
                    value={userData.nationality || ""}
                    onChange={onChange}
                    placeholder="Enter your nationality"
                    required
                />
            </div>
            {/* Address Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Address
                </label>
                <input
                    type="text"
                    name="address"
                    value={userData.address || ""}
                    onChange={onChange}
                    placeholder="Enter your address"
                    required
                />
            </div>
            {/* Job Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>Job</label>
                <input
                    type="text"
                    name="job"
                    value={userData.job || ""}
                    onChange={onChange}
                    placeholder="Enter your job"
                    required
                />
            </div>
        </div>
    );
};

export default TouristFields;
