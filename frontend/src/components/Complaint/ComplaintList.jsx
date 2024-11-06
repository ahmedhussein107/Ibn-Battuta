import React, { useState, useEffect } from "react";
import ComplaintCard from "./ComplaintCard";
import AdminControls from "./AdminControls";
import ComplaintFormPopup from "./NewComplaintPopUp";
import "./ComplaintList.css";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../Pagination";

import Button from "../Button";
import Cookies from "js-cookie";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [isSorted, setIsSorted] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const itemsPerPage = 4;
    const userType = Cookies.get("userType") || "Admin";

    useEffect(() => {
        fetchComplaints(currentPage);
        console.log("Here at useEffect:");
    }, [currentPage, isSorted, selectedFilter]);
    const handleSort = () => {
        setIsSorted(!isSorted);
        //handle sorting;
    };
    const handleFilter = (newFilter) => {
        setSelectedFilter(newFilter);
    };

    const fetchComplaints = async (page) => {
        try {
            const response = await axiosInstance.get(
                `complaint/getSomeComplaints?page=${page}&limit=${itemsPerPage}&isSorted=${isSorted}&status=${selectedFilter}`,
                { withCredientials: true }
            );
            setComplaints(response.data.complaints);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        }
    };
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="complaint-list-container">
            {userType === "Admin" && (
                <AdminControls
                    onFilterChange={handleFilter}
                    selectedFilter={selectedFilter}
                    onSort={handleSort}
                    isSorted={isSorted}
                />
            )}
            {userType === "Tourist" && (
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
            <div className="complaint-grid">
                {complaints.map((complaint) => (
                    <ComplaintCard
                        key={complaint._id}
                        complaint={complaint}
                        isExpanded={false}
                        setComplaint={setComplaints}
                    />
                ))}
            </div>
            <PaginationComponent
                totalPages={totalPages}
                currentPage={currentPage}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default ComplaintList;
