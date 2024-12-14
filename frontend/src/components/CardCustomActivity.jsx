import React from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";

const CardCustomActivity = ({
    activity,
    width,
    height,
    firstLineButtons = [],
    bottomButtons = [],
    iconSize = "0.85rem",
    fontSize = "0.9rem",
}) => {
    const image = (activity.pictures && activity.pictures[0]) || activity.picture;
    const line1 = (
        <div style={{ fontSize: "1.3rem" }}>
            <TitleAndButtons title={activity.name} buttons={firstLineButtons} />
        </div>
    );
    const line2 = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                fontSize: fontSize,
                gap: "2vw",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <LocationIcon style={{ fontSize: iconSize }} />
                <span>{activity.location}</span>
            </div>
        </div>
    );

    const description = (
        <TruncatedText
            text={activity.description || ""}
            width={"100%"}
            height={"60%"}
            fontSize={"2vh"}
        />
    );

    const buttons = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            {bottomButtons.map(({ text, type, width, onClick, styles }) => (
                <Button
                    text={text}
                    stylingMode={type}
                    width={width}
                    handleClick={onClick}
                    customStyle={styles}
                />
            ))}
        </div>
    );

    const card = (
        <GenericCard
            image={image}
            aboveLine={[line1, line2]}
            bottomLeft={[description]}
            bottomRight={[<div></div>, buttons]}
            width={width}
            height={height}
        />
    );
    return card;
};

export default CardCustomActivity;
