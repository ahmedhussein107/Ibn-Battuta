import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const Sorter = ({ values, labels, value, setValue }) => {
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <FormControl
            sx={{
                backgroundColor: "#FFFBF3",
                borderRadius: "4px",
                padding: "2vh",
                width: "90%",
            }}
        >
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                {values.map((value, index) => (
                    <FormControlLabel
                        key={index}
                        value={value}
                        control={<Radio />}
                        label={labels[index]}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default Sorter;
