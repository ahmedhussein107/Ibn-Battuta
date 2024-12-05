import React, { useEffect, useState } from "react";
import Welcome from "../../components/Welcome";
import TravellerBackground from "../../assets/backgrounds/travellerBackground.png";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import advertiserIcon from "../../assets/icons/advertiserIcon.png";
import touristIcon from "../../assets/icons/touristIcon.png";
import tourGuideIcon from "../../assets/icons/tourGuideIcon.png";
import sellerIcon from "../../assets/icons/sellerIcon.png";

const roles = [
    { title: "Advertiser", icon: advertiserIcon },
    { title: "Tour Guide", icon: tourGuideIcon },
    { title: "Tourist", icon: touristIcon },
    { title: "Seller", icon: sellerIcon },
];

const Role = ({ title, icon, selectedRole, setSelectedRole, key }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        console.log("selectedRole", selectedRole);
        setIsClicked(title === selectedRole);
    }, [selectedRole]);

    return (
        <div
            key={key}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isHovered || isClicked ? "#f0f0f0" : "white",
                width: "20vw",
                height: "10vh",
                marginTop: "3%",
                marginLeft: "5%",
                borderRadius: "5%",
                cursor: "pointer",
            }}
            onClick={() => {
                setSelectedRole(title);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={icon}
                alt="Role"
                style={{
                    width: "5vw",
                    height: "9vh",
                    borderRadius: "20%",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
            />
            <p
                style={{
                    fontSize: "1.5vw",
                    fontWeight: "bold",
                    marginLeft: "15%",
                }}
            >
                {title}
            </p>
        </div>
    );
};

const SelectYourRoleComponent = ({ navigate }) => {
    const [selectedRole, setSelectedRole] = useState("");
    const [response, setResponse] = useState("");
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: "5%",
                marginTop: "5%",
            }}
        >
            <h1
                style={{
                    fontFamily: "Inter",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                }}
            >
                Choose a role to sign up
            </h1>
            <div style={{ marginLeft: "17%" }}>
                {roles.map(({ title, icon }, index) => (
                    <Role
                        title={title}
                        icon={icon}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        key={index}
                    />
                ))}
                <div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "15%",
                        }}
                    >
                        <Button
                            stylingMode="dark-when-hovered"
                            text="Cancel"
                            width={"10vw"}
                            handleClick={() => {
                                navigate("/");
                            }}
                        />
                        <Button
                            stylingMode="always-dark"
                            text="Next"
                            width={"10vw"}
                            handleClick={() => {
                                if (!selectedRole) {
                                    setResponse("Please select your role!");
                                    return;
                                }

                                navigate("/signup", {
                                    state: { userType: selectedRole.replace(/\s+/g, "") },
                                });
                            }}
                        />
                    </div>
                    <p style={{ color: "red", width: "22vw", textAlign: "center" }}>
                        {response}
                    </p>
                </div>
                <p style={{ marginLeft: "10%" }}>
                    Already have an account?{" "}
                    {
                        <Link
                            to={"/signin"}
                            style={{ textDecoration: "underline", cursor: "pointer" }}
                        >
                            Sign in
                        </Link>
                    }
                </p>
            </div>
        </div>
    );
};

const SelectYourRole = () => {
    const navigate = useNavigate();

    // redirect the user if already logged in
    useEffect(() => {
        const userType = Cookies.get("userType") || "Guest";
        if (userType != "Guest") {
            navigate(`/${userType.toLowerCase()}`);
        }
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                display: "flex",
                flexDirection: "row",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                style={{
                    width: "55vw",
                    height: "100vh",
                    backgroundImage: `url(${TravellerBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <Welcome title={"Welcome"} />;
            </div>
            <div style={{ width: "45vw", height: "100vh" }}>
                <SelectYourRoleComponent navigate={navigate} />
            </div>
        </div>
    );
};

export default SelectYourRole;
