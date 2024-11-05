import ReviewsSection from "./ReviewsSection";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const ItineraryDetails = () => {
    const reviews = [
        {
            reviewer: "Roba Hesham",
            rating: 5,
            comment: "Great experience!",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Ahmed Hussein",
            rating: 3,
            comment: "Not bad",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Arwa hatem",
            rating: 3,
            comment: "Could be better",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Hana Elmalah",
            rating: 5,
            comment: "Wow!",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Ahmed kamal",
            rating: 3,
            comment: "Codeforces is much better",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Ahmed Yasser",
            rating: 4,
            comment: "Okay expersience",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Ahmed El-Gohary",
            rating: 1,
            comment: "I hope you like this component",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Rahaf Alfarrash",
            rating: 5,
            comment: "Great experience!",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Rofaeil Samuel",
            rating: 5,
            comment: "Gamed ya Gohary",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
        {
            reviewer: "Abdelrahim Abdelazim",
            rating: 2,
            comment: "My component is better",
            createdAt: "2024-11-02T08:57:38.000Z",
        },
    ];

    return (
        <div>
            <div>
                {/* <ReviewsSection reviews={reviews} width={"30%"} height={"50%"} fontSize={"10px"}/> */}

            </div>
        </div>
    );
};

export default ItineraryDetails;
