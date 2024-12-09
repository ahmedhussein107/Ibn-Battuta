import React from "react";
import "../Hotels/HotelsControls.css";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import { Alert, IconButton, Radio } from "@mui/material";
import { DatePicker } from "antd";
import Button from "../Button";
import FlightSearchWithRecommendation from "./FlightSearchWithRecommendation";
import { FormControl, FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
const { RangePicker } = DatePicker;
const FlightControls = ({
    keyword,
    setKeyword,
    keyword2,
    setKeyword2,
    startDate,
    setStartDate,
    returnDate,
    setReturnDate,
    departureAirport,
    setDepartureAirport,
    arrivalAirport,
    setArrivalAirport,
    adults,
    setAdults,
    children,
    setChildren,
    handleSearch,
    isLoading,
    error,
}) => {
    const [selectedValue, setSelectedValue] = useState("one way");
    const handleRangeChange = (_, dateStrings) => {
        setStartDate(dateStrings[0]);
        setReturnDate(dateStrings[1]);
    };
    function handleDateChange(date) {
        setStartDate(date);
        setReturnDate(""); // This will log the selected date
    }

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setStartDate("");
        setReturnDate("");
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                margin: "0 auto",
                borderRadius: "10px",
                backgroundColor: "#f1dbce",
                width: "100%",
                height: "fit-content",
                gap: "1vh",
            }}
        >
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="one way"
                    name="radio-buttons-group"
                    row
                    sx={{
                        marginLeft: "2vw",
                    }}
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="one way"
                        control={<Radio />}
                        label="One Way"
                        sx={{
                            "& .Mui-checked": {
                                color: "#9C4F21 !important",
                            },
                        }}
                    />
                    <FormControlLabel
                        value="return"
                        control={<Radio />}
                        label="Return"
                        sx={{
                            "& .Mui-checked": {
                                color: "#9C4F21 !important",
                            },
                        }}
                    />
                </RadioGroup>
            </FormControl>
            <div style={hotelsControlsContainer}>
                <div className="hotels-controls-search">
                    <FlightSearchWithRecommendation
                        query={keyword}
                        setQuery={setKeyword}
                        chosenCity={departureAirport}
                        setChosenCity={setDepartureAirport}
                        message={"From"}
                    />
                </div>
                <div className="hotels-controls-search">
                    <FlightSearchWithRecommendation
                        query={keyword2}
                        setQuery={setKeyword2}
                        chosenCity={arrivalAirport}
                        setChosenCity={setArrivalAirport}
                        message="To"
                    />
                </div>
                <div className="hotels-controls-date">
                    {selectedValue === "return" ? (
                        <RangePicker onChange={handleRangeChange} />
                    ) : (
                        <DatePicker onChange={handleDateChange} />
                    )}
                </div>
                <div className="hotels-controls-adult-counter">
                    <span className="icon-text">
                        <PersonIcon
                            sx={{ verticalAlign: "middle", marginRight: "5px" }}
                        />
                        <span>adult count</span>
                    </span>{" "}
                    <div className="hotels-controls-counter">
                        <IconButton
                            onClick={() => setAdults(adults - 1)}
                            disabled={adults === 1}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <span>{adults}</span>
                        <IconButton onClick={() => setAdults(adults + 1)}>
                            <AddIcon />
                        </IconButton>{" "}
                    </div>
                </div>
                <Button
                    stylingMode="always-dark"
                    text={"Search"}
                    handleClick={handleSearch}
                    isLoading={isLoading}
                    disabled={isLoading}
                    customStyle={{
                        minHieght: "70px",
                        borderRadius: "60px",
                    }}
                />
            </div>
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        width: "50%",
                        marginLeft: "25%",
                        marginBottom: "2vh",
                    }}
                >
                    {error}
                </Alert>
            )}
        </div>
    );
};

const hotelsControlsContainer = {
    display: "flex",
    justifyContent: "space-between",
    gap: "3%",
    width: "100%",
    marginLeft: "0.5vw",
    marginBottom: "2vh",
};

export default FlightControls;
