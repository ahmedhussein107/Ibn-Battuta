import React, { useEffect, useState } from "react";
import CustomButton from "./Button";
import GenericCard from "./GenericCard";
import { Avatar, Rating, Button } from "@mui/material";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PopUp from "./PopUpsGeneric/PopUp";
import axiosInstance from "../api/axiosInstance";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";
import { useNavigate } from "react-router-dom";

const CardBooking = ({ booking, width, height, fontSize = "1.5rem", setError }) => {
    const navigate = useNavigate();

    const [rating, setRating] = useState(booking.ratingID ? booking.ratingID.rating : 0);
    const [comment, setComment] = useState(
        booking.ratingID ? booking.ratingID.comment : ""
    );
    const [ratingTourGuide, setRatingTourGuide] = useState(
        booking.ratingTourGuideID ? booking.ratingTourGuideID.rating : 0
    );
    const [commentTourGuide, setCommentTourGuide] = useState(
        booking.ratingTourGuideID ? booking.ratingTourGuideID.comment : ""
    );
    const [canRateTourGuide, setCanRateTourGuide] = useState(
        booking.ratingTourGuideID == null
    );
    const [isReadOnly, setIsReadOnly] = useState(!!booking.ratingID);
    const [open, setOpen] = useState(false);
    const [cancelPopup, setCancelPopup] = useState(false);
    const [tourguidePopup, setTourguidePopup] = useState(false);

    useEffect(() => {
        if (!open && !isReadOnly) {
            setRating(0);
            setComment("");
        }
    }, [open]);

    console.log(booking);
    console.log(booking.typeId);
    const Picture = booking.typeId?.picture || "";
    const profilePicture =
        booking.bookingType == "Itinerary"
            ? booking.typeId?.tourguideID.picture
            : booking.typeId?.advertiserID.picture || "";
    const name =
        booking.bookingType == "Itinerary"
            ? booking.typeId?.tourguideID.name
            : booking.typeId?.advertiserID.name || "";

    const currentDate = new Date(Date.now());
    const date =
        booking.bookingType == "Itinerary"
            ? booking.typeId?.availableDatesAndTimes?.[0]
            : booking.typeId?.startDate;

    const givenDate = new Date(date);
    const differenceInMilliseconds = givenDate - currentDate;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24.0);

    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    const handleRateTourguide = async () => {
        try {
            const response = await axiosInstance.post(
                `/rating/rateTourGuide/${booking.typeId._id}`,
                { rating: ratingTourGuide, comment: commentTourGuide },
                { withCredentials: true }
            );
            if (response.status === 201) {
                setCanRateTourGuide(false);
                console.log("Rating added successfully", response.data);
                const newBooking = await axiosInstance.patch(
                    `/booking/updateBooking/${booking._id}`,
                    { ratingTourGuideID: response.data.newRating._id }
                );
                if (newBooking.status === 200) {
                    console.log("Tourguide Rating ID added to booking successfully");
                } else {
                    console.error("Failed to add Tourguide Rating ID to booking");
                }
            } else {
                console.error("Failed to add rating");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setTourguidePopup(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post(
                `/rating/rate${booking.bookingType}/${booking.typeId._id}`,
                { rating, comment },
                { withCredentials: true }
            );
            if (response.status === 201) {
                setIsReadOnly(true);
                console.log("Rating added successfully");
                const newBooking = await axiosInstance.patch(
                    `/booking/updateBooking/${booking._id}`,
                    { ratingID: response.data.newRating._id }
                );
                if (newBooking.status === 200) {
                    console.log("Rating ID added to booking successfully");
                } else {
                    console.error("Failed to add rating ID to booking");
                }
            } else {
                console.error("Failed to add rating");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setOpen(false);
        }
    };

    const FirstLine = () => (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "0.2rem",
            }}
        >
            <h2 style={{ fontSize: "1em", margin: 0 }}>{booking.typeId?.name}</h2>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.6em",
                    color: "#777",
                    marginRight: "1rem",
                }}
            >
                <CalendarTodayIcon sx={{ marginRight: "0.3rem", fontSize: "1em" }} />
                {new Date(booking.createdAt).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })}
            </div>
        </div>
    );

    const secondLineIconSize = "0.85em";
    const secondLineFontSize = "0.75em";

    const IconBesideText = ({ Icon, text }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Icon sx={{ marginRight: "0.3rem", fontSize: secondLineIconSize }} />
            <p style={{ margin: 0, fontSize: secondLineFontSize }}>{text}</p>
        </div>
    );

    const SecondLine = () => (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "0.2rem",
                marginRight: "1rem",
                fontSize: "0.9em",
            }}
        >
            <IconBesideText Icon={LocationIcon} text={booking.typeId?.location} />
            {booking.bookingType == "Itinerary" && (
                <IconBesideText Icon={LanguageIcon} text={booking.typeId?.language} />
            )}
            {booking.bookingType == "Activity" && (
                <IconBesideText Icon={TagsIcon} text={booking.typeId?.category} />
            )}
            <IconBesideText Icon={TagsIcon} text={booking.typeId?.tags.join(", ")} />
        </div>
    );

    const ThirdLine = () => (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "1%",
                gap: "1rem",
                fontSize: "0.8em",
            }}
        >
            <Avatar src={profilePicture} sx={{ width: "1.4em", height: "1.4em" }} />
            {" " + name + " "}
            {differenceInDays < 0 && booking.bookingType == "Itinerary" ? (
                canRateTourGuide ? (
                    <Button variant="text" onClick={() => setTourguidePopup(true)}>
                        Rate now
                    </Button>
                ) : (
                    <span style={{ color: "grey" }}>{ratingTourGuide}/5</span>
                )
            ) : (
                <div />
            )}
        </div>
    );

    const aboveLine = (
        <div style={{ fontSize: fontSize }}>
            <FirstLine />
            <SecondLine />
            <ThirdLine />
        </div>
    );

    const handleCancel = async () => {
        try {
            const response = await axiosInstance.delete(
                `/booking/deleteBooking/${booking._id}`
            );
            if (response.status === 200) {
                console.log("Booking cancelled successfully");
            } else {
                console.error("Failed to cancel booking");
                setError("Failed to cancel booking");
            }
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            setError(error.response.data.message);
        } finally {
            setCancelPopup(false);
        }
    };

    const bottomLeft = (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.1em" }}>
            <div>Booking ID: {booking._id}</div>
            <div>Total Price: {formatPrice(booking.totalPrice)}</div>
            <div>Tickets: {booking.count}</div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginRight: "0.5rem",
                    width: "100%",
                }}
            >
                <div style={{ width: "60%" }}>
                    {differenceInDays < 0 ? (
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                                setOpen(true);
                            }}
                            readOnly={isReadOnly}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: "40%",
                    }}
                >
                    {differenceInDays >= 0 ? (
                        <CustomButton
                            stylingMode="dark-when-hovered"
                            width="40%"
                            text="cancel"
                            customStyle={{}}
                            handleClick={() => {
                                setCancelPopup(true);
                            }}
                        />
                    ) : (
                        <div></div>
                    )}
                    <CustomButton
                        stylingMode="always-dark"
                        width="40%"
                        text="view"
                        customStyle={{}}
                        handleClick={() => {
                            const type = booking.bookingType;
                            if (type == "Itinerary" || type == "Activity") {
                                navigate(
                                    `/${type.toLocaleLowerCase()}-details/${
                                        booking.typeId._id
                                    }`,
                                    {
                                        state: {
                                            id: booking.typeId._id,
                                        },
                                    }
                                );
                            } else {
                                console.log("Invalid type");
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <PopUp
                isOpen={open}
                setIsOpen={setOpen}
                headerText={`Rate ${booking.bookingType}`}
                handleSubmit={handleSubmit}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: "90%",
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "4%",
                        }}
                    >
                        <Rating
                            name="rating"
                            value={rating}
                            readOnly={isReadOnly}
                            onChange={(event, newValue) => setRating(newValue)}
                            style={{ fontSize: "4rem" }}
                        />
                    </div>
                    <div style={{ width: "90%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Add your comment
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Insert comment here..."
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "1vh",
                                resize: "vertical",
                            }}
                        />
                    </div>
                </div>
            </PopUp>
            <PopUp
                isOpen={tourguidePopup}
                setIsOpen={setTourguidePopup}
                headerText={`Rate ${name}`}
                handleSubmit={handleRateTourguide}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: "90%",
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "4%",
                        }}
                    >
                        <Rating
                            name="rating"
                            value={ratingTourGuide}
                            onChange={(event, newValue) => setRatingTourGuide(newValue)}
                            style={{ fontSize: "4rem" }}
                        />
                    </div>
                    <div style={{ width: "90%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Add your comment
                        </label>
                        <textarea
                            value={commentTourGuide}
                            onChange={(e) => setCommentTourGuide(e.target.value)}
                            placeholder="Insert comment here..."
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "1vh",
                                resize: "vertical",
                            }}
                        />
                    </div>
                </div>
            </PopUp>
            <PopUp
                isOpen={cancelPopup}
                setIsOpen={setCancelPopup}
                headerText={`Are you sure you want to cancel this booking?`}
                handleSubmit={handleCancel}
            >
                <div></div>
            </PopUp>
            <GenericCard
                image={Picture}
                aboveLine={aboveLine}
                bottomLeft={bottomLeft}
                bottomRight={<></>}
                width={width}
                height={height}
                upperHeight="44%"
                lowerHeight="54%"
                bottomLeftWidth="100%"
                bottomRightWidth="0%"
            />
        </div>
    );
};

export default CardBooking;
