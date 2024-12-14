import React from "react";
import "./AdminControls.css";
import SortIcon from "@mui/icons-material/Sort";

const AdminControls = ({ onFilterChange, selectedFilter, onSort, isSorted }) => {
    return (
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
            <div className="sort-div">
                <button className={isSorted ? "selected" : ""} onClick={onSort}>
                    <SortIcon sx={{ marginRight: "5px", verticalAlign: "middle" }} />
                    Sort by Date
                </button>
            </div>
        </div>
    );
};

export default AdminControls;
