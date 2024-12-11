import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePicker = ({ label, setValue }) => {
    const handleChange = (newValue) => {
        try {
            console.log("date selected is: ", newValue.toISOString());
            setValue(newValue.toISOString());
        } catch (err) {
            console.log(err);
            setValue("");
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
                components={["DatePicker"]}
                sx={{
                    marginRight: "5%",
                }}
            >
                <MUIDatePicker
                    label={label}
                    onChange={handleChange}
                    sx={{
                        '& .MuiInputLabel-root': {
                            '&.Mui-focused': {
                                color: 'var(--accent-color)',
                            }
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: "var(--accent-color)",
                            },
                            '&:hover fieldset': {
                                borderColor: "var(--accent-color)",
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: "var(--accent-color)",
                            }
                        }
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
};

export default DatePicker;
