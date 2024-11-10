import React from "react";
import PopUp from "./PopUpsGeneric/PopUp";
import { useState } from "react";
import Map from "../pages/map";
import PhotosUpload from "./PhotosUpload";
import axiosInstance from "../api/axiosInstance";
const CreateCustomActivityPopup = () => {
    const [PopUpOpen, setPopUpOpen] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);
    const [locationlongitude, setLocationlongitude] = useState(null);
    const [locationlatitude, setLocationlatitude] = useState(null);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("title", name);
            formData.append("description", description);
            console.log(locationlatitude, locationlongitude);
            formData.append("locationlongitude", locationlongitude);
            formData.append("locationlatitude", locationlatitude);
            imagePreviews.forEach((image) => {
                formData.append("pictures", image);
            });

            await axiosInstance.post("/customActivity/createCustomActivity", formData, {
                withCredentials: true,
            });
            setPopUpOpen(false);
        } catch (err) {
            console.log(err);
        }
    };
    const handleImageAdd = (newImages) => {
        setImagePreviews((prev) => [...prev, ...newImages]);
    };

    const handleImageRemove = (idToRemove) => {
        setImagePreviews((prev) => prev.filter((image) => image.id !== idToRemove));
    };

    return (
        <div style={{ width: "80vw" }}>
            <PopUp
                isOpen={PopUpOpen}
                setIsOpen={setPopUpOpen}
                headerText={"Create new Custom Activity"}
                actionText="Create Activity"
                handleSubmit={handleSubmit}
            >
                <div style={{ marginBottom: "2vh" }}>
                    <div style={{ width: "90%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Name*
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Insert title here..."
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "1vh",
                                border: "0.1vh solid #ccc",
                            }}
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
                            Description*
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Insert description here..."
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "1vh",
                                border: "0.1vh solid #ccc",
                                resize: "vertical",
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2vh",
                    }}
                >
                    <div
                        style={{
                            width: "45%",
                            padding: "2vh",
                            height: "29vh",
                            borderRadius: "1vh",
                            border: "0.1vh solid #fff",
                            backgroundColor: "#FAF4F4",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <label style={{ marginBottom: "1vh", fontWeight: "bold" }}>
                            pin location on the Map
                        </label>
                        <div
                            style={{
                                width: "100%",
                                height: "25vh",
                                overflow: "hidden",
                                borderRadius: "1vh",
                            }}
                        >
                            <Map
                                style={{ width: "100%", height: "100%" }}
                                setMarkerPosition={(position) => {
                                    setLocationlongitude(position.lng);
                                    setLocationlatitude(position.lat);
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ width: "45%" }}>
                        <PhotosUpload
                            label="Activity Photos"
                            imagePreviews={imagePreviews}
                            onImageAdd={handleImageAdd}
                            onImageRemove={handleImageRemove}
                        />
                    </div>
                </div>
            </PopUp>
        </div>
    );
};

export default CreateCustomActivityPopup;
