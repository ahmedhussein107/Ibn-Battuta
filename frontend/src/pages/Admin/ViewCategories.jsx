import React, { useState, useEffect } from "react";
import {
	Paper,
	TextField,
	Button,
	Box,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import axiosInstance from "../../api/axiosInstance";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

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

const ViewCategories = () => {
	const [Categories, setCategories] = useState([]);
	const [open, setOpen] = useState(false);

	const [newCategory, setNewCategory] = useState("");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setNewCategory("");
	};

	const handleAddCategory = () => {
		axiosInstance
			.post("/category/createCategory", { _id: newCategory })
			.then((res) => {
				console.log("Category created: ", res.data);
				setCategories([...Categories, res.data]);
			})
			.catch((error) => {
				console.error("Error creating category: ", error);
			});
		setOpen(false);
		setNewCategory("");
	};

	useEffect(() => {
		axiosInstance
			.get("/category/allCategories")
			.then((res) => {
				setCategories(res.data);
			})
			.catch((error) => {
				console.error("Error fetching Categories: ", error);
			});
	}, []);

	const handleDelete = (categoryId) => {
		axiosInstance
			.delete(`/category/deleteCategoty/${categoryId}`)
			.then((res) => {
				console.log("Category deleted: ", res.data);
				setCategories(
					Categories.filter((category) => category._id !== categoryId)
				);
			})
			.catch((error) => {
				console.error("Error deleting category: ", error);
			});
	};

	const handleUpdate = (categoryId) => {
		axiosInstance
			.put(`/category/updateCategory/${categoryId}`)
			.then((res) => {
				console.log("Category updated: ", res.data);
				setCategories(
					Categories.filter((category) => category._id !== categoryId)
				);
			})
			.catch((error) => {
				console.error("Error updating category: ", error);
			});
	};

	return (
		<div style={styles.container}>
			<NavBar />
			{/* Search and New Category Button Section */}
			<Box sx={styles.searchBox}>
				{/* Search Bar */}
				<SearchBar />
				{/* New Category Button */}
				<Button
					sx={styles.dialogButton}
					onClick={handleOpen}
					variant="outlined"
					startIcon={<AddIcon />}
				>
					New Category
				</Button>
			</Box>

			{/* Categories Grid Section */}
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
					{Categories.map((category) => (
						<Chip
							key={category._id}
							label={category._id}
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
										onClick={() => handleDelete(category._id)}
									/>
								</Box>
							}
							onDelete={() => {}}
						/>
					))}
				</Box>
			</Paper>

			<Dialog
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: {
						backgroundColor: "#F5F5F5",
						borderRadius: 20,
						boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
						padding: "24px",
						width: "80vw",
						height: "50vh",
						display: "flex",
						flexDirection: "column",
						// alignItems: "center",
						// justifyContent: "center",
					},
				}}
			>
				<DialogTitle
					sx={{
						fontWeight: 600,
						fontSize: "20px",
						color: "#333333",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<IconButton
						onClick={handleClose}
						sx={{
							color: "#666666",
							position: "absolute",
							right: "24px",
							":hover": {
								color: "#333333",
							},
						}}
					>
						<CloseIcon />
					</IconButton>
					Add Category
				</DialogTitle>
				<DialogContent
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						// gap: "16px",
						flex: "1 0 auto",
					}}
				>
					<TextField
						autoFocus
						variant="outlined"
						label="Category"
						value={newCategory}
						onChange={(e) => setNewCategory(e.target.value)}
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: "20px",
								backgroundColor: "#FFFFFF",
								// padding: "8px 16px",
							},
						}}
					/>
				</DialogContent>
				<DialogActions
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						// gap: "16px",
					}}
				>
					<Button
						onClick={handleAddCategory}
						variant="contained"
						sx={{
							borderRadius: "20px",
							backgroundColor: "#FF6B6B",
							color: "#FFFFFF",
							width: "24%",
							"&:hover": {
								backgroundColor: "#FF4C4C",
							},
						}}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
			<Footer />
		</div>
	);
};

export default ViewCategories;
