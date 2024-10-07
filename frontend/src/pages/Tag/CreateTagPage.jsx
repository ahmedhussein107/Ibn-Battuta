import React, { useState } from "react";
import InputForm from "../../components/InputForm";
import { Button, Box, MenuItem, TextField } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

export const CreateTagPage = () => {
    const [data, setData] = useState({
        tag: "",
    });
    const [response, setResponse] = useState(null);

    const handleClick = () => {
        axiosInstance
            .post(`/tag/createTag`, { _id: data.tag })
            .then((response) => {
                console.log(response);
                setResponse("Created Successfully");
            })
            .catch((error) => {
                console.log(error);
                setResponse("error");
            });
    };
    return (
        <>
            <h2>Create a new Tag</h2>
            <InputForm data={data} setData={setData} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginBottom: "5vh",
                }}
            >
                <Button variant="contained" onClick={handleClick}>
                    Create
                </Button>
            </Box>
            {response && <p>{response}</p>}
        </>
    );
};
