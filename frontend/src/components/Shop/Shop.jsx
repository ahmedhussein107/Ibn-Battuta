import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import FilterSidebar from "./FilterBar";
import CardActivity from "../CardActivity";
import ShareAndMark from "../ShareAndMark";
import shopBackground from "../../assets/backgrounds/shopBackground.png";
import usePageHeader from "../Header/UseHeaderPage";
import "./Shop.css";
import Button from "../Button";
import ActionButtons from "./ActionButtons";
const minPrice = 0;
const maxPrice = 1000;
const TestShopLayout = () => {
    usePageHeader(shopBackground, "Shop");
    const [products, setProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [ratingRange, setRatingRange] = useState([1, 5]);
    const [sortBy, setSortBy] = useState("priceAsc");
    const [name, setName] = useState("");

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
            // to be deleted;
            setProducts([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
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
        <div className="shop">
            <div className="product-container">
                <div className="product-sidebar">
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
                <div className="product-main-content">
                    <ActionButtons />
                    <div className="product-grid-container">
                        {/* put your cards here ya 7os */}
                        {products.map((product, index) => (
                            <div key={index} className="product-grid-item">
                                <p>hi there</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestShopLayout;
