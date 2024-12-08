import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar.jsx";
import SearchField from "../../components/SearchField/SearchField.jsx";
import Sorter from "../../components/Sorter.jsx";
import PriceRange from "../../components/PriceRange.jsx";
import RatingRange from "../../components/RatingRange.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom"; //REMOVE
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
    const userType = Cookies.get("userType") || "Guest";
    const { isLoading, convertPrice, formatPrice } = useCurrencyConverter(currency);

    const minPrice = convertPrice(0, "EGP", currency);
    const maxPrice = convertPrice(1000000000, "EGP", currency);

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
    const navigate = useNavigate(); //REMOVE

    const [selectedPage, setSelectedPage] = useState("Shop");
    const [wishlistStatus, setWishlistStatus] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const fetchWishlistStatus = async (query) => {
        if (userType !== "Tourist") return;

        const productIDs = products.map((product) => {
            return product._id;
        });
        try {
            const response = await axiosInstance.post(
                `/wishlist/getProductsStatus/`,
                {
                    productIDs,
                },
                { withCredentials: true }
            );
            console.log("wishlist status", response.data);
            setWishlistStatus(response.data);
        } catch (error) {
            console.error("Error fetching wishlist status:", error);
        }
    };

    const fetchProducts = async (query) => {
        try {
            const response =
                selectedPage == "Shop"
                    ? await axiosInstance.get(`/product/search/`, {
                          params: {
                              ...query,
                              page: currentPage,
                              limit: itemsPerPage,
                              sortBy,
                          },
                      })
                    : await axiosInstance.get(`/wishlist/getWishlistProducts`, {
                          params: {
                              ...query,
                              page: currentPage,
                              limit: itemsPerPage,
                              sortBy,
                          },
                          withCredentials: true,
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
    }, [priceRange, ratingRange, name, sortBy, selectedPage]);

    useEffect(() => {
        const query = buildQuery();
        fetchProducts(query);
    }, [currentPage]);

    useEffect(() => {
        fetchWishlistStatus();
    }, [products]);

    useEffect(() => {
        if (selectedPage == "wishlist") {
            const query = buildQuery();
            fetchProducts(query);
        }
    }, [wishlistStatus]);

    const handleBuyingPopUpOpen = async () => {
        try {
            await axiosInstance.post(
                "/cart/updateCart",
                {
                    productID: selectedProduct._id,
                    count: selectedQuantity,
                },
                { withCredentials: true }
            );
            setBuyingPopUpOpen(false);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error adding to cart. Please try again.");
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

    const handleAddToWishlist = async (productID) => {
        try {
            const response = await axiosInstance.post(
                `wishlist/wishlist`,
                {
                    productID,
                    isInWishlist: wishlistStatus[productID],
                },
                { withCredentials: true }
            );
            console.log("Wishlist response:", response.data);
            const oldStatus = wishlistStatus[productID];
            setWishlistStatus((prevStatus) => {
                prevStatus[productID] = !oldStatus;
                console.log(prevStatus);
                return { ...prevStatus };
            });
        } catch (error) {
            console.error("Error Add product to wishlist:", error);
        }
    };

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
            {(userType === "Tourist" || userType === "Guest") && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginLeft: "28vw",
                    }}
                >
                    <button
                        style={
                            selectedPage === "Shop" ? selectedButtonStyle : buttonStyle
                        }
                        onClick={() => setSelectedPage("Shop")}
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
                        style={
                            selectedPage === "wishlist"
                                ? selectedButtonStyle
                                : buttonStyle
                        }
                        onClick={() => setSelectedPage("wishlist")}
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
                            Wishlist
                        </span>
                    </button>
                    <button
                        style={{
                            ...buttonStyle,
                            marginLeft: "62%",
                        }}
                        onClick={() => navigate("/tourist/cart")}
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
            )}

            <PopUp
                isOpen={buyingPopUpOpen}
                setIsOpen={setBuyingPopUpOpen}
                headerText={"Choose the quantity"}
                handleSubmit={async () => {
                    await handleBuyingPopUpOpen();
                }}
                actionText="Add to cart"
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "2%",
                }}
            >
                <div
                    style={{
                        width: "26vw",
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
                                        width="1.2rem"
                                        height="1.2rem"
                                        styles={{ padding: "0.5vh" }}
                                        isBookmarked={wishlistStatus[product.id]}
                                        showBookmark={userType === "Tourist"}
                                        onSecondIconClick={() =>
                                            handleAddToWishlist(product.id)
                                        }
                                        icon={"loveIcon"}
                                        scale={1.3}
                                    />,
                                ]}
                                controlButtons={[
                                    (userType === "Tourist" || userType === "Guest") && (
                                        <div style={{ fontSize: "0.8rem" }}>
                                            <CustomButton
                                                text="Add to cart"
                                                stylingMode="always-dark"
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
                                        </div>
                                    ),
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

const buttonStyle = {
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
    transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#FAE2B6",
    color: "#9C4F21",
};

export default Shop;
