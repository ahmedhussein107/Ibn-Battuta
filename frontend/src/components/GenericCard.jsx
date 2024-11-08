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
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderRadius: "2vh",
            }}
        >
            <div style={{ width: "30%" }}>
                <img
                    src={image}
                    alt={"Image Not Found"}
                    style={{
                        borderRadius: "2vh 0 0 2vh",
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                    }}
                ></img>
            </div>
            <div
                style={{
                    width: "70%",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "0 2vh 2vh 0",
                }}
            >
                <div style={{ marginLeft: "5%", height: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "30%",
                            justifyContent: "space-around",
                        }}
                    >
                        {aboveLine}
                    </div>
                    <hr
                        style={{
                            width: "95%",
                            borderTop: "0.1vh solid #ddd",
                            marginTop: "1%",
                        }}
                    />
                    <div style={{ display: "flex", flexDirection: "row", height: "68%" }}>
                        <div
                            style={{
                                width: "65%",
                                height: "95%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                            }}
                        >
                            {bottomLeft}
                        </div>
                        <div
                            style={{
                                width: "35%",
                                height: "95%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            {bottomRight}
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
