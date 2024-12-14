import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axiosInstance from "../../api/axiosInstance";
import { uploadFiles } from "../../api/firebase";
import PhotosUpload from "../../components/PhotosUpload.jsx";
import Button from "../../components/Button.jsx";
import usePageHeader from "../../components/Header/UseHeaderPage.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import PopUp from "../../components/PopUpsGeneric/PopUp.jsx";
import TextField from "@mui/material/TextField";
import CurrencyDropdown from "../../components/CurrencyDropdownList.jsx";

const EditProductPage = () => {
    const { productId } = useParams(); // Get product ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [imagePreviews, setImagePreviews] = useState([]);
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("EGP");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(
                    `/product/getProduct/${productId}`,
                    {
                        withCredentials: true,
                    }
                );

                const product = response.data;

                // Set form data from existing product
                setFormData({
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    quantity: product.quantity,
                    isArchived: product.isArchived,
                    pictures: product.pictures,
                });

                // Convert existing pictures to image preview format
                const previews = product.pictures.map((url, index) => ({
                    id: `existing-${index}`,
                    url,
                    isExisting: true,
                }));
                setImagePreviews(previews);
            } catch (error) {
                console.error("Error fetching product:", error);
                showPopupMessage("Error loading product details.", true);
                navigate(`/${Cookies.get("userType").toLowerCase()}/inventory`);
            }
        };

        fetchProduct();
    }, [productId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "price" && isNaN(value)) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStockChange = (change) => {
        setFormData((prev) => ({
            ...prev,
            quantity: Math.max(1, prev.quantity + change),
        }));
    };

    const showPopupMessage = (message, isError) => {
        setPopupMessage(message);
        setIsErrorPopup(isError);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description) {
            showPopupMessage("Please fill out all details.", true);
            return;
        }

        try {
            // Handle new file uploads
            const newFiles = imagePreviews
                .filter((preview) => !preview.isExisting)
                .map((preview) => preview.file);

            setIsLoading(true);

            let uploadedFileUrls = [];
            if (newFiles.length > 0) {
                uploadedFileUrls = await uploadFiles(newFiles, "products");
            }

            // Combine existing and new picture URLs
            const existingPictures = imagePreviews
                .filter((preview) => preview.isExisting)
                .map((preview) => preview.url);

            const finalFormData = {
                ...formData,
                pictures: [...existingPictures, ...uploadedFileUrls],
            };

            const response = await axiosInstance.patch(
                `/product/updateProduct/${productId}`,
                finalFormData
            );
            console.log("Product updated:", response.data);

            showPopupMessage("Product updated successfully!", false);
            setTimeout(
                () => navigate(`/${Cookies.get("userType").toLowerCase()}/inventory`),
                1000
            );
        } catch (error) {
            console.error("Error updating product:", error);
            showPopupMessage("Error updating product. Please try again.", true);
        }
    };

    const handleImageAdd = (newImages) => {
        setImagePreviews((prev) => [...prev, ...newImages]);
    };

    const handleImageRemove = (idToRemove) => {
        setImagePreviews((prev) => prev.filter((image) => image.id !== idToRemove));
    };

    const inputStyles = {
        width: "100%", // Or a specific value like "20rem"
        height: "3rem",
    };

    usePageHeader(
        "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHNvdXZlbmlyJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D",
        "Edit Product"
    );

    return (
        <PageContainer>
            {showPopup && (
                <PopUp
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                    isError={isErrorPopup}
                />
            )}

            <form style={{ marginTop: "35vh" }}>
                <FormContainer>
                    <div>
                        <FormSection>
                            <InputGroup>
                                <Label>Product Name</Label>
                                <TextField
                                    name="name"
                                    id="outlined-basic"
                                    // label="Insert title here..."
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={inputStyles}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Description</Label>
                                <TextField
                                    name="description"
                                    id="outlined-basic"
                                    //  label="Insert description here...."
                                    variant="outlined"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    style={inputStyles}
                                />
                            </InputGroup>

                            <FlexGroup>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column", // Stacks children vertically
                                        width: "100%", // Ensures the text field takes up the full width
                                        gap: "1rem", // Adds spacing between elements
                                    }}
                                >
                                    <Label>Price</Label>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column", // Stacks children vertically
                                            width: "100%", // Ensures the text field takes up the full width
                                            gap: "1rem", // Adds spacing between elements
                                        }}
                                    >
                                        <CurrencyDropdown
                                            selectedCurrency={selectedCurrency}
                                            setSelectedCurrency={setSelectedCurrency}
                                            style={{
                                                width: "100%", // Ensures the text field takes up the full width
                                            }}
                                        />

                                        <TextField
                                            name="price"
                                            id="outlined-basic"
                                            //  label="Insert Price here..."
                                            variant="outlined"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            style={{
                                                width: "100%", // Ensures the text field takes up the full width
                                            }}
                                            inputProps={{
                                                step: "0.01", // Allows decimal values if needed
                                                min: "0", // Enforces a minimum value of 0
                                            }}
                                        />
                                    </div>
                                </div>
                            </FlexGroup>

                            <FlexGroup>
                                <Label>Stock</Label>
                                <StockControl>
                                    <StockButton
                                        type="button"
                                        onClick={() => handleStockChange(-1)}
                                    >
                                        -
                                    </StockButton>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                quantity:
                                                    parseInt(e.target.value, 10) || 0,
                                            })
                                        }
                                        style={{
                                            width: "3em",
                                            textAlign: "center",
                                            fontSize: "1.2em",
                                            fontWeight: "bold",
                                            border: "none",
                                            outline: "none",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                    <StockButton
                                        type="button"
                                        onClick={() => handleStockChange(1)}
                                    >
                                        +
                                    </StockButton>
                                </StockControl>
                            </FlexGroup>
                        </FormSection>
                    </div>

                    <div>
                        <PhotosUpload
                            label="Product Photos"
                            imagePreviews={imagePreviews}
                            onImageAdd={handleImageAdd}
                            onImageRemove={handleImageRemove}
                        />

                        <FormSection style={{ marginTop: "4.5vh" }}>
                            <FlexGroup>
                                <Label>Archive</Label>
                                <div
                                    style={{
                                        display: "flex",
                                        borderRadius: "1em",
                                        overflow: "hidden",
                                        backgroundColor: "#eaeaea",
                                        padding: "0.2em",
                                        marginLeft: "5vw",
                                    }}
                                >
                                    <div
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                isArchived: true,
                                            }))
                                        }
                                        style={{
                                            padding: "0.5em 1em",
                                            cursor: "pointer",
                                            fontSize: "1em",
                                            fontWeight: "500",
                                            color: formData.isArchived
                                                ? "#a83232"
                                                : "#333",
                                            backgroundColor: formData.isArchived
                                                ? "#d9a56c"
                                                : "transparent",
                                            borderRadius: "1em",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Yes
                                    </div>
                                    <div
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                isArchived: false,
                                            }))
                                        }
                                        style={{
                                            padding: "0.5em 1em",
                                            cursor: "pointer",
                                            fontSize: "1em",
                                            fontWeight: "500",
                                            color: !formData.isArchived
                                                ? "#a83232"
                                                : "#333",
                                            backgroundColor: !formData.isArchived
                                                ? "#d9a56c"
                                                : "transparent",
                                            borderRadius: "1em",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        No
                                    </div>
                                </div>
                            </FlexGroup>
                        </FormSection>
                    </div>
                </FormContainer>

                <ButtonGroup>
                    <Button
                        stylingMode="dark-when-hovered"
                        text="Cancel"
                        handleClick={() =>
                            navigate(
                                `/${Cookies.get("userType").toLowerCase()}/inventory`
                            )
                        }
                        width="auto"
                    />
                    <Button
                        stylingMode="always-dark"
                        text="Save Changes"
                        handleClick={handleSubmit}
                        width="auto"
                        isLoading={isLoading}
                    />
                </ButtonGroup>
            </form>
        </PageContainer>
    );
};

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const PopupContainer = styled.div`
    position: fixed;
    top: 8em;
    right: 1em;
    z-index: 1000;
    animation: ${fadeIn} 0.3s ease;
    background-color: ${({ isError }) => (isError ? "#f8d7da" : "#d4edda")};
`;

