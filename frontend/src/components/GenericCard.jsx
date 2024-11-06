import React from "react";
import PropTypes from "prop-types";

const GenericCard = ({ image, aboveLine, bottomLeft, bottomRight, width, height }) => {
    return (
        <div
            style={{
                width: width,
                height: height,
                display: "flex",
                flexDirection: "row",
            }}
        >
            <div style={{ width: "30%" }}>
                <img
                    src={image}
                    alt={"Image Not Found"}
                    style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                    }}
                ></img>
            </div>
            <div style={{ width: "70%", backgroundColor: "#f0f0f0" }}>
                <div style={{ marginLeft: "5%" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "30%",
                            justifyContent: "space-between",
                        }}
                    >
                        {aboveLine.map((item) => item)}
                    </div>
                    <hr style={{ width: "95%", borderTop: "0.1vh solid #ddd" }} />
                    <div style={{ display: "flex", flexDirection: "row", height: "70%" }}>
                        <div
                            style={{
                                width: "65%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {bottomLeft.map((item) => item)}
                        </div>
                        <div
                            style={{
                                width: "35%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            {bottomRight.map((item) => item)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

GenericCard.propTypes = {
    image: PropTypes.string,
    aboveLine: PropTypes.array,
    bottomLeft: PropTypes.array,
    bottomRight: PropTypes.array,
};

export default GenericCard;
