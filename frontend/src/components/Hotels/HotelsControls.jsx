import React from "react";
import "./HotelsControls.css";
import SearchField from "../SearchField/SearchField";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
import { DatePicker } from "antd";
import Button from "../Button";
const { RangePicker } = DatePicker;
const HotelsControls = ({
    searchCity = "",
    setSearchCity = () => {},
    startDate = "",
    setStartDate = () => {},
    endDate = "",
    setEndDate = () => {},
    guests = 1,
    setGuests = () => {},
    onSearch = async () => {},
}) => {
    const [isSearching, setIsSearching] = useState(false);
    const handleSearch = async () => {
        console.log("i am here at handle search");
        try {
            setIsSearching(true);
            await onSearch();
        } catch (err) {
        } finally {
            setIsSearching(false);
        }
    };
    const handleRangechange = (_, dateStrings) => {
        setStartDate(dateStrings[0]);
        setEndDate(dateStrings[1]);
    };

    return (
        <div className="hotels-controls-container">
            <div className="hotels-controls-search">
                <SearchField
                    placeholder="Search by name"
                    searchText={searchCity}
                    setSearchText={setSearchCity}
                />
            </div>
            <div className="hotels-controls-date">
                <RangePicker onChange={handleRangechange} />
            </div>
            <div className="hotels-controls-adult-counter">
                <span className="icon-text">
                    <PersonIcon sx={{ verticalAlign: "middle", marginRight: "5px" }} />
                    <span>adult count</span>
                </span>{" "}
                <div className="hotels-controls-counter">
                    <IconButton
                        onClick={() => setGuests(guests - 1)}
                        disabled={guests === 1}
                    >
                        <RemoveIcon />
                    </IconButton>
                    <span>{guests}</span>
                    <IconButton onClick={() => setGuests(guests + 1)}>
                        <AddIcon />
                    </IconButton>{" "}
                </div>
            </div>
            <Button
                stylingMode="submit"
                text={"Find Hotel"}
                handleClick={handleSearch}
                isLoading={isSearching}
                disabled={isSearching}
                customStyle={{
                    width: "173px",
                    height: "3rem",
                    minHieght: "70px",
                    borderRadius: "60px",
                }}
            />
        </div>
    );
};
export default HotelsControls;
