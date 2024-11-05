import React from "react";
import "./ViewSingleComplaint.css";
import ComplaintCard from "./ComplaintCard";
import { useParams, useEffect, useState } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
const ViewSingleComplaint = () => {
    const { complaintId } = useParams();
    const [complaint, setComplaint] = useState({});
    useEffect(() => {
        axiosInstance.get(`/complaint/${complaintId}`).then((res) => {
            setComplaint(res.data);
        });
    }, []);
    return (
        <div className="complaint-container">
            <ComplaintCard />
        </div>
    );
};
export default ViewSingleComplaint;
