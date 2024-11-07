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
import { styled } from "@mui/system";
import axiosInstance from "../../api/axiosInstance";
import ConfirmationDialog from "../../components/ConfirmationDialog"; // Import the ConfirmationDialog component
import { useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
const UserManagement = () => {
	// const query = useLocation().search();
	const [users, setUsers] = useState([]);
	const [message, setMessage] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state
	const [selectedUser, setSelectedUser] = useState(null); // Track selected user ID
	const isAll = false;
	const models = {
		advertiser: "Advertiser",
		seller: "Seller",
		tourguide: "TourGuide",
		tourist: "Tourist",
		governor: "Governor",
		admin: "Admin",
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const uri = "admin/getUsers";
			const response = await axiosInstance.get(uri, {
				withCredentials: true,
				params: { isAccepted: isAll },
			});
			console.log(response.data);
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
			setMessage("Error fetching users. Please try again.");
		}
	};
	false;

	const handleDelete = async () => {
		try {
			const uri = `${selectedUser.role.toLowerCase()}/delete${
				models[selectedUser.role]
			}/${selectedUser._id}`;

			await axiosInstance.delete(uri);
			setMessage("User deleted successfully!");
			fetchUsers();
		} catch (error) {
			console.error("Error deleting user:", error);
			setMessage("Error deleting user. Please try again.");
		} finally {
			setSelectedUser(null);
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

	const RoleBadge = styled("span")(({ theme, role }) => ({
		padding: "4px 8px",
		borderRadius: "8px",
		color: "#FFFFFF",
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
			const uri = `${user.role.toLowerCase()}/update${models[user.role]}/${
				user._id
			}`;

			await axiosInstance.patch(uri, { isAccepted: true });
			setMessage("User Accepting successfully!");
			fetchUsers();
		} catch (error) {
			console.error("Error Accepting user:", error);
			setMessage("Error Accepting user. Please try again.");
		} finally {
			setSelectedUser(null);
			setIsDialogOpen(false);
		}
	};
	const CustomTable = (handleDelete) => {
		return (
			<Box sx={{ padding: 3, backgroundColor: "#F5F5F5" }}>
				<TableContainer
					component={Paper}
					sx={{ borderRadius: 4, overflow: "hidden" }}
				>
					<Table>
						<TableHead>
							<TableRow sx={{ backgroundColor: "#EDEDED" }}>
								<TableCell>Name</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Date</TableCell>

								{!isAll && (
									<>
										<TableCell>ID</TableCell>
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
											<Avatar src={user.avatar} alt={user.name} />
											{user.name}
										</Box>
									</TableCell>
									<TableCell>
										<RoleBadge role={user.role}>
											{user.role}
										</RoleBadge>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.createdAt}</TableCell>
									{!isAll && (
										<>
											<TableCell>document</TableCell>
											<TableCell>document</TableCell>
										</>
									)}

									<TableCell align="center">
										{isAll ? (
											<IconButton
												color="error"
												onClick={() => {
													openConfirmationDialog(user);
													console.log(user._id);
												}}
											>
												<DeleteIcon />
											</IconButton>
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
		<div>
			<NavBar />
			<h2>User Management</h2>
			{/* {userType && <h3>Displaying {userType} Accounts</h3>} */}
			{message && <p>{message}</p>}

			{/* Confirmation Dialog for Deleting User */}
			<ConfirmationDialog
				message="Are you sure you want to delete this user?"
				onConfirm={handleDelete}
				onCancel={closeConfirmationDialog}
				isOpen={isDialogOpen}
			/>
			<CustomTable />
			<Footer />
		</div>
	);
};

export default UserManagement;
