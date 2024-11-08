import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axiosInstance from '../../api/axiosInstance';
import { uploadFiles } from '../../api/firebase';
import PhotosUpload from '../../components/PhotosUpload.jsx';
import Button from '../../components/Button.jsx';
import usePageHeader from '../../components/Header/UseHeaderPage.jsx';
import NavBar from '../../components/NavBar.jsx';
import Map from '../map';
import DatePicker from 'react-datepicker';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import 'react-datepicker/dist/react-datepicker.css';

const Popup = ({ message, onClose, isError }) => (
    <PopupContainer isError={isError}>
        <PopupContent>
            {message}
            <CloseButton onClick={onClose}>×</CloseButton>
        </PopupContent>
    </PopupContainer>
);



const DateModal = ({ isOpen, onClose, startDate, endDate, onDatesChange }) => {
    return (
        isOpen && (
            <ModalOverlay style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                zIndex: 1000, // Ensure modal is on top
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: 'blur(5px)', // Apply blur to the background
            }}>
                <ModalContent style={{
                    position: 'relative',
                    zIndex: 1001, // Modal content should be above overlay
                    backgroundColor: 'white', // White background for modal content
                    padding: '20px',
                    borderRadius: '8px',
                    maxWidth: '500px', // Adjust size as needed
                    width: '100%',
                }}>
                    {/* Close button in the top-right corner */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            zIndex: 1,
                        }}
                        onClick={onClose}
                    >
                        ✕
                    </div>

                    <h2>Select Dates</h2>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => onDatesChange(date, endDate)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        dateFormat="MMM dd, yyyy"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => onDatesChange(startDate, date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                        dateFormat="MMM dd, yyyy"
                    />
                </ModalContent>
            </ModalOverlay>
        )
    );
};

const defaultData = {
    name: '',
    startDate: '',
    endDate: '',
    time: '',
    latitude: 0,
    longitude: 0,
    category: '',
    tags: [],
    freeSpots: 0,
    isOpenForBooking: false,
    advertiserID: '67040377731df0ac20353236',
}

