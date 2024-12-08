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
                        border: "2px solid var(--accent-color)",
                        borderColor: "var(--accent-color)",
                        borderRadius: "10px",
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
};

export default DatePicker;