const PopupContent = styled.div`
    color: ${({ isError }) => (isError ? "#721c24" : "#155724")}; // Dark red for error
    padding: 1em 1.5em;
    border-radius: 0.25em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1em;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.2em;
    cursor: pointer;
`;

const PageContainer = styled.div`
    width: 90vw;
    max-width: 75em;
    margin: 0 auto;
    padding: 2em;
`;

const FormContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4em;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormSection = styled.div`
    background: #ffffff;
    padding: clamp(1em, 3vw, 2em);
    border-radius: 1em;
    box-shadow: 0 0.125em 0.5em rgba(0, 0, 0, 0.3);
    margin-bottom: 2em;
`;

const InputGroup = styled.div`
    margin-bottom: 1.5em;
`;

const FlexGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
    min-height: 5em;
    margin-bottom: 1.5em;
`;

const Label = styled.label`
    display: block;
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 0.5em;
`;

const Input = styled.textarea`
    width: 50%;
    padding: 0.75em;
    border: 0.0625em solid #e0e0e0;
    border-radius: 0.5em;
    font-size: 1em;
    &::placeholder {
        color: #9e9e9e;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.75em;
    border: 0.0625em solid #e0e0e0;
    border-radius: 0.5em;
    font-size: 1em;
    min-height: 7.5em;
    resize: vertical;
    &::placeholder {
        color: #9e9e9e;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 1em;
    margin-top: 2em;
`;

const StockControl = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
`;

const StockButton = styled.button`
    background-color: #9c4f21;
    color: #fff;
    padding: 0.5rem;
    font-size: 1.2rem;
    border: none;
    min-width: 1.5em;
    border-radius: 0.3em;
    cursor: pointer;

    &:hover {
        color: black;
        background-color: #d9a56c;
    }
`;

export default EditProductPage;
