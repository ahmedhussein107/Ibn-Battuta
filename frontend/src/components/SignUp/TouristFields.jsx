import React from "react";
import { useState, useMemo } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./CommonForm.css";
import "./Page2.css";
import PhoneInput from "react-phone-number-input";
import { ChevronDown } from "lucide-react";

import { countries } from "../../constants/phoneNumber.constants";
import { Alert } from "@mui/material";
const PhoneNumberInput = ({ onChange, userData }) => {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [SeverError, setServerError] = useState("");
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
    };

    const handlePhoneNumberChange = (e) => {
        const input = e.target.value.replace(/\D/g, "");
        onChange({ target: { name: "mobile", value: input } });
    };

    const styles = {
        container: {
            display: "flex",
            position: "relative",
            width: "100%",
            maxWidth: "400px",
        },
        countrySelector: {
            display: "flex",
            alignItems: "center",
            padding: "8px",
            cursor: "pointer",
            position: "relative",
        },
        dropdown: {
            position: "absolute",
            top: "100%",
            left: "0",
            width: "250%",
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: "10",
            marginTop: "4px",
            overflowY: "auto",
            display: "inline-block",
            maxHeight: "200px",
        },

        dropdownItem: {
            display: "flex",
            alignItems: "center",
            padding: "8px",
            cursor: "pointer",
        },
        dropdownItemHover: {
            backgroundColor: "#f5f5f5",
        },
        input: {
            flexGrow: 1,
            padding: "8px",
            outline: "none",
            border: "1px solid #e0e0e0",
            borderRadius: "0 8px 8px 0",
        },
        grayText: {
            color: "#6b7280",
        },
    };

    return (
        <div style={styles.container}>
            {showAlert && (
                <Alert
                    severity={SeverError}
                    onClose={() => setShowAlert(false)}
                    style={{
                        position: "fixed",
                        right: "1%",
                        bottom: "1vh",
                        zIndex: 1000,
                    }}
                >
                    {alertMessage}
                </Alert>
            )}
            <div
                style={styles.countrySelector}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <span style={{ marginRight: "8px" }}>{selectedCountry.flag}</span>
                <span style={{ marginRight: "4px" }}>{selectedCountry.code}</span>
                <ChevronDown size={16} />

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div style={styles.dropdown}>
                        {countries.map((country) => (
                            <div
                                key={country.name}
                                style={{
                                    ...styles.dropdownItem,
                                    ":hover": styles.dropdownItemHover,
                                }}
                                onClick={() => handleCountrySelect(country)}
                            >
                                <span style={{ marginRight: "8px" }}>{country.flag}</span>
                                <span style={{ marginRight: "8px" }}>{country.name}</span>
                                <span style={styles.grayText}>{country.code}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Phone Number Input */}
            <input
                type="tel"
                value={userData.mobile}
                onChange={handlePhoneNumberChange}
                placeholder="Enter phone number"
                style={styles.input}
                maxLength={15}
            />
        </div>
    );
};

const MyDatePicker = ({ onChange, userData }) => {
    // Generate years from current year back to 100 years
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 100 }, (_, i) => currentYear - i);
    }, []);

    // Generate months
    const months = useMemo(
        () => [
            { value: "01", label: "January" },
            { value: "02", label: "February" },
            { value: "03", label: "March" },
            { value: "04", label: "April" },
            { value: "05", label: "May" },
            { value: "06", label: "June" },
            { value: "07", label: "July" },
            { value: "08", label: "August" },
            { value: "09", label: "September" },
            { value: "10", label: "October" },
            { value: "11", label: "November" },
            { value: "12", label: "December" },
        ],
        []
    );

    // Generate days based on selected month and year
    const days = useMemo(() => {
        const { year, month } = userData.DOB || {};
        if (!year || !month) {
            return Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
        }

        const daysInMonth = new Date(year, parseInt(month), 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) =>
            String(i + 1).padStart(2, "0")
        );
    }, [userData.DOB]);

    // Handle date selection
    const handleDateChange = (field, value) => {
        const currentDate = {
            ...userData.DOB,
            [field]: value,
        };

        // Validate date
        if (currentDate.year && currentDate.month && currentDate.day) {
            const selectedDate = new Date(
                parseInt(currentDate.year),
                parseInt(currentDate.month) - 1,
                parseInt(currentDate.day)
            );

            const today = new Date();
            const minValidDate = new Date(today.getFullYear() - 120, 0, 1);

            if (selectedDate > today) {
                setAlertMessage("Date cannot be in the future");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }

            if (selectedDate < minValidDate) {
                setAlertMessage("Please enter a valid birth date");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }
        }

        onChange({
            target: {
                name: "DOB",
                value: currentDate,
            },
        });
    };

    const CustomDropdown = ({
        value,
        options,
        onChange,
        placeholder,
        labelKey = "label",
        valueKey = "value",
    }) => {
        const [isOpen, setIsOpen] = useState(false);

        const styles = {
            container: {
                position: "relative",
                width: "100%",
                maxWidth: "120px",
                borderRadius: "8px",
                backgroundColor: "white",
                marginTop: "8px",
            },
            selector: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
            },
            dropdown: {
                position: "absolute",
                top: "100%",
                left: "0",
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 10,
                marginTop: "4px",
            },
            dropdownItem: {
                padding: "8px",
                cursor: "pointer",
                ":hover": {
                    backgroundColor: "#f5f5f5",
                },
            },
        };

        return (
            <div style={styles.container}>
                <div style={styles.selector} onClick={() => setIsOpen(!isOpen)}>
                    <span>
                        {value === placeholder
                            ? placeholder
                            : options.find((opt) => opt[valueKey] === value)?.[
                                  labelKey
                              ] || value}
                    </span>
                    <ChevronDown size={16} />
                </div>

                {isOpen && (
                    <div style={styles.dropdown} onBlur={() => setIsOpen(false)}>
                        {options.map((option) => (
                            <div
                                key={option[valueKey]}
                                style={styles.dropdownItem}
                                onClick={() => {
                                    onChange(option[valueKey]);
                                    setIsOpen(false);
                                }}
                            >
                                {option[labelKey]}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "1em",
                alignItems: "center",
            }}
        >
            <CustomDropdown
                value={userData.DOB?.day || "DD"}
                options={days.map((day) => ({ value: day, label: day }))}
                onChange={(value) => handleDateChange("day", value)}
                placeholder="DD"
            />
            <CustomDropdown
                value={userData.DOB?.month || "MM"}
                options={months}
                onChange={(value) => handleDateChange("month", value)}
                placeholder="MM"
            />
            <CustomDropdown
                value={userData.DOB?.year || "YYYY"}
                options={years.map((year) => ({ value: year, label: year }))}
                onChange={(value) => handleDateChange("year", value)}
                placeholder="YYYY"
            />
        </div>
    );
};

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
                <label
                    style={{
                        alignSelf: "flex-start",
                        marginLeft: "15%",
                    }}
                >
                    Mobile Number*
                </label>
                <PhoneNumberInput onChange={onChange} userData={userData} />
            </div>

            {/* Date of Birth Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Date of Birth*
                </label>
                <div className="date-input-group">
                    <MyDatePicker onChange={onChange} userData={userData} />
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
