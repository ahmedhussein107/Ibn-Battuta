import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

const RatingRange = ({ ratingRange, setRatingRange }) => {
    return (
        <Box
            sx={{
                "& > legend": { mt: 2 },
                backgroundColor: "#FCF3E2",
                padding: "2vh",
                borderRadius: "4px",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Box
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "3%",
                    }}
                >
                    <Typography
                        component="legend"
                        sx={{
                            fontWeight: "800",
                            fontFamily: "Inter",
                        }}
                    >
                        From
                    </Typography>
                    <Typography
                        component="legend"
                        sx={{
                            fontWeight: "800",
                            fontFamily: "Inter",
                        }}
                    >
                        To
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Rating
                        name="simple-controlled"
                        value={ratingRange[0]}
                        onChange={(event, newValue) => {
                            setRatingRange((current) => {
                                let newRatingRange = [newValue, current[1]];
                                newRatingRange.sort((a, b) => a - b);
                                return newRatingRange;
                            });
                        }}
                    />
                    <Rating
                        name="simple-controlled"
                        value={ratingRange[1]}
                        onChange={(event, newValue) => {
                            setRatingRange((current) => {
                                let newRatingRange = [current[0], newValue];
                                newRatingRange.sort((a, b) => a - b);
                                return newRatingRange;
                            });
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default RatingRange;
