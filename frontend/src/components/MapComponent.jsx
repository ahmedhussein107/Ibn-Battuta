import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import MenuItem from "@mui/material/MenuItem";
import MapComponent from "./MapComponent"; // Import the map component

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
    latitude: null,
    longitude: null,
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const setCoordinates = (lat, lng) => {
    setFormData((prevData) => ({
      ...prevData,
      latitude: lat,
      longitude: lng,
    }));
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
        setResponse("Error: " + error.message);
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
          {/* Email field */}
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

          {/* Username field */}
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

          {/* Password field */}
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

          {/* Name field */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              variant="filled"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          {/* Mobile field */}
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

          {/* Nationality field */}
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

          {/* Date of Birth field */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="DOB"
              name="DOB"
              label="Date of Birth"
              type="date"
              variant="filled"
              value={formData.DOB}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Job field */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="job"
              name="job"
              select
              label="Job"
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

          {/* Map Component for selecting location */}
          <Grid item xs={12}>
            <Typography variant="h6">Select Your Location</Typography>
            <MapComponent setCoordinates={setCoordinates} />
          </Grid>

          {/* Submit button */}
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
