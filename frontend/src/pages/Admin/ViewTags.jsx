import React, { useState, useEffect } from "react";
import { Paper, TextField, Box, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";
import SearchField from "../../components/SearchField/SearchField";
import tagsBackground from "../../assets/backgrounds/tags.png";
import CustomButton from "../../components/Button";
import PopUp from "../../components/PopUpsGeneric/PopUp";

import axiosInstance from "../../api/axiosInstance";
import Footer from "../../components/Footer";

const ViewTags = () => {
	const [tags, setTags] = useState([]);
	const [open, setOpen] = useState(false);
	const [newTag, setNewTag] = useState("");
	const [tagName, setTagName] = useState("");
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

	const fetchTags = async () => {
		const query = tagName == "" ? {} : { _id: "~" + tagName };
		await axiosInstance
			.get("/tag/searchTags/", {
				params: {
					...query,
				},
			})
			.then((res) => {
				setTags(res.data);
				console.log(res);
			})
			.catch((error) => {
				console.error("Error fetching tags: ", error);
			});
	};

	useEffect(() => {
		// setTags(result);
		fetchTags();
		// console.log(tagName);
	}, [tagName]);

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
			{open && (
				<PopUp
					isOpen={open}
					setIsOpen={setOpen}
					headerText={"Add new tag"}
					handleSubmit={handleAddTag}
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
				</PopUp>
			)}
			<div
				style={{
					width: "100vw",
					height: "35vh",
					color: "#FAE2B6",
					backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${tagsBackground})`,
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
						Tags
					</p>
				</div>
			</div>
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
						placeholder={"Search by tag"}
						searchText={tagName}
						setSearchText={setTagName}
					/>
				</div>
				<CustomButton
					stylingMode="dark-when-hovered"
					text={"New Tag"}
					handleClick={() => {
						setOpen(true);
					}}
					isLoading={false}
					width="10%"
					customStyle={{
						borderRadius: "60px",
						// border: "2px solid black",
						fontSize: "1rem",
						textAlign: "center",
					}}
					icon={<AddIcon sx={{ verticalAlign: "middle", marginRight: "5px" }} />}
				/>
			</div>

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

export default ViewTags;
