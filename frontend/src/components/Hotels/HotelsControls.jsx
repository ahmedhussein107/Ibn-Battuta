import React from "react";
import "./HotelsControls.css";
import SearchField from "../SearchField/SearchField";
import DatePicker from "../DatePicker";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
const HotelsControls = ({
    searchText = "",
    setSearchText = () => {},
    startDate = "",
    setStartDate = () => {},
    endDate = "",
    setEndDate = () => {},
    guests = 1,
    setGuests = () => {},
}) => {
    return (
        <div className="hotels-controls-container">
            <div className="hotels-controls-search">
                <SearchField
                    lab="Search by Hotel city"
                    searchText={searchText}
                    setSearchText={setSearchText}
                    className="hotels-controls-search"
                />
            </div>
            <div className="hotels-controls-date">
                <DatePicker
                    label="choose start date"
                    onChange={(newValue) => setStartDate(newValue)}
                />
                <p> To</p>
                <DatePicker
                    label="choose end date"
                    onChange={(newValue) => setEndDate(newValue)}
                />
            </div>
            <div className="hotels-controls-adult-counter">
                <span className="icon-text">
                    <PersonIcon sx={{ verticalAlign: "middle", marginRight: "5px" }} />
                    <span>adult</span>
                </span>{" "}
                <div className="hotels-controls-counter">
                    <IconButton onClick={() => setGuests(guests - 1)}>
                        <RemoveIcon />
                    </IconButton>
                    <span>{guests}</span>
                    <IconButton onClick={() => setGuests(guests + 1)}>
                        <AddIcon />
                    </IconButton>{" "}
                </div>
            </div>
        </div>
    );
};
export default HotelsControls;