const CreateActivityPage = () => {
    const [formData, setFormData] = useState(defaultData);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [showDateModal, setShowDateModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');

    const toggleDateModal = () => {
        setShowDateModal(!showDateModal);
    };

    const handleDatesChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        const startString = start ? start.toLocaleDateString() : '';
        const endString = end ? end.toLocaleDateString() : '';
        setFormattedDate(`${startString} to ${endString}`);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('category/allCategories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get('tag/allTags');
                setTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchCategories();
        fetchTags();
    }, []);

    const handleInputChange = (e) => {
        let { name, value, type, checked } = e.target;

        if (type === 'number' && isNaN(value)) return;
        if (type == 'number') value = Math.max(value, 0);
        if (name == 'specialDiscount') value = Math.min(value, 100);
        if (name === 'tags') {
            if (checked) {
                setSelectedTags([...selectedTags, value]);
            } else {
                setSelectedTags(selectedTags.filter((tag) => tag !== value));
            }
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleStockChange = (change) => {
        setFormData((prev) => ({
            ...prev,
            freeSpots: Math.max(0, prev.freeSpots + change),
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
        if (
            !formData.name ||
            !formData.startDate ||
            !formData.endDate ||
            !formData.time ||
            !formData.price ||
            !formData.category ||
            imagePreviews.length === 0
        ) {
            showPopupMessage('Please fill out all required details.', true);
            return;
        }

        try {
            const files = imagePreviews.map((preview) => preview.file);
            const uploadedFileUrls = await uploadFiles(files, 'activities');

            const finalFormData = {
                ...formData,
                pictures: uploadedFileUrls,
                tags: selectedTags,
            };

            const response = await axiosInstance.post('activity/createActivity', finalFormData, {
                withCredentials: true,
            });
            console.log('Activity created:', response.data);

            showPopupMessage('Activity created successfully!', false);

            setFormData(defaultData);
            setImagePreviews([]);
            setSelectedTags([]);
        } catch (error) {
            console.error('Error creating activity:', error);
            showPopupMessage('Error creating activity. Please try again.', true);
        }
    };

    const handleImageAdd = (newImages) => {
        setImagePreviews((prev) => [...prev, ...newImages]);
    };

    const handleImageRemove = (idToRemove) => {
        setImagePreviews((prev) => prev.filter((image) => image.id !== idToRemove));
    };

    usePageHeader(
        'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHNvdXZlbmlyJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D',
        'Create a New Activity'
    );

    return (
        <PageContainer>
            <NavBar />
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
                                    placeholder="Insert Price here..."
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    style={{marginLeft: '11em'}}
                                />
                            </FlexGroup>

                            <FlexGroup>
                                <Label>Discount Percentage (%)</Label>
                                <Input
                                    type="number"
                                    name="specialDiscount"
                                    placeholder="Insert discount here..."
                                    value={formData.specialDiscount}
                                    onChange={handleInputChange}
                                    style={{marginLeft: '0.8em'}}
                                />
                            </FlexGroup>
                        </FormSection>

                        <FormSection>
                            <Label>Date & Time</Label>
                            <div style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '10vw'
                            }}>
                                <DateInput
                                    type="text"
                                    value={formattedDate}
                                    readOnly
                                    onClick={toggleDateModal}
                                    placeholder="Select Date"
                                    style={{fontSize: '0.9em', width: '100%', paddingRight: '2em'}} // Padding for icon space
                                />
                                <CalendarTodayIcon
                                    style={{
                                        position: 'absolute',
                                        right: '-1.7em',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        fontSize: '1.2em', // Adjust icon size as needed
                                        color: '#888' // Adjust color if needed
                                    }}
                                    onClick={toggleDateModal}
                                />
                            </div>

                        </FormSection>
                        <DateModal
                            isOpen={showDateModal}
                            onClose={toggleDateModal}
                            startDate={startDate}
                            endDate={endDate}
                            onDatesChange={handleDatesChange}
                        />


                        <FormSection>
                            <FlexGroup>
                                <Label>Category</Label>
                                <Select name="category" value={formData.category} onChange={handleInputChange}>
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category._id}
                                        </option>
                                    ))}
                                </Select>
                            </FlexGroup>

                            <FlexGroup>
                                <Label>Tags</Label>
                                <TagContainer>
                                    {tags.map((tag) => (
                                        <TagItem
                                            key={tag._id}
                                            value={tag._id}
                                            checked={selectedTags.includes(tag._id)}
                                            onChange={handleInputChange}
                                        >
                                            {tag._id}
                                        </TagItem>
                                    ))}
                                </TagContainer>
                            </FlexGroup>

                        </FormSection>
                        <FormSection>
                            <FlexGroup>
                                <Label>Free Spots</Label>
                                <StockControl>
                                    <StockButton type="button" onClick={() => handleStockChange(-1)}>
                                        -
                                    </StockButton>
                                    <StockDisplay>{formData.freeSpots}</StockDisplay>
                                    <StockButton type="button" onClick={() => handleStockChange(1)}>
                                        +
                                    </StockButton>
                                </StockControl>
                            </FlexGroup>

                            <FlexGroup>
                                <Label>Open for Booking</Label>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        name="isOpenForBooking"
                                        checked={formData.isOpenForBooking}
                                        onChange={handleInputChange}
                                    />
                                    <ToggleLabel />
                                </ToggleSwitch>
                            </FlexGroup>
                        </FormSection>
                    </div>

                    <div>
                        <PhotosUpload
                            label="Activity Photos"
                            imagePreviews={imagePreviews}
                            onImageAdd={handleImageAdd}
                            onImageRemove={handleImageRemove}
                        />

                        <FormSection>
                            <Label style={{marginLeft: '2em'}}>Pin Activity Location on Map</Label>
                            <Map setMarkerPosition={(position) => {
                                setFormData({ ...formData, latitude: position.lat, longitude: position.lng });
                            }} />
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
                            setSelectedTags([]);
                        }}
                        width="auto"
                    />
                    <Button
                        stylingMode="1"
                        text="Create Activity"
                        handleClick={handleSubmit}
                        width="auto"
                    />
                </ButtonGroup>
            </form>
        </PageContainer>
    );
};

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 30vw;
    min-height: 15vh;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;


