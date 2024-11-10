import React from "react";
import SearchField from "../../components/SearchField/SearchField";
import Button from "../../components/Button";
import AddIcon from "@mui/icons-material/Add";
import "./UserManagement.css";
import { useState } from "react";
const ActionButtons = ({ searchText, setSearchText, isAll, setIsOpen, setUserType }) => {
    return (
        <div className="admin-search-buttons">
            <div className="admin-search-container">
                <SearchField
                    placeholder="Search by name"
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </div>

            <div className="admin-create-buttons">
                <Button
                    stylingMode="2"
                    text={"Add Admin"}
                    handleClick={() => {
                        setUserType("Admin");
                        setIsOpen(true);
                    }}
                    isLoading={false}
                    customStyle={{
                        borderRadius: "60px",
                        border: "2px solid black",
                        textAlign: "center",
                    }}
                    icon={
                        <AddIcon sx={{ verticalAlign: "middle", marginRight: "5px" }} />
                    }
                />

                <Button
                    stylingMode="2"
                    text={"Add Governor"}
                    handleClick={() => {
                        setUserType("Governor");
                        setIsOpen(true);
                    }}
                    isLoading={false}
                    customStyle={{
                        borderRadius: "60px",
                        border: "2px solid black",
                        textAlign: "center",
                    }}
                    icon={
                        <AddIcon
                            sx={{
                                verticalAlign: "middle",
                                marginRight: "5px",
                            }}
                        />
                    }
                />
            </div>
        </div>
    );
};

export default ActionButtons;
