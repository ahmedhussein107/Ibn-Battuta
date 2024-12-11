import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Avatar,
	IconButton,
	Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { styled } from "@mui/system";
import axiosInstance from "../../api/axiosInstance";
import ConfirmationDialog from "../../components/ConfirmationDialog"; // Import the ConfirmationDialog component
import "./UserManagement.css";
import ActionButtonsForUsers from "./ActionButtonsForUsers";
import PaginationComponent from "../../components/Pagination";
import CreateUserPopUp from "./CreateUserPopUp";
import usePageHeader from "../../components/Header/UseHeaderPage";
import { use } from "react";
const UserManagement = ({ isAll = true }) => {
	usePageHeader("/users.png", "User Management");
	const [users, setUsers] = useState([]);
	const [message, setMessage] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state
	const [selectedUser, setSelectedUser] = useState(null); // Track selected user ID
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(4);
	const [searchText, setSearchText] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [toBeCreatedUserType, setToBeCreatedUserType] = useState("");
	const maxUserPerPage = 10;
	const models = {
		advertiser: "Advertiser",
		seller: "Seller",
		tourguide: "TourGuide",
		tourist: "Tourist",
		governor: "Governor",
		admin: "Admin",
	};

	const handlePageChange = (_, newPage) => {
		setCurrentPage(newPage);
	};

	useEffect(() => {
		fetchUsers();
	}, [currentPage, searchText, isAll]);

	const fetchUsers = async () => {
		try {
			const uri = "admin/getUsers";
			const response = await axiosInstance.get(uri, {
				withCredentials: true,
				params: {
					isAccepted: isAll,
					page: currentPage,
					name: searchText,
					pageSize: maxUserPerPage,
				},
			});
			setUsers(response.data.result);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error("Error fetching users:", error);
			setMessage("Error fetching users. Please try again.");
		}
	};

	const handleDelete = async () => {
		try {
			console.log("selectedUser", selectedUser._id);
			console.log("1");
			const uri = `${selectedUser.role.toLowerCase()}/delete${
				models[selectedUser.role]
			}?userId=${selectedUser._id}`;
			console.log(uri);
			await axiosInstance.delete(uri, { withCredentials: true });
			console.log("3");
			setMessage("User deleted successfully!");
			fetchUsers();
		} catch (error) {
			console.error("Error deleting user:", error);
			setMessage("Error deleting user. Please try again.");
			alert(error.response.data.message);
		} finally {
			setSelectedUser(null);
			setIsDialogOpen(false);
		}
	};
	const addPoints = async (touristID) => {
		try {
			const uri = `tourist/updateTourist`;
			await axiosInstance.put(
				uri,
				{
					wallet: 1000000,
				},
				{ withCredentials: true, params: { userId: touristID } }
			);
			setMessage("Points added successfully!");
		} catch (error) {
			console.error("Error adding point  user:", touristID, error);
			setMessage("Error adding points. Please try again.");
		} finally {
			setIsDialogOpen(false);
		}
	};

	// Open the confirmation dialog and store the selected user ID
	const openConfirmationDialog = (user) => {
		setSelectedUser(user);
		setIsDialogOpen(true);
	};

	const closeConfirmationDialog = () => {
		setSelectedUser(null);
		setIsDialogOpen(false);
	};
	const setSearchTextAndClearPages = (text) => {
		setSearchText(text);
		setCurrentPage(1);
	};

	const RoleBadge = styled("span")(({ theme, role }) => ({
		padding: "4px 8px",
		borderRadius: "8px",
		color: "black",
		fontSize: "0.8rem",
		backgroundColor:
			{
				admin: "#D1C4E9",
				tourguide: "#B3E5FC",
				governor: "#BBDEFB",
				advertiser: "#FFCCBC",
				seller: "#C8E6C9",
				tourist: "#FFCDD2",
			}[role] || "#E0E0E0",
	}));

	const handleAcceptUser = async (user) => {
		try {
			console.log("selectedUser", user._id);
			const uri = `${user.role.toLowerCase()}/update${models[user.role]}?userId=${user._id}`;
			console.log(uri);
			await axiosInstance.put(uri, { isAccepted: true }, { withCredentials: true });
			setMessage("User Accepted successfully!");
			fetchUsers();
		} catch (error) {
			console.error("Error Accepting user:", error);
			setMessage("Error Accepting user. Please try again.");
		} finally {
			setSelectedUser(null);
			setIsDialogOpen(false);
		}
	};
	const CustomTable = () => {
		return (
			<Box
				sx={{
					padding: 3,
					backgroundColor: "#FFFFFF",
					borderRadius: 4,
					overflow: "hidden",
					boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
					width: "90%",
					margin: "auto",
				}}
			>
				<TableContainer
					component={Paper}
					sx={{
						borderRadius: 4,
						overflow: "hidden",
						boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow to the border
						width: "100%",
						margin: "auto",
						justifyContent: "center",
					}}
				>
					<Table>
						<TableHead>
							<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
								{" "}
								{/* Edit the table head color */}
								<TableCell>Name</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Date</TableCell>
								{!isAll && (
									<>
										<TableCell>ID </TableCell>
										<TableCell>Documents</TableCell>
									</>
								)}
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 2,
											}}
										>
											<Avatar src={user.picture} alt={user.name} />
											{user.name}
										</Box>
									</TableCell>
									<TableCell>
										<RoleBadge role={user.role}>{user.role}</RoleBadge>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{
											new Date(user.createdAt)
												.toLocaleString("en-GB")
												.split(",")[0]
										}{" "}
									</TableCell>
									{!isAll && (
										<>
											<TableCell>
												<FilePresentIcon
													sx={{
														marginRight: "0.5rem",
														fontSize: "1.2em",
														verticalAlign: "middle",
													}}
												/>
												<a
													href={user.documents?.[0]}
													target={user.documents?.[0]}
												>
													id
												</a>
											</TableCell>
											<TableCell>
												{user.documents.slice(1).map((doc, index) => (
													<>
														<FilePresentIcon
															sx={{
																marginRight: "0.5rem",
																fontSize: "1.2em",
																verticalAlign: "middle",
															}}
														/>
														<a href={doc} target={doc}>
															doc{index + 1}
														</a>
													</>
												))}
											</TableCell>
										</>
									)}
									<TableCell align="center">
										{isAll ? (
											<div>
												{user.role.toLowerCase() === "tourist" && (
													<IconButton
														sx={{
															borderRadius: "4px",
															border: "1px solid #E0E0E0",
															marginRight: "20px",
															backgroundColor: "#F5F5F5",
														}}
														onClick={() => {
															addPoints(user._id);
														}}
													>
														<AddIcon />
														1000,000 EGP
													</IconButton>
												)}
												<IconButton
													color="error"
													onClick={() => {
														openConfirmationDialog(user);
														console.log(user._id);
													}}
												>
													<DeleteIcon />
												</IconButton>
											</div>
										) : (
											<div>
												<IconButton
													color="error"
													onClick={() => {
														openConfirmationDialog(user);
														console.log(user._id);
													}}
												>
													<ClearIcon />
												</IconButton>
												<IconButton
													color="success"
													onClick={() => handleAcceptUser(user)}
												>
													<CheckIcon />
												</IconButton>
											</div>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		);
	};

	return (
		<div className="user-management-container">
			<CreateUserPopUp userType={toBeCreatedUserType} isOpen={isOpen} setIsOpen={setIsOpen} />
			<ActionButtonsForUsers
				searchText={searchText}
				setSearchText={setSearchTextAndClearPages}
				isAll={isAll}
				setIsOpen={setIsOpen}
				setUserType={setToBeCreatedUserType}
			/>
			{message && <p>{message}</p>}

			<ConfirmationDialog
				message="Are you sure you want to delete this user?"
				onConfirm={handleDelete}
				onCancel={closeConfirmationDialog}
				isOpen={isDialogOpen}
			/>
			<hr style={{ width: "90%", margin: "1% auto" }} />
			<CustomTable />
			<PaginationComponent
				totalPages={totalPages}
				currentPage={currentPage}
				onChange={handlePageChange}
			/>
		</div>
	);
};

export default UserManagement;
