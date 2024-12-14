import React, { useState } from "react";
import PopUp from "./PopUpsGeneric/PopUp";
import Map from "../pages/map";
import PhotosUpload from "./PhotosUpload";
import axiosInstance from "../api/axiosInstance";
import { uploadFiles } from "../api/firebase";
import CustomButton from "./Button";
const CreateCustomActivityPopup = ({ popUpOpen, setPopUpOpen }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [locationlongitude, setLocationlongitude] = useState(0);
    const [locationlatitude, setLocationlatitude] = useState(0);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleSubmit = async () => {
        try {
            const data = {
                name,
                description,
                Longitude: locationlongitude,
                Latitude: locationlatitude,
            };

            // const pictures = await uploadFiles(
            //     imagePreviews.map((preview) => preview.file),
            //     `customActivities/${name}`
            // );
            // data.pictures = pictures;

            const response = await axiosInstance.post(
                "/customActivity/createCustomActivity",
                data,
                {
                    withCredentials: true,
                }
            );
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
        <>
            <PopUp
                isOpen={popUpOpen}
                setIsOpen={setPopUpOpen}
                headerText={"Create new Custom Activity"}
                containsActionButton={false}
                containsFooter={false}
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
                            height: "130%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "2vh",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                padding: "2vh",
                                height: "50%",
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
                                    height: "100%",
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
                        <CustomButton
                            stylingMode="always-dark"
                            text="Create Activity"
                            handleClick={handleSubmit}
                        />
                    </div>
                    <div style={{ width: "45%", height: "60%" }}>
                        {/* <PhotosUpload
                            label="Activity Photos"
                            imagePreviews={imagePreviews}
                            onImageAdd={handleImageAdd}
                            onImageRemove={handleImageRemove}
                        /> */}
                    </div>
                </div>
            </PopUp>
        </>
    );
};

export default CreateCustomActivityPopup;
