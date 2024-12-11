import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import PaginationComponent from "../../components/Pagination";
import Footer from "../../components/Footer";
import landmarkbackground from "../../assets/backgrounds/landmarksBackground.png";
import CardLandmark from "../../components/CardLandmark";
import ShareAndMark from "../../components/ShareAndMark";
import DeleteButton from "../../components/DeleteButton";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";

const GovernorLandmark = () => {
    const [landmarks, setLandmarks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);
    const [landmarkToDelete, setLandmarkToDelete] = useState(null);
    const itemsPerPage = 6;
    const navigate = useNavigate();

    const fetchLandmarks = async () => {
        try {
            const response = await axiosInstance.get(
                `/landmark/getGovernorLandmarks`,
                {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                    withCredentials: true,
                }
            );
            console.log("response", response.data);
            setLandmarks(response.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching landmarks:", error);
        }
    };

    useEffect(() => {
        fetchLandmarks();
    }, [currentPage]);

    const handleDeleteLandmark = (landmark) => {
        setLandmarkToDelete(landmark);
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteLandmarkConfirm = async () => {
        try {
            if (landmarkToDelete) {
                await axiosInstance.delete(
                    `/landmark/deleteLandmark/${landmarkToDelete}`,
                    {
                        withCredentials: true,
                    }
                );

                setLandmarks((prevLandmarks) =>
                    prevLandmarks.filter((lm) => lm.id !== landmarkToDelete.id)
                );
                setIsDeleteConfirmationOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting landmark:", error);
        }
    };

    return (
        <div
            style={{
                width: "100vw",
                position: "absolute",
                top: "0",
                left: "0",
            }}
        >
            <div
                style={{
                    width: "100vw",
                    height: "35vh",
                    color: "#FAE2B6",
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${landmarkbackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <div style={{ marginLeft: "5%", marginBottom: "2%" }}>
                    <p
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: "1rem",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            color: "white",
                            fontWeight: "500",
                            userSelect: "none",
                        }}
                    >
                        My LandMarks
                    </p>
                </div>
            </div>

            <Button
                style={{
                    marginTop: "1vh",
                    marginLeft: "2vw",
                    borderRadius: "4vh",
                    minWidth: "1vw",
                    color: "black",
                    borderColor: "black",
                    maxHeight: "4.2vh",
                }}
                variant="outlined"
                onClick={() => {
                    navigate("/governor/create-landmark");
                }}
            >
                <AddIcon sx={{ fontSize: "3vh" }} />
                <p style={{ marginLeft: ".3vw" }}>Add Landmark</p>
            </Button>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "2%",
                    marginTop: "1%",
                    marginBottom: "1%",
                    justifyContent: "center",
                }}
            >
                <div style={{ width: "100vw" }}>
                    {landmarks.map((landmark) => {
                        return (
                            <div
                                style={{ marginBottom: "3vh" }}
                                key={landmark.id}
                            >
                                <CardLandmark
                                    landmark={landmark}
                                    width={"95%"}
                                    height={"40vh"}
                                    firstLineButtons={[
                                        <EditIcon
                                            style={{
                                                cursor: "pointer",
                                                fontSize: "24px",
                                                color: "#000",
                                                margin: "10px",
                                            }}
                                            titleAccess="Edit Profile"
                                            onClick={() =>
                                                navigate(
                                                    `/governor/edit-landmark/${landmark._id}]`
                                                )
                                            } // Replace with the correct path and use landmark ID
                                        />,
                                        <DeleteButton
                                            deleteHandler={handleDeleteLandmark} // Pass the delete handler
                                            ID={landmark._id} // Pass the ID of the landmark
                                        />,
                                    ]}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ paddingBottom: "1%" }}>
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChange={(event, newPage) => {
                        setCurrentPage(newPage);
                    }}
                />
            </div>
            <Footer />

            {/* Delete Confirmation Popup */}
            <PopUp
                isOpen={isDeleteConfirmationOpen}
                setIsOpen={setIsDeleteConfirmationOpen}
                headerText={"Are you sure you want to delete this landmark?"}
                actionText={"Confirm"}
                handleSubmit={handleDeleteLandmarkConfirm}
            />
        </div>
    );
};

export default GovernorLandmark;
