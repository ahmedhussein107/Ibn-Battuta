import React, { useState, useEffect } from "react";
import { Paper, TextField, Button, Box, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";
import SearchField from "../../components/SearchField/SearchField";
import categoryBackground from "../../assets/backgrounds/tags.png";
import CustomButton from "../../components/Button";
import PopUp from "../../components/PopUpsGeneric/PopUp";

import axiosInstance from "../../api/axiosInstance";
import Footer from "../../components/Footer";

const ViewCategories = () => {
	const [Categories, setCategories] = useState([]);
	const [open, setOpen] = useState(false);
	const [categoryName, setCategoryName] = useState("");
	const [newCategory, setNewCategory] = useState("");
	const [editingCategory, setEditingCategory] = useState(null);
	const [editedCategoryName, setEditedCategoryName] = useState("");

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

	const fetchCategories = async () => {
		const query = categoryName == "" ? {} : { _id: "~" + categoryName };
		await axiosInstance
			.get("/category/searchCategories/", {
				params: {
					...query,
				},
			})
			.then((res) => {
				console.log(res);
				setCategories(res.data);
			})
			.catch((error) => {
				console.error("Error fetching Categories: ", error);
			});
	};

	useEffect(() => {
		fetchCategories();
	}, [categoryName]);

	const handleDelete = (categoryId) => {
		axiosInstance
			.delete(`/category/deleteCategory/${categoryId}`)
			.then((res) => {
				console.log("Category deleted: ", res.data);
				setCategories(Categories.filter((category) => category._id !== categoryId));
			})
			.catch((error) => {
				console.error("Error deleting category: ", error);
			});
	};

	const handleEditStart = (category) => {
		setEditingCategory(category._id);
		setEditedCategoryName(category._id);
	};

	const handleEditCancel = () => {
		setEditingCategory(null);
		setEditedCategoryName("");
	};

	const handleEditConfirm = (categoryId) => {
		axiosInstance
			.put(`/category/updateCategory/${categoryId}`, { _id: editedCategoryName })
			.then((res) => {
				console.log("Category updated: ", res.data);
				// Update the categories list with the new name
				setCategories(
					Categories.map((category) =>
						category._id === categoryId
							? { ...category, _id: editedCategoryName }
							: category
					)
				);
				setEditingCategory(null);
			})
			.catch((error) => {
				console.error("Error updating category: ", error);
				setEditingCategory(null);
			});
	};

	return (
		<div style={styles.container}>
			<div
				style={{
					width: "100vw",
					height: "35vh",
					color: "#FAE2B6",
					backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${categoryBackground})`,
					backgroundSize: "100% 100%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					alignItems: "center",
				}}
			>
				<div style={{ marginLeft: "5%", marginBottom: "2%" }}>
					<p
						style={{
							fontSize: "2.5rem",
							marginBottom: "1rem",
							textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
							color: "white",
							fontWeight: "500",
							userSelect: "none",
						}}
					>
						Category
					</p>
				</div>
			</div>
			{open && (
				<PopUp
					isOpen={open}
					setIsOpen={setOpen}
					headerText={"Add new category"}
					handleSubmit={handleAddCategory}
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
							},
						}}
					/>
				</PopUp>
			)}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					marginLeft: "8%",
					marginRight: "8%",
				}}
			>
				<div>
					<SearchField
						placeholder={"Search by category"}
						searchText={categoryName}
						setSearchText={setCategoryName}
					/>
				</div>
				<CustomButton
					stylingMode="dark-when-hovered"
					text={"New Categoty"}
					handleClick={() => {
						setOpen(true);
					}}
					isLoading={false}
					width="14%"
					customStyle={{
						borderRadius: "60px",
						// border: "2px solid black",
						fontSize: "1rem",
						textAlign: "center",
					}}
					icon={<AddIcon sx={{ verticalAlign: "middle", marginRight: "5px" }} />}
				/>
			</div>
			{/* Categories Grid Section */}
			<div style={{ display: "flex", justifyContent: "center", height: "60vh" }}>
				<Paper
					elevation={3}
					sx={{
						p: 3,
						borderRadius: 4,
						bgcolor: "white",
						width: "80%",
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
								label={
									editingCategory === category._id ? (
										<TextField
											value={editedCategoryName}
											onChange={(e) => setEditedCategoryName(e.target.value)}
											variant="standard"
											InputProps={{ disableUnderline: true }}
											sx={{ width: "100%" }}
										/>
									) : (
										category._id
									)
								}
								sx={styles.chip}
								deleteIcon={
									editingCategory === category._id ? (
										<Box sx={{ display: "flex", gap: 0.5, mr: 1 }}>
											<CheckIcon
												sx={{
													fontSize: 16,
													cursor: "pointer",
													color: "#666666",
													":hover": { color: "#333333" },
												}}
												onClick={() => handleEditConfirm(category._id)}
											/>
											<CancelIcon
												sx={{
													fontSize: 16,
													cursor: "pointer",
													color: "#666666",
													":hover": { color: "#333333" },
												}}
												onClick={handleEditCancel}
											/>
										</Box>
									) : (
										<Box sx={{ display: "flex", gap: 0.5, mr: 1 }}>
											<EditIcon
												sx={{
													fontSize: 16,
													cursor: "pointer",
													color: "#666666",
													":hover": { color: "#333333" },
												}}
												onClick={() => handleEditStart(category)}
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
									)
								}
								onDelete={() => {}}
							/>
						))}
					</Box>
				</Paper>
			</div>
			<Footer />
		</div>
	);
};

const styles = {
	container: {
		width: "100vw",
		position: "absolute",
		top: "0",
		left: "0",
		display: "flex",
		flexDirection: "column",
		gap: "0.7rem",
		overflowX: "hidden",
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
		borderRadius: 25,
		boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
		bgcolor: "#EBE9E9",
		p: 1,
	},
	chip: {
		height: "5vh",
		borderRadius: "20px",
		width: "19%",
		padding: "8px 12px",
		backgroundColor: "#FCF3E2",
		display: "flex",
		justifyContent: "space-between",
		"& .MuiChip-label": {
			padding: 0,
		},
		border: "1px solid #666666",
	},
};

export default ViewCategories;
