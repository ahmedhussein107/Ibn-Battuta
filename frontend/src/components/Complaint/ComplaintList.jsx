import React, { useState, useEffect } from "react";
import ComplaintCard from "./ComplaintCard";
import "./ComplaintList.css";
import axiosInstance from "../../api/axiosInstance";

const ComplaintList = () => {
    // const complaint = {
    //     _id: "6713e1397134712e763437de",
    //     touristID: "670442014aa7c398b29183c9",
    //     tourist: {
    //         name: "Abdelrahim",
    //         picture:
    //             "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    //     },
    //     title: "New gedann",
    //     body: "This is the new body dddddafadhsf afjadshf dahfkajsd fhjsdahfhqweifhas klfajskdfh asdfhaslkjfhasdkfhadjsf hsadfldsj hfdasfhadslf.adsfasj of the Complaint NEWWWWWWWWWWWWW",
    //     status: "pending",
    //     createdAt: "2024-10-19T16:41:29.393Z",
    //     updatedAt: "2024-10-19T23:42:16.908Z",
    //     __v: 0,
    // };
    // Pagination state
    const [complaints, setComplaints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

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

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="complaint-list-container">
            <div className="complaint-grid">
                {complaints.map((complaint) => (
                    <ComplaintCard key={complaint._id} complaint={complaint} />
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ComplaintList;
