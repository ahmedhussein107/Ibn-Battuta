import React from "react";
import "./HeaderControls.css";
import SortIcon from "@mui/icons-material/Sort";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import ComplaintFormPopup from "./NewComplaintPopUp";
import { useState } from "react";
import Cookies from "js-cookie";
const HeaderControls = ({ onFilterChange, selectedFilter, onSort, isSorted }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <div className="admin-control">
                <div className="filter-buttons">
                    {["all", "pending", "resolved"].map((filter) => (
                        <button
                            key={filter}
                            className={selectedFilter === filter ? "selected" : ""}
                            onClick={() => onFilterChange(filter)}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}{" "}
                        </button>
                    ))}
                </div>
                {Cookies.get("userType") === "admin" ? (
                    <div className="sort-div">
                        <button className={isSorted ? "selected" : ""} onClick={onSort}>
                            <SortIcon
                                sx={{ marginRight: "5px", verticalAlign: "middle" }}
                            />
                            Sort by Date
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className="create-complaint-button"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <AddCircleOutlineSharpIcon
                                sx={{ marginRight: "5px", verticalAlign: "middle" }}
                            />
                            File a Complaint
                        </button>
                        <ComplaintFormPopup
                            isOpen={isCreateOpen}
                            setIsOpen={setIsCreateOpen}
                        />
                    </>
                )}
            </div>
            <div className="admin-controls-seprator"></div>
        </>
    );
};

export default HeaderControls;
