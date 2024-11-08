import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import FilterSidebar from "./FilterBar";
import CardActivity from "../CardActivity";
import ShareAndMark from "../ShareAndMark";
import shopBackground from "../../assets/backgrounds/shopBackground.png";
const minPrice = 0;
const maxPrice = 1000;

const TestShopLayout = () => {
    const [products, setProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [ratingRange, setRatingRange] = useState([1, 5]);
    const [sortBy, setSortBy] = useState("priceAsc");
    const [name, setName] = useState("");

    //////////////////////////

    const sortproducts = (products) => {
        let sortedproducts = [...products]; // Create a shallow copy
        if (sortBy === "priceAsc") {
            sortedproducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceDesc") {
            sortedproducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "ratingAsc") {
            sortedproducts.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === "ratingDesc") {
            sortedproducts.sort((a, b) => b.rating - a.rating);
        }
        console.log("sortedproducts", sortedproducts);
        setProducts(sortedproducts);
    };

    const fetchproducts = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(
                "product/search",
                {
                    params: query,
                },
                { withCredentials: true }
            );
            console.log("response", response.data);
            sortproducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        const query = buildQuery();
        fetchproducts(query);
    }, [priceRange, ratingRange, name]);

    useEffect(() => {
        sortproducts(products);
    }, [sortBy]);

    const buildQuery = () => {
        let query = {};
        if (priceRange[0] || priceRange[1]) {
            query.price = priceRange[0] + "-" + priceRange[1];
        } else {
            delete query.price;
        }

        if (ratingRange[0] || ratingRange[1]) {
            if (ratingRange[0] === 1) {
                query.rating = "-" + ratingRange[1];
            } else {
                query.rating = ratingRange[0] + "-" + ratingRange[1];
            }
        } else {
            delete query.rating;
        }

        if (name) {
            query.name = "~" + name;
        } else {
            delete query.name;
        }

        return query;
    };

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${shopBackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>

            <div style={{ display: "flex", flexDirection: "row", marginLeft: "2%" }}>
                <div
                    style={{
                        width: "40vw",
                        borderRadius: "3vh",
                        marginTop: "1%",
                        marginBottom: "1%",
                    }}
                >
                    <FilterSidebar
                        name={name}
                        setName={setName}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        ratingRange={ratingRange}
                        setRatingRange={setRatingRange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </div>
                <div
                    style={{
                        minHeight: "50vh",
                        width: "100vw",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                    }}
                >
                    {products.map((activity, index) => (
                        <div key={index} style={{ padding: "1.5vh" }}>
                            <CardActivity
                                activity={activity}
                                width={"60vw"}
                                height={"34vh"}
                                firstLineButtons={[
                                    <ShareAndMark
                                        width="1.2vw"
                                        height="1.2vw"
                                        styles={{ padding: "0.5vh" }}
                                    />,
                                ]}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestShopLayout;
