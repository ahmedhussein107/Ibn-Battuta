import React, { useState } from "react";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import { Rating } from "@mui/material";
import convert from "../api/convert";
import Cookies from "js-cookie";
const CardProduct = ({
    product,
    width,
    height,
    firstLineButtons,
    controlButtons,
    lowerHeight = "68%",
    upperHeight = "30%",
    line2 = <></>,
    fontSize = "1.5rem",
}) => {
    const image = product.pictures[0];
    const line1 = (
        <div style={{ fontSize: fontSize }}>
            <TitleAndButtons title={product.name} buttons={firstLineButtons} />
        </div>
    );

    const description = (
        <TruncatedText
            text={product.description}
            width={"100%"}
            height={"60%"}
            fontSize={"2vh"}
        />
    );
    const rating = Math.floor(product.rating);
    const ratings = (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Rating name="read-only" value={rating} readOnly />
            <p style={{ marginLeft: "5%", marginTop: "0%" }}>{product.ratings.length}</p>
        </div>
    );
    const availableProducts = (
        <p
            style={{
                color: "brown",
                fontSize: "1.6vh",
            }}
        >
            {product.quantity} in stock
        </p>
    );
    const price = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
            }}
        >
            <p>{Cookies.get("currency") || "EGP"}</p>
            <p style={{ marginLeft: "5%" }}>{convert(product.price)}</p>
        </div>
    );
    const buttons = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "7%",
            }}
        >
            {price}
            {controlButtons}
        </div>
    );
    const card = (
        <GenericCard
            image={image}
            aboveLine={[line1, line2]}
            bottomLeft={[description, ratings]}
            bottomRight={[availableProducts, buttons]}
            width={width}
            height={height}
            upperHeight={upperHeight}
            lowerHeight={lowerHeight}
        />
    );
    return card;
};

export default CardProduct;
