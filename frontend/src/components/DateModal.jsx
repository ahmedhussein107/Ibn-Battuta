import DatePicker from "react-datepicker";
import React from "react";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css"; // Ensure that DatePicker styles are imported

const DateModal = ({ isOpen, onClose, startDate, endDate, onDatesChange }) => {
    return (
        isOpen && (
            <ModalOverlay>
                <ModalContent>
                    <CloseButton onClick={onClose}>✕</CloseButton>

                    <DateSelectionContainer>
                        <DatePickerContainer>
                            <label>Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => onDatesChange(date, endDate)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                dateFormat="MMM dd, yyyy"
                                customInput={<CustomInput />}
                            />
                        </DatePickerContainer>

                        {endDate && (
                            <>
                                <DateSeparator>to</DateSeparator>

                                <DatePickerContainer>
                                    <label>End Date</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) =>
                                            onDatesChange(startDate, date)
                                        }
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        placeholderText="End Date"
                                        dateFormat="MMM dd, yyyy"
                                        customInput={<CustomInput />}
                                    />
                                </DatePickerContainer>
                            </>
                        )}
                    </DateSelectionContainer>

                    <DatePickerStyles />
                </ModalContent>
            </ModalOverlay>
        )
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
    z-index: 1000; /* Ensure overlay is above all content */
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 30vw;
    min-height: 15vh;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1001; /* Ensure modal content is above the overlay */
`;

const CloseButton = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 24px;
    color: #333;
    z-index: 1002; /* Ensure the close button is above all else */
`;

const DateSelectionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
`;

const DatePickerContainer = styled.div`
    flex: 1;
    margin-right: 10px;

    label {
        display: block;
        font-size: 1.4vh;
        color: #9c4f21;
        margin-bottom: 5px;
    }
`;

const DateSeparator = styled.div`
    margin-top: 3vh;
    padding: 2em;
    color: #9c4f21;
    font-size: 1.6vh;
    text-align: center;
`;

const CustomInput = styled.input`
    width: 100%;
    padding: 0.5em;
    font-size: 1.8vh;
    border: none;
    outline: none;
    background-color: #f5f5f5;
`;

const DatePickerStyles = () => (
    <style>
        {`
        .react-datepicker {
            font-family: inherit;
            border: none;
            box-shadow: 0 0.2vh 1vh rgba(0, 0, 0, 0.1);
            z-index: 1003; /* Ensure date picker is above everything */
        }

        .react-datepicker__month-container {
            padding: 1vh;
        }

        .react-datepicker__header {
            background-color: white;
            border-bottom: none;
            padding-top: 1vh;
        }

        .react-datepicker__day {
            width: 3vh;
            height: 3vh;
            line-height: 3vh;
            margin: 0.2vh;
            border-radius: 50%;
        }

        .react-datepicker__day--in-range {
            background-color: #EDC294; /* Light orange for in-range */
            color: #333;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
            background-color: #9C4F21; /* Match selected color */
            color: white;
        }

        .react-datepicker__day:hover {
            background-color: #ffe8e8; /* Light orange on hover */
            color: #333;
        }

        .react-datepicker__navigation {
            top: 1vh;
        }
        `}
    </style>
);

export default DateModal;
