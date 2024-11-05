import React, { useState } from "react";
import "./NewComplaintPopUp.css";
import Button from "../Button";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import axiosInstance from "../../api/axiosInstance";
const ComplaintFormPopup = ({ isOpen, setIsOpen }) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(
                "complaint/createComplaint",
                {
                    title,
                    body,
                    // touristID: "670442014aa7c398b29183c9",
                },
                {
                    withCredentials: true,
                }
            );
            setIsOpen(false);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
        // submit
    };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay">
            <div className="popup">
                {/* Header with Title and Close Button */}
                <div className="popup-header">
                    <h2>File a Complaint</h2>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <HighlightOffSharpIcon />
                    </button>
                </div>

                <div className="popup-body">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter complaint title"
                    />

                    <label>Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Enter complaint details"
                        rows="4"
                    />
                </div>

                {/* Cancel and Submit Buttons */}
                <div className="popup-footer">
                    <Button
                        stylingMode="2"
                        text={"cancel"}
                        handleClick={() => setIsOpen(false)}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />{" "}
                    <Button
                        stylingMode="submit"
                        text={"Submit"}
                        handleClick={handleSubmit}
                        disabbled={isLoading}
                        isLoading={isLoading}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ComplaintFormPopup;
