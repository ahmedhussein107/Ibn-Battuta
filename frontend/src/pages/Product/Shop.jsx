import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar.jsx";
import SearchField from "../../components/SearchField/SearchField.jsx";
import Sorter from "../../components/Sorter.jsx";
import PriceRange from "../../components/PriceRange.jsx";
import RatingRange from "../../components/RatingRange.jsx";
import Footer from "../../components/Footer.jsx";
import shopBackground from "../../assets/backgrounds/shopBackground.png";
import ShareAndMark from "../../components/ShareAndMark.jsx";
import CardProduct from "../../components/CardProduct.jsx";
import CustomButton from "../../components/Button.jsx";
import PopUp from "../../components/PopUpsGeneric/PopUp.jsx";
import QuantityControls from "../../components/QuantityControls.jsx";

import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import PaginationComponent from "../../components/Pagination";
import { useCurrencyConverter } from "../../hooks/currencyHooks.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const Shop = () => {
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, convertPrice, formatPrice } = useCurrencyConverter(currency);

    const minPrice = convertPrice(0, "EGP", currency);
    const maxPrice = convertPrice(2000, "EGP", currency);

    const [products, setProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [ratingRange, setRatingRange] = useState([null, 5]);
    const [sortBy, setSortBy] = useState("priceAsc");
    const [name, setName] = useState("");
    const [buyingPopUpOpen, setBuyingPopUpOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({
        _id: "",
        name: "",
        description: "",
        price: 0,
        rating: 0,
    });
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const fetchProducts = async (query) => {
        try {
            const response = await axiosInstance.get(`/product/search/`, {
                params: {
                    ...query,
                    page: currentPage,
                    limit: itemsPerPage,
                    sortBy,
                },
            });
            setProducts(response.data.result);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching Products:", error);
        }
    };

    useEffect(() => {
        const query = buildQuery();
        fetchProducts(query);
        setCurrentPage(1);
    }, [priceRange, ratingRange, name, sortBy]);

    useEffect(() => {
        const query = buildQuery();
        fetchProducts(query);
    }, [currentPage]);

    const handleBuyingPopUpOpen = async () => {
        try {
            await axiosInstance.post(
                "/order/createOrder",
                {
                    product: selectedProduct._id,
                    count: selectedQuantity,
                    price: selectedProduct.price * selectedQuantity,
                },
                { withCredentials: true }
            );
            setBuyingPopUpOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Error creating order. Please try again.");
        }
    };

    const buildQuery = () => {
        let query = {};

        if (priceRange[0] || priceRange[1]) {
            query.price =
                convertPrice(priceRange[0], currency, "EGP") +
                "-" +
                convertPrice(priceRange[1], currency, "EGP");
        } else {
            delete query.price;
        }

        if (ratingRange[0] || ratingRange[1]) {
            if (!ratingRange[0]) {
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

    const nonCollapsibleItems = [
        <SearchField
            placeholder="Search by name"
            searchText={name}
            setSearchText={setName}
        />,
    ];
    const titles = ["Sort By", "Price Range", "Rating Range"];
    const collapsibleItems = [
        <Sorter
            values={["priceAsc", "priceDesc", "ratingAsc", "ratingDesc"]}
            labels={[
                "Price (Low to High)",
                "Price (High to Low)",
                "Rating (Low to High)",
                "Rating (How to High)",
            ]}
            value={sortBy}
            setValue={setSortBy}
        />,
        <PriceRange
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            min={minPrice}
            max={maxPrice}
        />,
        <RatingRange ratingRange={ratingRange} setRatingRange={setRatingRange} />,
    ];

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div
            style={{
                width: "100vw",
                position: "absolute",
                top: "0",
                left: "0",
                display: "flex",
                flexDirection: "column",
                gap: "0.7rem",
                overflowX: "hidden",
            }}
        >
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${shopBackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "white",
                }}
            ></div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "28vw",
                }}
            >
                <button
                    style={{
                        border: "2px solid #9C4F21",
                        borderRadius: "50px",
                        padding: "0.5em 1.1em",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        display: "flex", // Add this
                        alignItems: "center", // Add this
                        gap: "0.4rem", // Add this to create space between icon and text
                    }}
                >
                    <ShoppingBagIcon
                        style={{
                            width: "1rem",
                            height: "1rem",
                            color: "#9C4F21",
                            scale: "1.5",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "1.3rem",
                            color: "#9C4F21",
                        }}
                    >
                        Shop
                    </span>
                </button>
                <button
                    style={{
                        border: "2px solid #9C4F21",
                        borderRadius: "50px",
                        padding: "0.5em 1.1em",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        display: "flex", // Add this
                        alignItems: "center", // Add this
                        gap: "0.4rem", // Add this to create space between icon and text
                    }}
                >
                    <FavoriteBorderIcon
                        style={{
                            width: "1rem",
                            height: "1rem",
                            color: "#9C4F21",
                            scale: "1.5",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "1.3rem",
                            color: "#9C4F21",
                        }}
                    >
                        wishlist
                    </span>
                </button>
                <button
                    style={{
                        border: "2px solid #9C4F21",
                        borderRadius: "50px",
                        padding: "0.5em 1.1em",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        display: "flex", // Add this
                        alignItems: "center", // Add this
                        gap: "0.4rem", // Add this to create space between icon and text
                        marginLeft: "41vw",
                    }}
                >
                    <ShoppingCartIcon
                        style={{
                            width: "1rem",
                            height: "1rem",
                            color: "#9C4F21",
                            scale: "1.5",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "1.3rem",
                            color: "#9C4F21",
                        }}
                    >
                        Cart
                    </span>
                </button>
            </div>

            <PopUp
                isOpen={buyingPopUpOpen}
                setIsOpen={setBuyingPopUpOpen}
                headerText={"Choose the quantity"}
                handleSubmit={async () => {
                    await handleBuyingPopUpOpen();
                }}
                actionText="Buy"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <p>{selectedProduct.name}</p>
                    <p>
                        Price:
                        {formatPrice(selectedProduct.price)}
                    </p>
                    <p>
                        Total Price:
                        {formatPrice(selectedProduct.price * selectedQuantity)}
                    </p>

                    <QuantityControls
                        selectedQuantity={selectedQuantity}
                        setSelectedQuantity={setSelectedQuantity}
                    />
                </div>
            </PopUp>
            <div style={{ display: "flex", flexDirection: "row", marginLeft: "2%" }}>
                <div
                    style={{
                        width: "25vw",
                        borderRadius: "3vh",
                    }}
                >
                    <SideBar
                        collapsibleItems={collapsibleItems}
                        nonCollapsibleItems={nonCollapsibleItems}
                        titles={titles}
                    />
                </div>
                <div
                    style={{
                        minHeight: "50vh",
                        width: "68vw",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                    }}
                >
                    {products.map((product, index) => (
                        <div key={index} style={{ padding: "1.5vh" }}>
                            <CardProduct
                                product={product}
                                width={"32vw"}
                                height={"25vh"}
                                fontSize="1.2rem"
                                firstLineButtons={[
                                    <ShareAndMark
                                        width="1.2vw"
                                        height="1.2vw"
                                        styles={{ padding: "0.5vh" }}
                                    />,
                                ]}
                                controlButtons={[
                                    <div style={{ fontSize: "0.8rem" }}>
                                        <CustomButton
                                            text="Buy Now"
                                            stylingMode="1"
                                            handleClick={() => {
                                                setSelectedProduct(product);
                                                setSelectedQuantity(1);
                                                setBuyingPopUpOpen(true);
                                            }}
                                            width="70%"
                                            customStyle={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "0.6em",
                                            }}
                                        />
                                    </div>,
                                ]}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <PaginationComponent
                totalPages={totalPages}
                currentPage={currentPage}
                onChange={(event, newPage) => {
                    setCurrentPage(newPage);
                }}
            />
            <Footer />
        </div>
    );
};

export default Shop;
