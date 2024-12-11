import React from "react";

import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link } from "@mui/material";

const icons = [
    {
        Icon: FacebookIcon,
        url: "https://www.facebook.com/acm.guc.community/",
    },
    {
        Icon: XIcon,
        url: "https://www.facebook.com/acm.guc.community/", // TOBE Changed
    },
    {
        Icon: YouTubeIcon,
        url: "https://www.youtube.com/@ACMGUCCommunity",
    },
    {
        Icon: InstagramIcon,
        url: "https://www.youtube.com/@ACMGUCCommunity", // TOBE Changed
    },
];

const body =
    "Inspired by the legendary explorer Ibn Battuta, \
    our platform is your gateway to the world. \
    Discover hidden gems, plan your next journey, \
    and connect with fellow travelers who share your passion for exploration. ";

const Welcome = ({ title }) => {
    return (
        <div className="content" style={styles.content}>
            <h1 className="title" style={styles.title}>
                {title}
            </h1>
            <p style={styles.p}>{body}</p>
            {icons.map(({ Icon, url }, index) => (
                <Link key={index} href={url} target="_blank">
                    <Icon key={index} style={styles.icons} />
                </Link>
            ))}
        </div>
    );
};

const styles = {
    content: {
        position: "relative",
        marginLeft: "10%",
        marginTop: "17%",

        fontFamily: "Inika",
        color: "#fbf9f8",
        padding: "1.5rem",
        borderRadius: "8px",
    },
    title: {
        fontSize: "5vw",
        fontWeight: "bold",
    },
    p: {
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        width: "80%",
        marginTop: "3%",
        fontSize: "1.7vw",
    },
    icons: {
        marginTop: "2%",
        marginRight: "3%",
        fontSize: "2.3vw",
        color: "#fbf9f8",
        cursor: "pointer",
    },
};

export default Welcome;
