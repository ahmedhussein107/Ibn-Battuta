import { Link } from "react-router-dom";
import "./CommonForm.css";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import React from "react";

const CommonFormStep = ({ userData, onChange, handleImageChange, image }) => {
    return (
        <div className="common-form-step">
            {/* Photo Input */}
            <div className="form-group">
                <label htmlFor="photoInput" className="custom-icon-label">
                    {image ? (
                        <img
                            src={image}
                            alt="Preview"
                            className="uploaded-image"
                            style={{ width: "100%", height: "100%" }}
                        />
                    ) : (
                        <img
                            src="./add-image.png"
                            style={{ width: "100%", height: "100%" }}
                        ></img>
                        // <AddAPhotoIcon sx={{ color: "#f86624", fontSize: 50 }} />
                    )}
                </label>
                <input
                    type="file"
                    id="photoInput"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                />
            </div>
            {/* Name Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Name{" "}
                </label>
                <input
                    type="text"
                    name="name"
                    value={userData.name || ""}
                    onChange={onChange}
                    placeholder="Enter your name"
                    required
                />
            </div>
            {/* Username Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Username*
                </label>
                <input
                    type="text"
                    name="username"
                    value={userData.username || ""}
                    onChange={onChange}
                    placeholder="Enter your username"
                    required
                />
            </div>
            {/* Email Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Email*
                </label>

                <input
                    type="email"
                    name="email"
                    value={userData.email || ""}
                    onChange={onChange}
                    placeholder="Enter your email"
                    required
                />
            </div>
            {/* Password Input */}
            <div className="form-group">
                <label style={{ alignSelf: "flex-start", marginLeft: "15%" }}>
                    Password*
                </label>
                <input
                    type="password"
                    name="password"
                    value={userData.password || ""}
                    onChange={onChange}
                    placeholder="Enter your password"
                    required
                />
            </div>
            <p style={{ marginLeft: "10%", marginTop: "2vh" }}>
                Already have an account?{" "}
                {
                    <Link
                        to={"/signin"}
                        style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "var(--accent-color)",
                        }}
                    >
                        Sign in
                    </Link>
                }
            </p>
        </div>
    );
};

export default CommonFormStep;
