import React, { useState } from "react";
import propTypes from "prop-types";
import { IconButton, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div>
            <Divider />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "1vh",
                    padding: "1vh 0",
                    backgroundColor: "#FFFBF3",
                }}
            >
                <strong>{title}</strong>
                <IconButton
                    onClick={toggleOpen}
                    sx={{
                        outline: "none",
                        "&:focus": {
                            outline: "none",
                        },
                    }}
                >
                    {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </div>
            {isOpen && <div>{children}</div>}
        </div>
    );
};

const SideBar = ({ collapsibleItems, nonCollapsibleItems, titles }) => {
    return (
        <div
            className="sidebar"
            style={{
                width: "80%",
                padding: "1vw 3vh",
                boxShadow: "2px 4px 4px rgba(156, 79, 33, 0.2)",
                borderRadius: "8px",
                backgroundColor: "white",
            }}
        >
            {nonCollapsibleItems.map((item, index) => (
                <div key={index} style={{ marginBottom: "1vh" }}>
                    {item}
                </div>
            ))}

            {collapsibleItems.map((item, index) => (
                <div key={index} style={{ marginBottom: "1vh" }}>
                    <CollapsibleSection title={titles[index]}>{item}</CollapsibleSection>
                </div>
            ))}
        </div>
    );
};

SideBar.propTypes = {
    collapsibleItems: propTypes.array,
    nonCollapsibleItems: propTypes.array,
    titles: propTypes.array,
};

SideBar.defaultProps = {
    collapsibleItems: [],
    nonCollapsibleItems: [],
    titles: [],
};

export default SideBar;
