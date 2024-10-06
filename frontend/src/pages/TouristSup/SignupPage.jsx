import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import MenuItem from "@mui/material/MenuItem";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    mobile: "",
    nationality: "",
    DOB: "",
    job: "",
    name: "",
  });
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
      .post("/tourist/createTourist", formData)
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

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up as Tourist
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              placeholder="Enter your Email"
              id="email"
              name="email"
              label="Email"
              variant="filled"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              label="Username"
              variant="filled"
              value={formData.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="filled"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="name"
              type="name"
              variant="filled"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="mobile"
              name="mobile"
              label="Mobile Number"
              variant="filled"
              value={formData.mobile}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="nationality"
              name="nationality"
              label="Nationality"
              variant="filled"
              value={formData.nationality}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="DOB"
              name="DOB"
              label=""
              type="date"
              variant="filled"
              value={formData.DOB}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="job"
              name="job"
              select
              label="job"
              variant="filled"
              value={formData.job}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="job">Job</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
      {response && <p>{response}</p>}
    </Container>
  );
};

export default SignupPage;
