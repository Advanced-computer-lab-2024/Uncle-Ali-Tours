import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/user";
import { useSellerStore } from "../store/seller";
import { useProductStore } from "../store/product";
import { Link, useNavigate } from "react-router-dom";
import ProductContainerForSeller from "../components/ProductContainerForSeller";
import toast, { Toaster } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { IoSaveOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaArrowRotateRight } from "react-icons/fa6";
import egypt from '../images/egypt.jpg';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { FiLoader } from "react-icons/fi";
import avatar from "/avatar.png";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);
import { useRequestStore } from "../store/requests.js";

import axios from "axios";
import { Modal } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import AvatarEditor from "react-avatar-editor";
import { set } from "mongoose";
import UnVerified from "../components/UnVerified.jsx";

const SellerProfile = () => {
	const [page, setPage] = useState(1);
	const [maxPages, setMaxPages] = useState(1);
	const [archivedButton, setArchivedButton] = useState(false);
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { sell, getSeller, updateSeller, uploadProfilePicture } =
		useSellerStore();
	const { getProducts, products } = useProductStore();
	const [filter, setFilter] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const [showChart, setShowChart] = useState(true); // Toggle for chart visibility

	useEffect(() => {
		handlePress();
		setPreviewFile(sell.profilePicture);
	}, [sell, user]);

	useEffect(() => {
		setPage(1);
		setMaxPages(Math.ceil(products.filter((p) => p.archive === archivedButton).length / 4));
	}, [products, archivedButton]);

	const [updatedSeller, setUpdatedSeller] = useState({});
	const [profilePic, setProfilePic] = useState(null);
	const [previewFile, setPreviewFile] = useState(
		localStorage.getItem("profilePicture") || "",
	);
	const [showPreview, setShowPreview] = useState(false);
	const [scale, setScale] = useState(1.2);
	const [rotate, setRotate] = useState(0);
	const editorRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewImage, setPreviewImage] = useState(null); // To preview the image

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setProfilePic(file);
			localStorage.removeItem("profilePicture"); // Clear previous photo before uploading a new one
		} else {
			console.error("No file selected");
		}
	};

	// Save the new profile picture
	const handleSave = async () => {
		if (editorRef.current && profilePic) {
			const canvas = editorRef.current.getImageScaledToCanvas();
			const dataUrl = canvas.toDataURL();
			const blob = await fetch(dataUrl).then((res) => res.blob());
			const formData = new FormData();
			formData.append("profilePicture", blob, "profile-photo.png");
			formData.append("userName", user.userName);

			try {
				const response = await axios.put(
					`http://localhost:3000/api/seller/uploadPicture`,
					formData,
				);
				console.log(response);

				if (response.data.success) {
					const profileImagePath = response.data.profilePicture;

					// Update preview immediately with new image
					setPreviewFile(profileImagePath);
					localStorage.setItem("profilePicture", profileImagePath);
					setIsEditing(false);
					setProfilePic(null);
					toast.success(response.data.message, {
						className: "text-white bg-gray-800",
					});

					// Directly update the `sell` state in useSellerStore
					getSeller((prev) => ({
						...prev,
						profilePicture: profileImagePath,
					}));
				} else {
					toast.error(response.data.message || "Upload failed", {
						className: "text-white bg-gray-800",
					});
				}
			} catch (error) {
				console.error("Error uploading profile photo:", error);
				toast.error("Error uploading profile photo", {
					className: "text-white bg-gray-800",
				});
			}
		} else {
			console.error("No file selected for upload");
			toast.error("No file selected for upload", {
				className: "text-white bg-gray-800",
			});
		}
	};

	const handleSaveClick = async () => {
		setIsEditing(false);
		if (!Object.keys(updatedSeller).length) return;
		console.log(updatedSeller);
		const { success, message } = await updateSeller(
			user.userName,
			updatedSeller,
		);
		success
			? toast.success(message, { className: "text-white bg-gray-800" })
			: toast.error(message, { className: "text-white bg-gray-800" });
	};

	const handlePress = async () => {
		// Fetch products filtered by the seller's userName
		await getProducts({ ...filter, creator: user.userName }, {});
		setShowChart(true); // Show chart after fetching products
	};

	useEffect(() => {
		getSeller({ userName: user.userName }, {});
	}, []);

	const [isDeleteVisible, setIsDeleteVisible] = useState(false);
	const { createRequest } = useRequestStore();
	const handleDeleteClick = () => {
		setIsDeleteVisible(!isDeleteVisible);
	};
	console.log(products);
	const handleDeleteAccountRequest = async () => {
		const deleteRequest = {
			userName: user.userName,
			userType: user.type,
			userID: user._id,
			type: "delete",
		};
		const { success, message } = await createRequest(deleteRequest);
		console.log(deleteRequest);
		if (success) {
			toast.success("Account deletion request submitted successfully.");
			setIsDeleteVisible(false); // Close the delete dialog
		} else {
			toast.error(message);
		}
	};

	const getSalesData = () => {
		return {
			labels: products.map((product) => product.name),
			datasets: [
				{
					label: "Sales",
					data: products.map((product) => product.sales || 0),
					backgroundColor: "rgba(255, 255, 255, 1)",
				},
			],
		};
	};

	if (!sell?.userName)
		return (
			<FiLoader
				size={50}
				className="animate-spin mx-auto text-black mt-[49vh]"
			/>
		);

	if (!sell.verified) return <UnVerified />;

	return (
		<div className="w-full mt-24 flex">
			<img src={egypt} className="fixed top-0 left-0 opacity-[0.3] w-[200vw] h-[100vh] bg-black opacity-600 pointer-events-none" />
				{/* <div className="bg-gradient-to-b shadow-2xl relative fro-100% from-[white] h-[60vh] w-[24vw] mx-auto rounded-lg"> */}
				<div className="bg-gradient-to-b from-white via-white/90 to-white/70 shadow-2xl relative h-[60vh] w-[24vw] mx-auto rounded-lg">
				<div className="absolute top-0 left-1/2 translate-x-[-50%] translate-y-[-35%]">
					<label
						for="pic-upload"
						onMouseEnter={() => setIsEditing(true)}
						onMouseLeave={() => setIsEditing(false)}
					>
						<img
							onClick={() => setShowPreview(true)}
							className="w-[16.5vh] rounded-full mx-auto hover:cursor-pointer"
							src={previewFile ? `http://localhost:3000${previewFile}` : avatar}
							alt="Profile Picture"
						/>

						<IoIosAddCircle
							className={`pointer-events-none absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 text-[20.2vh]  hover:cursor-pointer rounded-full mx-auto ${isEditing ? "opacity-1" : "opacity-0"} transition-all duration-300`}
						/>
					</label>
					<input
						id="pic-upload"
						type="file"
						name="profilePicture"
						className="hidden bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
						onChange={handleFileChange}
					/>
				</div>
				<p className="lg:text-3xl md:text-2xl  absolute top-32 left-1/2 translate-x-[-50%]">
					{sell.userName || ""}
				</p>
				<p className="lg:text-xl md:text-lg font-thin  absolute top-[220px] left-1/2 translate-x-[-50%]">
					{sell.email || "email el seller@gamil.com"}
				</p>
				<p className="lg:text-xl md:text-lg font-thin  absolute top-[180px] left-1/2 translate-x-[-50%]">
					{sell.mobileNumber || "+201823793346"}
				</p>
				<Link to="/editProfile" className="absolute top-5 left-8">
					Edit
				</Link>

				<div className="absolute flex justify-center align-center  top-1/2 right-1/2 translate-y-[6vh] translate-x-1/2 relative">
					<p className="absolute top-1/2 right-1/2 translate-x-1/2 translate-y-[-60px]">
						Products
					</p>
					<div>
						<p className="text-5xl mx-12">
							{products.filter((p) => !p.archive).length}
						</p>
						<p> visible</p>
					</div>
					<hr className="w-1 h-[7vh] bg-[#1F4529]" />
					<div>
						<p className="text-5xl mx-12">
							{products.filter((p) => p.archive).length}
						</p>
						<p> archived</p>
					</div>
				</div>
			</div>

			{/* <div className="bg-gradient-to-b shadow-xl relative mb-6 fro-100% from-[white] min-h-[60vh] w-[70vw] mx-auto rounded-lg"> */}
			<div className="bg-gradient-to-b from-white via-white/90 to-white/70 shadow-xl relative mb-6 min-h-[60vh] w-[70vw] mx-auto rounded-lg">
				<div className="absolute top-8 shadow-md bg-[#D7D3BF]/90 rounded-full left-1/2 translate-x-[-50%]">
					<button
						className={`${archivedButton ? "hover:scale-[0.985] " : "shadow-md scale-[0.9]"} focus:outline-none text-2xl m-2 shadow-lg hover:shadow-md transition-all bg-[#FEFDED] py-2 px-4 rounded-full`} 
						onClick={() => setArchivedButton(false)}
					>
						Visible
					</button>
					<button
						className={`${!archivedButton ? "hover:scale-[0.985] " : "shadow-md scale-[0.9]"} focus:outline-none text-2xl m-2 shadow-lg hover:shadow-md transition-all bg-[#FEFDED] py-2 px-4 rounded-full`}
						onClick={() => setArchivedButton(true)}
					>
						Archived
					</button>
				</div>
				<div className="absolute top-10 shadow-md bg-[#D7D3BF]/90 rounded-full right-[20%] translate-x-1/2">
					
					{
						[...Array(maxPages)].map((_, index) => (<button onClick={() => setPage(index+1)} className={`${index !== page-1 ? " hover:scale-[0.95] shadow-lg  bg-[#FEFDED]" : "scale-[0.85]  bg-[#FAF0E0] shadow-md"} focus:outline-none text-1xl m-1 transition-all py-2 px-4 rounded-full`}
>
							{index + 1}
						</button  >))
					}
				</div>
				<div className="grid w-full grid-cols-2 mt-28">
					{products.filter((p)=> p.archive === archivedButton).map(
						(product, index) =>
							index >= 4 * (page-1) && index < 4 * page && (
								<ProductContainerForSeller key={index} product={product} />
							),
					)}
				</div>
			</div>
			{profilePic && (
				<div className="avatar-editor absolute focus:outline-none rounded-xl top-1/2 left-1/2 h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 backdrop-blur-lg">
					<div className="w-full grid">
						<button className="mt-4 ml-4" onClick={() => setProfilePic(null)}>
							<IoClose size={40} className="text-red-500" />
						</button>
					</div>
					<AvatarEditor
						ref={editorRef}
						image={profilePic}
						border={30}
						height={350}
						width={350}
						borderRadius={75}
						color={[50, 50, 50, 0.8]}
						scale={scale}
						rotate={rotate}
						style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
						className="mx-auto rounded-lg"
					/>
					<div className="controls  mt-3 grid">
						<div className="flex content-center mx-auto">
							<p className="text-center h-fit my-auto mr-2 ">- </p>
							<input
								type="range"
								min="1"
								max="3"
								step="0.1"
								value={scale}
								onChange={(e) => setScale(parseFloat(e.target.value))}
								className="slider bg-gray-700 w-[10vw] accent-black focus:outline-none border-none"
							/>
							<p className="text-center h-fit my-auto ml-2 ">+ </p>

							<button
								className="bg-white text-black ml-6 focus:outline-none p-2 rounded-full"
								onClick={() => setRotate((prev) => prev + 90)}
							>
								<FaArrowRotateRight size={25} />
							</button>
						</div>
						<div>
							<button
								className="bg-black text-white p-2 rounded mt-4"
								onClick={handleSave}
							>
								Save Profile Picture
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SellerProfile;

