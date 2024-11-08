import React from "react";
import "./Shop.css";
import Button from "../Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
const ActionButtons = () => {
    const navigate = useNavigate();
    return (
        <div className="product-buttons-container">
            <div className="product-order-wishlist">
                <Button
                    stylingMode="2"
                    text={"My orders"}
                    handleClick={() => navigate("/orders")}
                    isLoading={false}
                    customStyle={{
                        marginLeft: "20px",
                        borderRadius: "40px",
                        border: "2px solid #000",
                        paddingRight: "30px",
                    }}
                />
                <Button
                    stylingMode="2"
                    text={"My Wishlist"}
                    handleClick={() => navigate("/wishlist")}
                    isLoading={false}
                    customStyle={{
                        marginLeft: "20px",
                        borderRadius: "40px",
                        border: "2px solid #000",
                        paddingRight: "30px",
                    }}
                />
            </div>

            <Button
                stylingMode="2"
                text={"Cart"}
                handleClick={() => navigate("/cart")}
                isLoading={false}
                icon={
                    <ShoppingCartIcon
                        sx={{ verticalAlign: "middle", marginRight: "5px" }}
                    />
                }
                customStyle={{
                    marginLeft: "20px",
                    borderRadius: "40px",
                    border: "2px solid #000",
                    paddingRight: "30px",
                }}
            />
        </div>
    );
};
export default ActionButtons;
