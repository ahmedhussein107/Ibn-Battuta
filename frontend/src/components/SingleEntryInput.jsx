import React, { useState } from "react";
import { TextField, Grid } from "@mui/material";

const SingleEntryInput = ({ placeholder, data, setData, label, width }) => {
    const [value, setValue] = useState(data[label]);

    const handleChange = (e) => {
        setValue(e.target.value);
        const newData = { ...data, [label]: e.target.value };
        console.log(newData);
        setData(newData);
    };
    return (
        <Grid item xs={width}>
            <TextField
                required
                fullWidth
                placeholder={placeholder}
                id={label}
                name={label}
                type={label === "password" ? label : "text"}
                label={label}
                variant="filled"
                value={value}
                onChange={handleChange}
            />
        </Grid>
    );
};

export default SingleEntryInput;
