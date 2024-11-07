import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axiosInstance from '../../api/axiosInstance';
import { uploadFiles } from '../../api/firebase';
import PhotosUpload from './PhotosUpload';
import Button from '../../components/Button.jsx';
import usePageHeader from "../../components/Header/UseHeaderPage.jsx";


const Popup = ({ message, onClose, isError }) => (
    <PopupContainer isError={isError}>
        <PopupContent>
            {message}
            <CloseButton onClick={onClose}>×</CloseButton>
        </PopupContent>
    </PopupContainer>
);

const defaultData = {
    pictures: [],
    name: '',
    price: 0,
    description: '',
    quantity: 1,
    isArchived: false,
}

const CreateProductPage = () => {
    const [formData, setFormData] = useState(defaultData);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isErrorPopup, setIsErrorPopup] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price' && isNaN(value)) return;

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStockChange = (change) => {
        setFormData(prev => ({
            ...prev,
            quantity: Math.max(1, prev.quantity + change)
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
        if (!formData.name || !formData.description || imagePreviews.length === 0) {
            showPopupMessage('Please fill out all details.', true);
            return;
        }

        try {
            const files = imagePreviews.map(preview => preview.file);
            const uploadedFileUrls = await uploadFiles(files, 'products');

            const finalFormData = {
                ...formData,
                pictures: uploadedFileUrls,
            };

            const response = await axiosInstance.post('/product/createProduct', finalFormData, {
                withCredentials: true,
            });
            console.log('Product created:', response.data);

            showPopupMessage('Product created successfully!', false);

            setFormData(defaultData);
            setImagePreviews([]);
        } catch (error) {
            console.error('Error creating product:', error);
            showPopupMessage('Error creating product. Please try again.', true);
        }
    };

    const handleImageAdd = (newImages) => {
        setImagePreviews(prev => [...prev, ...newImages]);
    };

    const handleImageRemove = (idToRemove) => {
        setImagePreviews(prev => prev.filter(image => image.id !== idToRemove));
    };

    usePageHeader(
        "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHNvdXZlbmlyJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D",
        "Create a New Product"
        );

    return (
        <PageContainer>

            {showPopup && (
                <Popup
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                    isError={isErrorPopup}
                />
            )}

            <form>
                <FormContainer>
                    <div>
                        <FormSection>
                            <InputGroup>
                                <Label>Product Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Insert name here..."
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Description</Label>
                                <TextArea
                                    name="description"
                                    placeholder="Insert description here...."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                        </FormSection>

                        <FormSection>
                            <FlexGroup>
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    placeholder="Insert price here..."
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </FlexGroup>

                            <FlexGroup>
                                <Label>Stock</Label>
                                <StockControl>
                                    <StockButton type="button" onClick={() => handleStockChange(-1)}>-</StockButton>
                                    <StockDisplay>{formData.quantity}</StockDisplay>
                                    <StockButton type="button" onClick={() => handleStockChange(1)}>+</StockButton>
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

                        <FormSection>
                            <FlexGroup>
                                <Label>Archive</Label>
                                <ArchiveToggle>
                                    <ArchiveButton
                                        type="button"
                                        active={formData.isArchived}
                                        onClick={() => setFormData(prev => ({ ...prev, isArchived: true }))}
                                    >
                                        Yes
                                    </ArchiveButton>
                                    <ArchiveButton
                                        type="button"
                                        active={!formData.isArchived}
                                        onClick={() => setFormData(prev => ({ ...prev, isArchived: false }))}
                                    >
                                        No
                                    </ArchiveButton>
                                </ArchiveToggle>
                            </FlexGroup>
                        </FormSection>
                    </div>
                </FormContainer>

                <ButtonGroup>
                    <Button
                        stylingMode="2"
                        text="Cancel"
                        handleClick={() => {
                            setFormData(defaultData);
                            setImagePreviews([]);
                        }}
                        width="auto"
                    />
                    <Button
                        stylingMode="1"
                        text="Create Product"
                        handleClick={handleSubmit}
                        width="auto"
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
    background-color: ${({ isError }) => (isError ? '#f8d7da' : '#d4edda')}; 
`;

const PopupContent = styled.div`
    color: ${({ isError }) => (isError ? '#721c24' : '#155724')}; // Dark red for error
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

const Header = styled.div`
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('/store-background.jpg') center/cover;
    height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 2em;
`;

const Title = styled.h1`
    font-size: clamp(1.5em, 4vw, 2.5em);
    font-weight: bold;
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
    background: #FAF4F4;
    padding: clamp(1em, 3vw, 2em);
    border-radius: 1em;
    box-shadow: 0 0.125em 0.5em rgba(0, 0, 0, 0.1);
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

const CancelButton = styled(Button)`
    background-color: transparent;
    border: 0.0625em solid #ff5722;
    color: #ff5722;
    &:hover {
        background-color: #fff5f2;
    }
`;

const CreateButton = styled(Button)`
    background-color: #ff5722;
    color: white;
    &:hover {
        background-color: #f4511e;
    }
`;

const StockControl = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
`;

const StockButton = styled.button`
    background-color: #f28b82;
    color: #fff;
    padding: 0.5rem;
    font-size: 1.2rem;
    border: none;
    min-width: 1.5em;
    border-radius: 0.3em;
    cursor: pointer;

    &:hover {
        background-color: #d77d7d; 
    }
`;

const StockDisplay = styled.span`
    font-size: 1.2em;
    font-weight: 500;
`;

const ArchiveToggle = styled.div`
    display: flex;
    gap: 0.5em;
`;

const ArchiveButton = styled.button`
    padding: 0.5em 1.5em;
    border-radius: 20px;
    min-height: 2.5em;
    margin-right: 1em;
    background-color: ${({ active }) => (active ? '#f28b82' : '#f5f5f5')};
    color: ${({ active }) => (active ? '#fff' : '#757575')};
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ active }) => (active ? '#d77d7d' : '#e0e0e0')};
    }
`;

export default CreateProductPage;