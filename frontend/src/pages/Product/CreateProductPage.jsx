import React, { useState } from 'react';
import styled from 'styled-components';
import PhotosUpload from './PhotosUpload';

const CreateProductPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: 2,
        archived: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStockChange = (change) => {
        setFormData(prev => ({
            ...prev,
            stock: Math.max(0, prev.stock + change)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <PageContainer>
            <Header>
                <Title>Create a New Product</Title>
            </Header>

            <form onSubmit={handleSubmit}>
                <FormContainer>
                    <div>
                        <FormSection>
                            <InputGroup>
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    placeholder="Insert title here..."
                                    value={formData.title}
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
                                    <StockButton onClick={() => handleStockChange(-1)}>-</StockButton>
                                    <StockDisplay>{formData.stock}</StockDisplay>
                                    <StockButton onClick={() => handleStockChange(1)}>+</StockButton>
                                </StockControl>
                            </FlexGroup>
                        </FormSection>
                    </div>

                    <div>
                        <PhotosUpload label="Product Photos" />

                        <FormSection>
                            <FlexGroup>
                                <Label>Archive</Label>
                                <ArchiveToggle>
                                    <ArchiveButton
                                        type="button"
                                        active={formData.archived}
                                        onClick={() => setFormData(prev => ({ ...prev, archived: true }))}
                                    >
                                        Yes
                                    </ArchiveButton>
                                    <ArchiveButton
                                        type="button"
                                        active={!formData.archived}
                                        onClick={() => setFormData(prev => ({ ...prev, archived: false }))}
                                    >
                                        No
                                    </ArchiveButton>
                                </ArchiveToggle>
                            </FlexGroup>
                        </FormSection>
                    </div>
                </FormContainer>

                <ButtonGroup>
                    <CancelButton type="button">Cancel</CancelButton>
                    <CreateButton type="submit">Create Product</CreateButton>
                </ButtonGroup>
            </form>
        </PageContainer>
    );
};

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
    margin-bottom: 1.5em;
`;

const Label = styled.label`
    display: block;
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 0.5em;
`;

const Input = styled.input`
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
    gap: 1em;
    margin-top: 2em;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Button = styled.button`
    padding: 0.75em 2em;
    border-radius: 0.5em;
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;

    @media (max-width: 768px) {
        width: 100%;
    }
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
    border-radius: 4px;
    cursor: pointer;
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
    background-color: ${({ active }) => (active ? '#f28b82' : '#f5f5f5')};
    color: ${({ active }) => (active ? '#fff' : '#757575')};
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ active }) => (active ? '#e64a19' : '#e0e0e0')};
    }
`;

export default CreateProductPage;