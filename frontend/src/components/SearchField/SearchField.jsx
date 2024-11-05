import React, { useState } from "react";
import propTypes from "prop-types";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "./SearchField.css";

const SearchField = ({ placeholder, searchText, setSearchText }) => {
    const handleClear = () => {
        setSearchText("");
    };

    return (
        <TextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={placeholder}
            variant="outlined"
            sx={{
                "& .MuiInputBase-input": {
                    padding: "1vw 5vh",
                    backgroundColor: "white",
                    borderRadius: "5vh",
                    height: "3vh",
                    width: "9vw",
                    margin: "1vh 0",
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <div style={{ cursor: "pointer" }}>
                            <SearchIcon sx={{ fontSize: "5vh", marginTop: "1vh" }} />
                        </div>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClear}
                            style={{ visibility: searchText ? "visible" : "hidden" }}
                        >
                            <ClearIcon sx={{ fontSize: "3vh" }} />
                        </IconButton>
                    </InputAdornment>
                ),
                classes: {
                    notchedOutline: "custom-outline",
                },
            }}
            fullWidth
            className="search-field"
        />
    );
};

SearchField.propTypes = {
    setSearchText: propTypes.func.isRequired,
    placeholder: propTypes.string,
};

SearchField.defaultProps = {
    placeholder: "Search",
};

export default SearchField;
