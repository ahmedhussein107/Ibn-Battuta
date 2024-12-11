import QuantityControls from "./QuantityControls";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import { Tooltip } from "@mui/material";

const CartItem = ({
    product,
    count,
    setCount,
    onDelete = () => {
        console.log("button clicked");
    },
    formatPrice,
}) => {
    const { name, pictures, price, quantity, description } = product;

    return (
        <div style={cartItemStyle}>
            <div
                style={{
                    width: "95%",
                    height: "90%",
                    display: "flex",
                    gap: "3%",
                    justifyContent: "left",
                }}
            >
                <div style={{ display: "flex", width: "20%" }}>
                    <div style={{ width: "90%" }}>
                        <img src={pictures[0]} alt={name} style={itemImageStyle} />
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        //justifyContent: "space-between",
                        width: "80%",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5%",
                                width: "30%",
                            }}
                        >
                            <h2 style={{ color: "#9C4F21" }}>{name}</h2>
                            {quantity < count && (
                                <Tooltip
                                    title={
                                        quantity == 0
                                            ? "Out of Stock"
                                            : "Not enough items in stock"
                                    }
                                >
                                    <ErrorIcon style={{ color: "red" }} />
                                </Tooltip>
                            )}
                        </div>
                        <IconButton aria-label="delete" onClick={onDelete}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div
                            style={{
                                width: "60%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "3vh",
                                marginTop: "1%",
                            }}
                        >
                            <div style={itemDetailsStyle}>
                                <p
                                    style={{ color: "brown", fontSize: "1.6vh" }}
                                >{`${quantity} in stock`}</p>
                                <hr style={{ width: "100%", margin: "0 auto" }} />
                                <p>{description}</p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                //justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: "20%",
                                    marginLeft: "-25%",
                                }}
                            >
                                <QuantityControls
                                    selectedQuantity={count}
                                    mode={2}
                                    setSelectedQuantity={setCount}
                                />
                                <span>
                                    <span
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "bold",
                                            color: "#9C4F21",
                                        }}
                                    >
                                        Price:{" "}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(price * count)}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div
                style={{
                    height: "2%",
                    width: "98%",
                    backgroundColor: "#D1D5DB", // colo
                    margin: "20px 0",
                    borderRadius: "1px",
                }}
            ></div> */}
            <hr
                style={{
                    width: "90%",
                    border: "1px solid #D1D5DB",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                }}
            />
        </div>
    );
};

const cartItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "30vh",
    width: "100%",
};
const itemImageStyle = {
    borderRadius: "5%",
    objectFit: "cover",
    width: "100%",
    height: "100%",
};
const itemDetailsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    gap: "3vh",
};

export default CartItem;
