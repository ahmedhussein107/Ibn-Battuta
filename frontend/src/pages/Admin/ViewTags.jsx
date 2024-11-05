import React, { useState, useEffect } from "react";
import {
	Paper,
	Autocomplete,
	TextField,
	IconButton,
	Button,
	Box,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import axiosInstance from "../../api/axiosInstance";

// Define constants for styles
const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 20,
	},
	searchBox: {
		display: "flex",
		alignItems: "center",
		backgroundColor: "#FFFAFA",
		width: "100%",
		padding: "1rem",
		borderRadius: 5,
		boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
		maxWidth: 800,
		marginRight: 1,
		justifyContent: "space-between",
	},
	paper: {
		display: "flex",
		alignItems: "center",
		width: "100%",
		maxWidth: 600,
		borderRadius: 25,
		boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
		bgcolor: "#EBE9E9",
		p: 1,
	},
	searchInput: {
		ml: 1,
		justifyContent: "center",
		"& .MuiInput-underline:before": {
			borderBottom: "none",
		},
		"& .MuiInput-underline:after": {
			borderBottom: "none",
		},
		"& .MuiInput-underline:hover:not(.Mui-disabled):before": {
			borderBottom: "none",
		},
	},
	chip: {
		height: "auto",
		borderRadius: "20px",
		width: "9vw",
		padding: "8px 12px",
		backgroundColor: "#F5F5F5",
		display: "flex",
		justifyContent: "space-between",
		"& .MuiChip-label": {
			padding: 0,
		},
		border: "1px solid #666666",
	},
	dialogButton: {
		borderRadius: "24px",
		height: 40,
		px: 2,
		border: "2px solid #E0E0E0",
		color: "black",
		textTransform: "none",
		boxShadow: "none",
		"&:hover": {
			border: "1px solid #E0E0E0",
			bgcolor: "#F5F5F5",
		},
	},
};

const ViewTags = () => {
	const [searchValue, setSearchValue] = useState("");
	const [tags, setTags] = useState([]);
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		axiosInstance
			.get("/tag/allTags")
			.then((res) => {
				setTags(res.data);
			})
			.catch((error) => {
				console.error("Error fetching tags: ", error);
			});
	}, []);

	const handleDelete = (tagId) => {
		axiosInstance
			.delete(`/tag/deleteTag/${tagId}`)
			.then((res) => {
				console.log("Tag deleted: ", res.data);
				setTags(tags.filter((tag) => tag._id !== tagId));
			})
			.catch((error) => {
				console.error("Error deleting tag: ", error);
			});
	};

	const handleUpdate = (tagId) => {
		axiosInstance
			.put(`/tag/updateTag/${tagId}`)
			.then((res) => {
				console.log("Tag updated: ", res.data);
				setTags(tags.filter((tag) => tag._id !== tagId));
			})
			.catch((error) => {
				console.error("Error updating tag: ", error);
			});
	};

	return (
		<div style={styles.container}>
			{/* Search and New Tag Button Section */}
			<Box sx={styles.searchBox}>
				{/* Search Bar */}
				<Paper component="div" sx={styles.paper}>
					<IconButton
						onClick={() => {
							// Define what happens when the icon is clicked
							console.log("Search icon clicked");
						}}
						sx={{ color: "#666666" }}
					>
						<SearchIcon sx={{ color: "#666666", fontSize: 30 }} />
					</IconButton>
					<Autocomplete
						freeSolo
						value={searchValue}
						onChange={(event, newValue) => {
							setSearchValue(newValue);
						}}
						options={[]}
						sx={{
							flex: 1,
							"& .MuiOutlinedInput-root": {
								padding: 0,
							},
							"& .MuiAutocomplete-clearIndicator": {
								mr: 1,
							},
							borderRadius: 5,
							bgcolor: "#FFFFFF",
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Search"
								variant="standard"
								sx={styles.searchInput}
							/>
						)}
					/>
				</Paper>

				{/* New Tag Button */}
				<Button
					sx={styles.dialogButton}
					onClick={handleOpen}
					variant="outlined"
					startIcon={<AddIcon />}
				>
					New Tag
				</Button>
			</Box>

			{/* Tags Grid Section */}
			<Paper
				elevation={3}
				sx={{
					p: 3,
					borderRadius: 4,
					bgcolor: "white",
					width: "100%",
					maxWidth: 800,
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 1.5,
					}}
				>
					{tags.map((tag) => (
						<Chip
							key={tag._id}
							label={tag._id}
							sx={styles.chip}
							deleteIcon={
								<Box sx={{ display: "flex", gap: 0.5, mr: 1 }}>
									<EditIcon
										sx={{
											fontSize: 16,
											cursor: "pointer",
											color: "#666666",
											":hover": { color: "#333333" },
										}}
									/>

									<DeleteIcon
										sx={{
											fontSize: 16,
											cursor: "pointer",
											color: "#666666",
											":hover": { color: "#333333" },
										}}
										onClick={() => handleDelete(tag._id)}
									/>
								</Box>
							}
							onDelete={() => {}}
						/>
					))}
				</Box>
			</Paper>

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add Tag</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Tag"
						type="text"
						fullWidth
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button color="secondary" variant="contained">
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ViewTags;
