import React from "react";
import i1 from "../../assets/homepage/lastone.jpg";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Last = () => {
    return (
        <div
            style={{
                width: "97vw",
                height: "72vh",
                marginTop: "5vh",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundImage: `url(${i1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "3vh",
                boxSizing: "border-box",
                border: "0.2vh solid #ccc",
            }}
        >
            {/* Left Section */}
            <div
                style={{
                    flex: 1,
                    color: "#000",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <h1
                    style={{
                        fontSize: "2.6rem",
                        fontWeight: "bold",
                        marginBottom: "18vh",
                        marginLeft: "10%",
                        userSelect: "none",
                    }}
                >
                    Join Our Adventure Crew!
                </h1>
                <div style={{ marginTop: "2vh", marginLeft: "4vh" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "1vw",
                            justifyContent: "start",
                        }}
                    >
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div
                                style={{
                                    width: "5vh",
                                    height: "5vh",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <FacebookIcon
                                    style={{ fontSize: "2.5vh", color: "#393193" }}
                                />
                            </div>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div
                                style={{
                                    width: "5vh",
                                    height: "5vh",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <TwitterIcon
                                    style={{ fontSize: "2.5vh", color: "#393193" }}
                                />
                            </div>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div
                                style={{
                                    width: "5vh",
                                    height: "5vh",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <InstagramIcon
                                    style={{ fontSize: "2.5vh", color: "#393193" }}
                                />
                            </div>
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div
                                style={{
                                    width: "5vh",
                                    height: "5vh",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <LinkedInIcon
                                    style={{ fontSize: "2.5vh", color: "#393193" }}
                                />
                            </div>
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div
                                style={{
                                    width: "5vh",
                                    height: "5vh",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <YouTubeIcon
                                    style={{ fontSize: "2.5vh", color: "#393193" }}
                                />
                            </div>
                        </a>
                    </div>
                </div>
                <div
                    style={{
                        marginTop: "3vh",
                        marginLeft: "5vh",
                        userSelect: "none",
                        fontSize: "1rem",
                    }}
                >
                    <h2
                        style={{
                            fontWeight: "bold",
                            marginBottom: "1vh",
                            fontSize: "2em",
                        }}
                    >
                        Contact Us
                    </h2>
                    <p>Phone: 1-800-TRAVEL-NOW</p>
                    <p>Email: support@travelgenius.com</p>
                    <p>Address: Cairo, Egypt</p>
                    <p>Working Hours: Mon-Fri: 9am - 6pm</p>
                </div>
            </div>

            {/* Right Section */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            ></div>
        </div>
    );
};

export default Last;
