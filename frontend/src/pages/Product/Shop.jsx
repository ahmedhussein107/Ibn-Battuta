import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar.jsx";
import SearchField from "../../components/SearchField/SearchField.jsx";
import Sorter from "../../components/Sorter.jsx";
import PriceRange from "../../components/PriceRange.jsx";
import RatingRange from "../../components/RatingRange.jsx";
import NavBar from "../../components/NavBar.jsx";
import Footer from "../../components/Footer.jsx";
import shopBackground from "../../assets/backgrounds/shopBackground.png";
import ShareAndMark from "../../components/ShareAndMark.jsx";
import CardProduct from "../../components/CardProduct.jsx";
import CustomButton from "../../components/Button.jsx";
import PopUp from "../../components/PopUpsGeneric/PopUp.jsx";
import QuantityControls from "../../components/QuantityControls.jsx";
import convert from "../../api/convert.js";
import convertBack from "../../api/convertBack.js";
import Cookies from "js-cookie";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
const minPrice = 0;
const maxPrice = 1000;

const Shop = () => {
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

    const sortProducts = (products) => {
        let sortedProducts = [...products]; // Create a shallow copy
        if (sortBy === "priceAsc") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceDesc") {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "ratingAsc") {
            sortedProducts.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === "ratingDesc") {
            sortedProducts.sort((a, b) => b.rating - a.rating);
        }
        console.log("sortedActivities", sortedProducts);
        setProducts(sortedProducts);
    };

    const fetchActivities = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(`/product/search/`, {
                params: query,
            });
            console.log("response", response.data);
            sortProducts(response.data);
        } catch (error) {
            console.error("Error fetching Products:", error);
        }
    };

    useEffect(() => {
        const query = buildQuery();
        fetchActivities(query);
    }, [priceRange, ratingRange, name]);

    useEffect(() => {
        sortProducts(products);
    }, [sortBy]);

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
    return (
        <div
            style={{
                width: "100vw",
                position: "absolute",
                top: "0",
                left: "0",
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
                    marginTop: "1vh",
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
                        Price: {Cookies.get("currency") || "EGP"}
                        {convert(selectedProduct.price)}
                    </p>
                    <p>
                        Total Price: {Cookies.get("currency") || "EGP"}{" "}
                        {convert(selectedProduct.price * selectedQuantity).toFixed(2)}
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
                        marginTop: "-3vh",
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
            <Footer />
        </div>
    );
};

export default Shop;
