import React, { useState, useEffect } from "react";
import ComplaintCard from "./ComplaintCard";
import "./ComplaintList.css";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../Pagination";
const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 2;

    useEffect(() => {
        console.log("initializing Complaints");
        fetchComplaints(currentPage);
    }, []);
    useEffect(() => {
        console.log("i entered useEffect");
        fetchComplaints(currentPage);
    }, [currentPage]);

    const fetchComplaints = async (page) => {
        try {
            const response = await axiosInstance.get(
                `complaint/getSomeComplaints?page=${page}&limit=${itemsPerPage}`,
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
            <div className="complaint-grid">
                {complaints.map((complaint) => (
                    <ComplaintCard key={complaint._id} complaint={complaint} />
                ))}
            </div>
            <div className="pagination-container">
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ComplaintList;