const DateInput = styled.input`
    flex: 1;
    padding: 0.75em;
    border: 1px solid #e0e0e0;
    border-radius: 0.5em;
    margin-right: 0.5em;

    &::placeholder {
        color: #9e9e9e;
    }
`;

const DateIcon = styled.span`
    cursor: pointer;
    font-size: 1.5em;
`;

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
  color: ${({ isError }) => (isError ? '#721c24' : '#155724')};
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

const Input = styled.input`
  width: 20em;
  padding: 0.75em;
  
  border: 0.0625em solid #e0e0e0;
  border-radius: 0.5em;
  font-size: 1em;
  &::placeholder {
    color: #9e9e9e;
  }
`;



const Select = styled.select`
  width: 100%;
  padding: 0.75em;
  border: 0.0625em solid #e0e0e0;
  border-radius: 0.5em;
  font-size: 1em;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`;

const TagItem = styled.label`
  background-color: ${(props) => (props.checked ? '#f28b82' : '#f5f5f5')};
  color: ${(props) => (props.checked ? '#fff' : '#757575')};
  padding: 0.5em 1em;
  border-radius: 20px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.checked ? '#d77d7d' : '#e0e0e0')};
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .toggle-label {
    background-color: #f28b82;

    &:before {
      transform: translateX(1.5em);
    }
  }
`;

const ToggleLabel = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 2em;
  transition: background-color 0.2s;

  &:before {
    content: '';
    position: absolute;
    width: 1.5em;
    height: 1.5em;
    left: 0.25em;
    bottom: 0.25em;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }
`;

const ActivityPhotoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1.5em;
`;

const ActivityPhoto = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ChooseFileButton = styled.button`
  background-color: #f28b82;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.75em 1.5em;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d77d7d;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const BookingStatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2em;
`;

const BookingStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
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

const OpenStatus = styled.div`
  color: #4caf50;
`;

const ClosedStatus = styled.div`
  color: #f44336;
`;

const CapacityStatus = styled.div`
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  margin-top: 2em;
`;

const CancelButton = styled(Button)`
  stylingMode: '2';
  text: 'Cancel';
  width: 'auto';
`;

const CreateButton = styled(Button)`
  stylingMode: '1';
  text: 'Create Activity';
  width: 'auto';
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  padding: 0.75em;
  border: 0.0625em solid #e0e0e0;
  border-radius: 0.5em;
  font-size: 1em;
  resize: none; 
  min-height: 100px; /* Adjust as needed */
  &::placeholder {
    color: #9e9e9e;
  }
`;

const ActivityPhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5em;
`;

const ActivityPhotoLabel = styled(Label)`
  margin-bottom: 0.5em;
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 1em;
  margin-bottom: 1.5em;
`;

const DatePickerSection = styled.div`
  flex: 1;
`;

const TimePickerSection = styled.div`
  flex: 1;
`;

const CategorySection = styled.div`
  margin-bottom: 1.5em;
`;

const SelectedTagsSection = styled.div`
  margin-bottom: 1.5em;
`;

const TagDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`;

const Tag = styled.span`
  background-color: #f28b82; /* Tag background color */
  color: white;
  padding: 0.5em 1em;
  border-radius: 20px;
  font-size: 0.9em;
`;

const CapacityDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1em;
`;

const CapacityLabel = styled.span`
  font-size: 1em;
  font-weight: 500;
`;

const CapacityNumber = styled.span`
  font-size: 1.2em;
  font-weight: bold;
  color: #4caf50; /* Change color based on availability */
`;

const BookingStatusDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
`;

const BookingLabel = styled.span`
  font-size: 1em;
  font-weight: 500;
`;

const StockDisplay = styled.span`
  font-size: 1.2em; 
  font-weight: bold;
  color: #333; 
  min-width: 2em; 
  text-align: center; 
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

export default CreateActivityPage;