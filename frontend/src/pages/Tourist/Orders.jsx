import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/Pagination";
import bookingsBackground from "../../assets/backgrounds/bookingsBackground.png";
import Footer from "../../components/Footer";
import CardOrder from "../../components/CardOrder";
import FilterButtons from "../../components/FilterButtons";

const filterButtons = ["All", "Delivered", "Pending", "Canceled"];

const Orders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("All");
    const itemsPerPage = 4;
    const [orders, setOrders] = useState([]);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get("order/getMyOrders", {
                params: { page: currentPage, limit: itemsPerPage, filter: filter },
                withCredentials: true,
            });
            console.log("Orders", response.data);
            setOrders(response.data.result);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchOrders();
    }, [filter]);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div style={backgroundStyle}>
                <h1 style={headerStyle}>My Orders</h1>
            </div>
            <div style={{ margin: "1%" }}>
                <FilterButtons
                    buttons={filterButtons}
                    selected={filter}
                    handleChooseType={(filter) => setFilter(filter)}
                />
            </div>
            <hr style={{ width: "90%", margin: "0 auto" }} />
            <div style={{ padding: "1% 0" }}>
                <div style={itemsContainerStyle}>
                    {orders.map((order) => (
                        <div style={{ padding: "1%" }}>
                            <CardOrder order={order} />
                        </div>
                    ))}
                </div>
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChange={handlePageChange}
                />
            </div>
            <Footer />
        </div>
    );
};

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bookingsBackground})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    shadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const headerStyle = {
    position: "relative",
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "5%",
    color: "White",
};

const itemsContainerStyle = {
    paddingTop: "2vh",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
};

export default Orders;
