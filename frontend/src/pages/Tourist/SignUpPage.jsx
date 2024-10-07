import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography, Box } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import MenuItem from "@mui/material/MenuItem";
import InputForm from "../../components/InputForm";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        mobile: "",
        nationality: "",
        DOB: "",
        name: "",
    });

    const [job, setJob] = useState(null);
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance
            .post("/tourist/createTourist", { ...formData, job })
            .then((response) => {
                console.log("Created Successfully");
                setResponse("Created Successfully");
            })
            .catch((error) => {
                console.log(error);
                setResponse("error");
            });

        console.log("Form submitted:", formData);
    };

    const jobs = ["Student", "Engineer", "Doctor"];

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Sign Up as Tourist
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginBottom: "5vh",
                }}
            >
                <InputForm data={formData} setData={setFormData} />
                <TextField value={job} select onChange={(e) => setJob(e.target.value)}>
                    {jobs.map((job) => (
                        <MenuItem value={job}>{job}</MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" onClick={handleSubmit}>
                    Submit
                </Button>
                {response && <p>{response}</p>}
            </Box>
        </Container>
    );
};

export default SignUpPage;
