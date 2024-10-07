import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfileOptionalEdit from "../../components/UserProfileOptionalEdit";

export default function SellerProfilePage() {
	const sellerId = "67035621d0a76d4192743905";
	const [seller, setSeller] = useState(null);
	const [nonnmodifiable, setNonmodifiable] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const [response, setResponse] = useState(null);

	useEffect(() => {
		axiosInstance
			.get(`/seller/seller/${sellerId}`)
			.then((response) => {
				const {
					_id,
					__v,
					createdAt,
					updatedAt,
					document,
					notifications,
					isAccepted,
					...seller
				} = response.data;
				setNonmodifiable({ username: seller.username, email: seller.email });
				setSeller(seller);
				console.log("seller:", seller);
				setNotifications(notifications);
			})
			.catch((error) => {
				console.error("Error fetching Seller:", error);
			});
	}, []);

	const handleClick = () => {
		axiosInstance
			.patch(`/seller/updateSeller/${sellerId}`, seller)
			.then((response) => {
				setResponse("Profile updated successfully!");
			})
			.catch((error) => {
				setResponse("Profile update failed!");
			});
	};

	return (
		<div>
			<h1>Seller Profile Page</h1>
			{seller && (
				<UserProfileOptionalEdit
					data={seller}
					setData={setSeller}
					nonmodifiable={nonnmodifiable}
				/>
			)}
			<button onClick={handleClick}>Update</button>
			{response && <p>{response}</p>}
		</div>
	);
}
