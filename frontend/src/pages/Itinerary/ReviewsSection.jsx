import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../api/axiosInstance";

const ReviewsSection = ({ ratingIds, width, height, fontSize }) => {
    const [reviews, setReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 3;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await Promise.all(
                    ratingIds.map(async (ratingID) => {
                        // Fetch rating details
                        const ratingResponse = await axiosInstance.get(
                            `rating/getRating/${ratingID}`
                        );
                        const rating = ratingResponse.data;

                        // Fetch tourist details
                        const touristResponse = await axiosInstance.get(
                            `tourist/tourist/${rating.touristID}`
                        );
                        const tourist = touristResponse.data;

                        // Construct review object
                        return {
                            reviewer: tourist.name || "Anonymous User",
                            profilePic: tourist.profilePic || null,
                            rating: rating.rating,
                            comment: rating.comment,
                            createdAt: rating.createdAt,
                        };
                    })
                );
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            }
        };

        fetchReviews();
    }, [ratingIds]);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const averageRating = (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    ).toFixed(1);

    const ratingCounts = [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter(
            (review) => Math.floor(review.rating) === rating
        ).length;
        return {
            rating,
            count,
            percentage: ((count / reviews.length) * 100).toFixed(1),
        };
    });

    const handleToggleReviews = () => setShowReviews(!showReviews);

    const startIndex = currentPage * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = reviews.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={{ maxHeight: height, width: width, fontSize: fontSize }}>
            <ReviewsWrapper>
                <ReviewsHeader>
                    <h2>Reviews</h2>
                    <HeaderContent>
                        <AverageRating>
                            {averageRating}
                            <Star size="0.8em" $filled={"t"}>
                                ★
                            </Star>
                        </AverageRating>
                        <RatingBreakdown>
                            {ratingCounts.map(({ rating, percentage }, index) => (
                                <RatingBar key={index}>
                                    <RatingText>{rating}</RatingText>
                                    <ProgressBar>
                                        <Fill style={{ width: `${percentage}%` }} />
                                    </ProgressBar>
                                    <Percentage>{percentage}%</Percentage>
                                </RatingBar>
                            ))}
                        </RatingBreakdown>
                    </HeaderContent>
                    <Separator />
                    <AllReviews>{`All Reviews (${reviews.length})`}</AllReviews>
                </ReviewsHeader>

                {showReviews && (
                    <ReviewsList>
                        {currentReviews.map((review, index) => (
                            <ReviewItem key={index}>
                                <ReviewHeader>
                                    <ProfilePic>
                                        {review.profilePic ? (
                                            <img
                                                src={review.profilePic}
                                                alt={review.reviewer}
                                            />
                                        ) : (
                                            <DefaultProfilePic>
                                                {(review.reviewer?.[0] || 'A').toUpperCase()}
                                            </DefaultProfilePic>
                                        )}
                                    </ProfilePic>
                                    <ReviewerInfo>
                                        <ReviewerName>{review.reviewer}</ReviewerName>
                                        <ReviewTimestamp>
                                            {new Date(review.createdAt).toLocaleString()}
                                        </ReviewTimestamp>
                                    </ReviewerInfo>
                                </ReviewHeader>
                                <ReviewRating>
                                    {Array(5)
                                        .fill(0)
                                        .map((_, i) => (
                                            <Star
                                                key={i}
                                                $filled={i < Math.floor(review.rating) ? "t" : "f"}
                                            >
                                                ★
                                            </Star>
                                        ))}
                                </ReviewRating>
                                <ReviewContent>{review.comment}</ReviewContent>
                            </ReviewItem>
                        ))}
                    </ReviewsList>
                )}
                <Actions>
                    <ToggleReviewsButton onClick={handleToggleReviews}>
                        {showReviews ? "Hide reviews" : "Show reviews"}
                    </ToggleReviewsButton>
                    {showReviews && (
                        <Pagination>
                            <PaginationButton onClick={handlePrevPage} disabled={currentPage === 0}>
                                Backward
                            </PaginationButton>
                            <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                                Forward
                            </PaginationButton>
                        </Pagination>
                    )}
                </Actions>
            </ReviewsWrapper>
        </div>
    );
};
const ReviewsWrapper = styled.div`
    padding: 2em;
    // background-color: #f5f5f5;
`;

const ReviewsHeader = styled.div`
    margin-bottom: 1.5em;
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: center;
`;

const AverageRating = styled.div`
    font-size: 3em;
    font-weight: bold;
    font-style: italic;
    color: black;
    display: flex;
    align-items: center;
    margin-right: 2em;
`;

const Star = styled.span`
    color: ${({ $filled }) => ($filled == "t"? "#ffa500" : "#ccc")};
    font-size: ${({ size }) => size || "1.5em"};
`;

const RatingBreakdown = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const RatingBar = styled.div`
    display: flex;
    align-items: center;
    margin: 0em 0;
`;

const RatingText = styled.span`
    width: 2em;
    font-weight: bold;
`;

const ProgressBar = styled.div`
    flex: 1;
    height: 0.5em;
    background-color: #e0e0e0;
    border-radius: 0.25em;
    position: relative;
    margin: 0 0.5em;
`;

const Fill = styled.div`
    height: 100%;
    background-color: #ffa500;
    border-radius: 0.25em;
`;

const Percentage = styled.span`
    width: 3em;
    text-align: right;
`;

const AllReviews = styled.p`
    font-size: 1.2em;
    font-weight: bold;
    margin: 1em 0;
`;

const Separator = styled.hr`
    border: none;
    height: 1px;
    background-color: #ccc;
    margin: 1.5em 0;
`;

const ReviewsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    min-height: calc(3 * 12vh + 3 * 1.5em); 
`;


const ReviewItem = styled.div`
    background-color: #fff;
    padding: 1em;
    max-height: 12vh;
    border-radius: 0.5em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReviewHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.5em;
`;

const ProfilePic = styled.div`
    width: 2.5em;
    height: 2.5em;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 1em;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const DefaultProfilePic = styled.div`
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #666;
    font-size: 1.2em;
`;

const ReviewerInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ReviewerName = styled.h3`
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
`;

const ReviewTimestamp = styled.p`
    font-size: 0.9em;
    color: #666;
    margin: 0.2em 0 0 0;
`;

const ReviewRating = styled.div`
    color: #ffa500;
    margin-bottom: 0.5em;
`;

const ReviewContent = styled.p`
    font-size: 1em;
    line-height: 1.5;
    margin: 0;
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between; /* Space between buttons */
    margin-top: 1em;
`;

const ToggleReviewsButton = styled.button`
    background: none;
    border: none;
    color: #0066cc;
    font-size: 1em;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const Pagination = styled.div`
    display: flex;
    align-items: center;
`;

const PaginationButton = styled.button`
    background: none;
    border: 1px solid #0066cc;
    color: #0066cc;
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
    margin-left: 1em;

    &:disabled {
        color: #ccc;
        border-color: #ccc;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #f0f0f0;
    }
`;

export default ReviewsSection;