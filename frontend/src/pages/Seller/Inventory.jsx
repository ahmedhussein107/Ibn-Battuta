import React, { useEffect, useState } from "react";
import i1 from "../../assets/images/inventory.png";
import i2 from "../../assets/images/i2.png";
import NavBar from "../../components/NavBar";
import { Avatar } from "@mui/material";
import { orange } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import DateIcon from "@mui/icons-material/DateRange";
import Footer from "../../components/Footer";
import Button from "@mui/material/Button";
import CustomButton from "../../components/Button";
import AddIcon from "@mui/icons-material/Add";
import SwapVert from "@mui/icons-material/SwapVert";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import CardProduct from "../../components/CardProduct";
import DeleteButton from "../../components/DeleteButton";
import usePageHeader from "../../components/Header/UseHeaderPage";

const Inventory = () => {
	const navigate = useNavigate();
	usePageHeader(null, null);
	const [products, setProducts] = useState([]);
	const [searchedTerm, setSearchedTerm] = useState("");
	const [sortBy, setSortBy] = useState("Newest");
	// I want to change every thing to products
	const sortProducts = (products) => {
		console.log("Sort By", sortBy);
		let sortedProducts = [...products]; // Create a shallow copy
		if (sortBy === "Newest") {
			sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		} else if (sortBy === "Oldest") {
			sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		}
		console.log("sortedProducts", sortedProducts);
		setProducts(sortedProducts);
	};

	const fetchData = async (query) => {
		try {
			const response = await axiosInstance.get(`/product/getProductsById`, {
				params: query,
				withCredentials: true,
			});
			const data = response.data;
			sortProducts(data);
			console.log("response gata is", data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const buildQuery = () => {
		const query = {};

		if (searchedTerm) {
			query.name = "~" + searchedTerm;
		}

		return query;
	};

	useEffect(() => {
		const query = buildQuery();
		fetchData(query);
	}, [searchedTerm]);

	useEffect(() => {
		sortProducts(products);
	}, [sortBy]);

	const deleteProductHandler = async (productID) => {
		const response = await axiosInstance.delete(`/product/deleteProduct/${productID}`);
		if (response.status === 200) {
			setProducts(products.filter((product) => product._id !== productID));
		} else {
			alert("Error deleting itinerary");
		}
	};

	const archiveProductHandler = async (product) => {
		try {
			await axiosInstance.patch(`/product/archiveProduct/${product._id}`);
		} catch (error) {
			console.error("Error archiving product", error);
		}
	};

	const unarchiveProductHandler = async (product) => {
		try {
			await axiosInstance.patch(`/product/unarchiveProduct/${product._id}`);
			product.isArchived = false;
		} catch (error) {
			console.error("Error unarchiving product", error);
		}
	};

	return (
		<div style={{ position: "absolute", left: 0, top: 0 }}>
			<div
				style={{
					position: "fixed",
					top: 0,
					left: "9%",
					zIndex: 1,
				}}
			>
				<NavBar />
			</div>

			<div>
				<div style={{ position: "relative" }}>
					<img
						src={i1}
						style={{
							width: "100vw",
							height: "35vh",
							pointerEvents: "none",
							zIndex: -1,
						}}
					/>
					<img
						src={i2}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100vw",
							height: "35vh",
							pointerEvents: "none",
							zIndex: 0, // This will place the second image on top of the first
						}}
					/>
				</div>

				<div
					style={{
						position: "absolute",
						top: "18vh",
						left: "46.5vw",
						fontSize: "3.2vh",
						fontWeight: "bold",
						color: "White",
						pointerEvents: "none",
					}}
				>
					Inventory
				</div>

				<div
					style={{
						position: "absolute",
						top: "24vh",
						left: "41vw",
						display: "flex",
						alignItems: "center",
					}}
				>
					<div>
						<input
							type="text"
							placeholder="Search for Products"
							value={searchedTerm}
							onChange={(e) => setSearchedTerm(e.target.value)}
							style={{
								borderRadius: "4vh",
								minWidth: "18vw",
								minHeight: "3vh",
								backgroundColor: "white",
								outline: "none",
								padding: ".8vh 1.7vh",
								fontSize: "1.8vh",
							}}
						/>
						<Avatar
							sx={{
								position: "absolute",
								width: "2.7vw",
								height: "4.8vh",
								marginLeft: "17.7vw",
								marginTop: "-4.82vh",
								bgcolor: orange[700],
							}}
						>
							<SearchIcon />
						</Avatar>
					</div>

					<div />
				</div>
				<Button
					style={{
						marginLeft: "2vw",
						borderRadius: "4vh",
						minWidth: "2vw",
						color: "black",
						borderColor: "black",
						maxHeight: "4.2vh",
					}}
					variant="outlined"
					onClick={() => {
						setSortBy((prev) => (prev === "Newest" ? "Oldest" : "Newest"));
					}}
				>
					<SwapVert sx={{ fontSize: "3vh" }} />
					<p style={{ marginLeft: ".3vw" }}>Sort by Date</p>
				</Button>
				<Button
					style={{
						marginLeft: "2vw",
						borderRadius: "4vh",
						minWidth: "1vw",
						color: "black",
						borderColor: "black",
						maxHeight: "4.2vh",
					}}
					variant="outlined"
					onClick={() => {
						navigate("/create-product");
					}}
				>
					<AddIcon sx={{ fontSize: "3vh" }} />
					<p style={{ marginLeft: ".3vw" }}>Create Product</p>
				</Button>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "4vh",
						marginTop: "-1vh",
					}}
				>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							marginTop: "-1vh",
							minHeight: "50vh",
						}}
					>
						<div
							style={{
								marginTop: "1%",
								minHeight: "50vh",
								minWidth: "100vw",
								display: "flex",
								flexWrap: "wrap",
								justifyContent: "space-evenly",
							}}
						>
							{products.map((product) => (
								<div style={{ padding: "1.5vh" }}>
									<CardProduct
										product={product}
										width={"45vw"}
										height={"32vh"}
										line2={
											<div
												style={{
													display: "flex",
													flexDirection: "row",
													gap: "3vw",
												}}
											>
												<div>
													<span
														style={{
															color: "white",
															backgroundColor: "red",
															borderRadius: "50%",
															fontSize: "1rem",
															padding: "0.2rem",
														}}
													>
														{product.quantity}
													</span>
													{" in stock"}
												</div>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.5vw",
													}}
												>
													<DateIcon style={{ fontSize: "2vh" }} />
													{new Date(
														product.createdAt
													).toLocaleDateString()}
												</div>
											</div>
										}
										firstLineButtons={[
											[
												<DeleteButton
													ID={product._id}
													deleteHandler={deleteProductHandler}
												/>,
											],
										]}
										controlButtons={
											<>
												<CustomButton
													stylingMode="1"
													text="Edit"
													width="70%"
													height="30%"
													customStyle={{
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}
												/>
												<CustomButton
													stylingMode="2"
													text={
														product.isArchived ? "Unarchive" : "Archive"
													}
													width="70%"
													height="30%"
													customStyle={{
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
														color: product.isArchived ? "red" : "green",
														borderColor: product.isArchived
															? "red"
															: "green",
														"&:hover": {
															backgroundColor: product.isArchived
																? "red"
																: "green",
														},
													}}
													handleClick={() => {
														product.isArchived
															? unarchiveProductHandler(product)
															: archiveProductHandler(product);
														window.location.reload();
													}}
												/>
											</>
										}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
};

export default Inventory;
