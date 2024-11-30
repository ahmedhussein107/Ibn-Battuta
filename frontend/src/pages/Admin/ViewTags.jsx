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
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";

import axiosInstance from "../../api/axiosInstance";
import SearchBar from "../../components/SearchBar";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const ViewTags = () => {
	const [tags, setTags] = useState([]);
	const [open, setOpen] = useState(false);
	const [newTag, setNewTag] = useState("");
	const [editingTag, setEditingTag] = useState(null);
	const [editedTagName, setEditedTagName] = useState("");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setNewTag("");
	};

	const handleAddTag = () => {
		axiosInstance
			.post("/tag/createTag", { _id: newTag })
			.then((res) => {
				console.log("Tag created: ", res.data);
				setTags([...tags, res.data]);
			})
			.catch((error) => {
				console.error("Error creating tag: ", error);
			});
		setOpen(false);
		setNewTag("");
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

	const handleEditStart = (tag) => {
		setEditingTag(tag._id);
		setEditedTagName(tag._id);
	};

	const handleEditCancel = () => {
		setEditingTag(null);
		setEditedTagName("");
	};

	const handleEditConfirm = (tagId) => {
		axiosInstance
			.put(`/tag/updateTag/${tagId}`, { _id: editedTagName })
			.then((res) => {
				console.log("Tag updated: ", res.data);
				setTags(
					tags.map((tag) => (tag._id === tagId ? { ...tag, _id: editedTagName } : tag))
				);
				setEditingTag(null);
			})
			.catch((error) => {
				console.error("Error updating tag: ", error);
				setEditingTag(null);
			});
	};

	return (
		<div style={styles.container}>
			<Box sx={styles.searchBox}>
				<SearchBar />
				<Button
					sx={styles.dialogButton}
					onClick={handleOpen}
					variant="outlined"
					startIcon={<AddIcon />}
				>
					New Tag
				</Button>
			</Box>

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
							label={
								editingTag === tag._id ? (
									<TextField
										value={editedTagName}
										onChange={(e) => setEditedTagName(e.target.value)}
										variant="standard"
										InputProps={{ disableUnderline: true }}
										sx={{ width: "100%" }}
									/>
								) : (
									tag._id
								)
							}
							sx={styles.chip}
							deleteIcon={
								editingTag === tag._id ? (
									<Box sx={{ display: "flex", gap: 0.5, mr: 1 }}>
										<CheckIcon
											sx={{
												fontSize: 16,
												cursor: "pointer",
												color: "#666666",
												":hover": { color: "#333333" },
											}}
											onClick={() => handleEditConfirm(tag._id)}
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
											onClick={() => handleEditStart(tag)}
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
								)
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
					Add Tag
				</DialogTitle>
				<DialogContent
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						flex: "1 0 auto",
					}}
				>
					<TextField
						autoFocus
						variant="outlined"
						label="Tag"
						value={newTag}
						onChange={(e) => setNewTag(e.target.value)}
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: "20px",
								backgroundColor: "#FFFFFF",
							},
						}}
					/>
				</DialogContent>
				<DialogActions
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Button
						onClick={handleAddTag}
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

export default ViewTags;
