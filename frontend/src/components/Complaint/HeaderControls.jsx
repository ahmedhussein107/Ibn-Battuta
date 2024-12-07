import React from "react";
import "./HeaderControls.css";
import SortIcon from "@mui/icons-material/Sort";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import ComplaintFormPopup from "./NewComplaintPopUp";
import { useState } from "react";
import Cookies from "js-cookie";
import Button from "../Button";
const HeaderControls = ({ onFilterChange, selectedFilter, onSort, isSorted }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <div className="admin-control">
                <div className="filter-buttons">
                    {["all", "pending", "resolved"].map((filter) => (
                        <Button
                            key={filter}
                            handleClick={() => onFilterChange(filter)}
                            text={filter.charAt(0).toUpperCase() + filter.slice(1)}
                            height="4vh"
                            stylingMode={
                                selectedFilter === filter ? "always-dark" : "always-light"
                            }
                        ></Button>
                    ))}
                </div>
                {Cookies.get("userType") === "admin" ? (
                    <div className="sort-div">
                        <Button
                            handleClick={onSort}
                            text="Sort by Date"
                            stylingMode="always-light"
                            height="4vh"
                            icon={
                                <SortIcon
                                    sx={{ marginRight: "5px", verticalAlign: "middle" }}
                                />
                            }
                        ></Button>
                    </div>
                ) : (
                    <>
                        <Button
                            handleClick={() => setIsCreateOpen(true)}
                            text="File a Complaint"
                            stylingMode="always-light"
                            height="4vh"
                            icon={
                                <AddCircleOutlineSharpIcon
                                    sx={{ marginRight: "5px", verticalAlign: "middle" }}
                                />
                            }
                        ></Button>

                        <ComplaintFormPopup
                            isOpen={isCreateOpen}
                            setIsOpen={setIsCreateOpen}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default HeaderControls;
