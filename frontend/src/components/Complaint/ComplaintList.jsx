import React, { useState, useEffect } from "react";
import ComplaintCard from "./ComplaintCard";
import HeaderControls from "./HeaderControls";
import "./ComplaintList.css";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../Pagination";
import Button from "../Button";
import Cookies from "js-cookie";
import usePageHeader from "../Header/UseHeaderPage";
import Footer from "../Footer";
const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [isSorted, setIsSorted] = useState(false);
    const itemsPerPage = 4;
    const userType = Cookies.get("userType") || "Tourist";
    usePageHeader("/complaints.png", "Complaints Page");

    useEffect(() => {
        console.log(
            "currentPage:",
            currentPage,
            "selectedFilter:",
            selectedFilter,
            "isSorted:",
            isSorted
        );
        fetchComplaints(currentPage);
        console.log("Here at useEffect:");
    }, [currentPage, selectedFilter, isSorted]);

    const handleSort = () => {
        setIsSorted(!isSorted);

        const sortedComplaints = [...complaints].sort((a, b) => {
            if (isSorted) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                // Sort ascending if currently sorted in descending order
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });

        setComplaints(sortedComplaints);
    };
    const handleFilter = (newFilter) => {
        setSelectedFilter(newFilter);
    };

    const fetchComplaints = async (page) => {
        try {
            const response = await axiosInstance.get(
                `complaint/getSomeComplaints?page=${page}&limit=${itemsPerPage}&isSorted=${isSorted}&status=${selectedFilter}`,
                { withCredentials: true }
            );
            console.log("response 1");
            setComplaints(response.data.complaints);
            setTotalPages(response.data.totalPages);
            console.log("response 2");
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        }
    };
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="complaint-list-container">
            <HeaderControls
                onFilterChange={handleFilter}
                selectedFilter={selectedFilter}
                onSort={handleSort}
                isSorted={isSorted}
            />
            <div className="header-controls-seprator"></div>

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
            <Footer />
        </div>
    );
};

export default ComplaintList;
