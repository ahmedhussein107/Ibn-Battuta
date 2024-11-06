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
                    padding: "10px 0",
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
        <div className="sidebar" style={{ width: "25vw" }}>
            {nonCollapsibleItems.map((item, index) => (
                <div key={index} style={{ marginBottom: "2vh" }}>
                    {item}
                </div>
            ))}

            {collapsibleItems.map((item, index) => (
                <div key={index} style={{ marginBottom: "2vh" }}>
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
