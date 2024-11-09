import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import FilterSidebar from "./FilterBar";
import ShareAndMark from "../ShareAndMark";
import shopBackground from "../../assets/backgrounds/shopBackground.png";
import usePageHeader from "../Header/UseHeaderPage";
import CardProduct from "../CardProduct";
import CustomButton from "../Button";
import ActionButtons from "./ActionButtons";
import NavBar from "../NavBar";
import Pagination from "../Pagination";
import Header from "../Header/Header";
const minPrice = 0;
const maxPrice = 1000;
const Shop = () => {
    usePageHeader(shopBackground, "Shop", <input />, null);
    const [products, setProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [ratingRange, setRatingRange] = useState([1, 5]);
    const [sortBy, setSortBy] = useState("priceAsc");
    const [name, setName] = useState("");
    const maxPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(3);
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
            console.log("response", response);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        const query = buildQuery();
        fetchproducts(query);
    }, [priceRange, ratingRange, name, currentPage]);

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
            query.rating = ratingRange[0] + "-" + ratingRange[1];
        } else {
            delete query.rating;
        }

        if (name) {
            query.name = "~" + name;
        } else {
            delete query.name;
        }
        query.page = currentPage;
        query.limit = maxPerPage;
        return query;
    };
    const handlePageChange = (event, page) => {
        console.log("page", page);
        setCurrentPage(page);
    };

    return (
        <>
            <Header />
            <div className="shop">
                {/* <div className="product-sidebar"> */}
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
                {/* </div> */}
                <div className="product-container">
                    <div className="product-main-content">
                        <ActionButtons />
                        <div className="product-grid-container">
                            {products.map((product, index) => (
                                <div style={{ padding: "1.5vh" }}>
                                    <CardProduct
                                        product={product}
                                        width={"32vw"}
                                        height={"23vh"}
                                        firstLineButtons={[
                                            [
                                                <ShareAndMark
                                                    width="1vw"
                                                    height="1vw"
                                                    styles={{ padding: "0.5vh" }}
                                                />,
                                            ],
                                        ]}
                                        upperHeight="20%"
                                        lowerHeight="78%"
                                        controlButtons={
                                            <CustomButton
                                                stylingMode="1"
                                                text="Add to cart"
                                                width="85%"
                                                customStyle={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: "0.8em",
                                                    fontSize: "0.74rem",
                                                }}
                                            />
                                        }
                                    />
                                </div>
                            ))}
                            <Pagination
                                totalPages={totalPages}
                                onChange={handlePageChange}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
