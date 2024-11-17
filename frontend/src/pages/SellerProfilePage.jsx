import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/user";
import { useSellerStore } from "../store/seller";
import { useProductStore } from "../store/product";
import { useNavigate } from "react-router-dom";
import ProductContainerForSeller from "../components/ProductContainerForSeller";
import toast, { Toaster } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { IoSaveOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaArrowRotateRight } from "react-icons/fa6";


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
  Legend
);
import { useRequestStore } from "../store/requests.js";

import axios from "axios";
import { Modal } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import AvatarEditor from "react-avatar-editor";
import { set } from "mongoose";
import UnVerified from "../components/UnVerified.jsx";

const SellerProfile = () => {
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
  }, [sell, user]);

  
  const [updatedSeller, setUpdatedSeller] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [previewFile, setPreviewFile] = useState(
    localStorage.getItem("profilePicture") || ""
  );
  const [showPreview, setShowPreview] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // To preview the image

  // useEffect(() => {
  //         setPreviewFile(sell.profilePicture);
  //         localStorage.setItem("profilePicture", sell.profilePicture);
  // }, [user.userName, sell.profilePicture]);

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
          formData
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

  const handleUploadClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);
      formData.append("userName", user.userName);

      try {
        const response = await axios.put(
          "/api/seller/uploadPicture",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success(response.data.message, {
          className: "text-white bg-gray-800",
        });

        // Refresh seller data after upload
        if (user.userName) {
          await getSeller({ userName: user.userName }, {});
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Upload failed", {
          className: "text-white bg-gray-800",
        });
      }
    } else {
      toast.error("Please select a file first", {
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
      updatedSeller
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
    return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;

  if (!sell.verified)
    return <UnVerified/>;

  return (
    <div className="flex w-full mt-12 justify-around">
      <div className="flex flex-col gap-[6vh] justify-start">
        <div className="flex gap-[6vw] justify-around">
          <div className="relative p-6 w-[30vh] backdrop-blur-lg bg-[#161821f0] h-[37vh] max-w-3xl rounded-lg shadow-lg text-white">
            <Toaster />

            <div
              className="flex mb-6 relative w-fit mx-auto hover:cursor-pointer"
              >
              { isEditing ?
              <>
              <label for="pic-upload">
                <IoIosAddCircle className=" text-[calc(6.5vh-15px)] text-[#00000088] hover:cursor-pointer rounded-full mx-auto"/>
                <p className="text-[10px]">Add Logo</p>
                </label>
                <input
                id="pic-upload"
                type="file"
                name="profilePicture"
                className="hidden bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
                onChange={handleFileChange}
              />
              </>
              :
              <>
              <img
              onClick={() => setShowPreview(true)}
                className="w-[6.5vh] rounded-full mx-auto"
                src={
                  previewFile ? `http://localhost:3000${previewFile}` : avatar
                }
                alt="Profile Picture"
              />
              {sell?.verified ? (
                <FaCheckCircle
                title="Verified"
                  size={16}
                  className="absolute bg-white rounded-full right-0 bottom-0 text-green-500"
                />
              ) : (
                <MdCancel
                title="Not Verified"
                size={16}
                className="absolute bg-white rounded-full right-0 bottom-0 text-red-500"
                />
              )}
              </>
            }
            </div>
            <Modal
              show={showPreview}
              className="absolute focus:outline-none rounded-xl top-1/2 left-1/2 h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 backdrop-blur-lg"
              onHide={() => setShowPreview(false)}
              centered
            >
              <button
                className="mt-4 ml-4"
                onClick={() => setShowPreview(false)}
              >
                <IoClose size={40} className="text-red-500" />
              </button>
              <Modal.Body className="text-center">
                {
                  <img
                    src={
                      previewFile
                        ? `http://localhost:3000${previewFile}`
                        : avatar
                    }
                    alt="Profile Preview"
                    className="img-fluid m-auto h-[60vh]"
                  />
                }
              </Modal.Body>
            </Modal>

            <div className="space-y-4 flex flex-col justify-around h-[22vh] justify-items-start ">
              <div className="flex justify-between">
                <p className="text-center my-auto">NAME: </p>
                <input
                  type="text"
                  name="name"
                  defaultValue={sell.userName || ""}
                  className={`bg-transparent h-[2.3ch] w-[17ch] border-none text-white border border-gray-600 my-4 focus:outline-none rounded-md px-2 py-2`}
                  readOnly={true}
                  onChange={(e) =>
                    updateSeller(sell.userName, { userName: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center my-auto">Email:</p>
                <input
                  type="text"
                  name="email"
                  defaultValue={sell.email || ""}
                  className={`${
                    isEditing ? "bg-gray-800" : "bg-transparent"
                  } transition-colors focus:outline-none h-[2.3ch] w-[17ch] border-none text-white border border-gray-600 my-4 rounded-md px-2 py-2`}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateSeller(sell.userName, { email: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-between">
                <p className="text-center my-auto">Mobile:</p>
                <input
                  type="number"
                  name="mobileNumber"
                  defaultValue={sell.mobileNumber || ""}
                  className={`${
                    isEditing ? "bg-gray-800" : "bg-transparent"
                  } transition-colors focus:outline-none h-[2.3ch] w-[17ch] border-none text-white border border-gray-600 my-4 rounded-md px-2 py-2`}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUpdatedSeller({
                      ...updatedSeller,
                      mobileNumber: e.target.value,
                    })
                  }
                />
              </div>
              {!isEditing ? (
                <button
                  className="mb-4 w-fit focus:outline-none"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                </button>
              ) : (
                <button
                  className="mb-4 w-fit focus:outline-none"
                  onClick={handleSaveClick}
                >
                  <IoSaveOutline />
                </button>
              )}
            </div>
          </div>

          <div className="relative p-6 w-[33vw] backdrop-blur-lg bg-[#161821f0] h-[37vh] max-w-3xl rounded-lg shadow-lg text-white">
            <h3 className="text-xl text-center">Sales Data</h3>
            {showChart && products.length > 0 && (
              <Bar data={getSalesData()} options={{ responsive: true }} />
            )}
          </div>
        </div>

        <div className="relative py-6 px-10 w-full backdrop-blur-lg bg-[#161821f0] mb-12 h-fit rounded-lg shadow-lg text-white">
          <h2 className="text-xl mb-4">Visabale Products</h2>
          <div className=" grid grid-cols-3 gap-3">
            {products.map(
              (product, index) =>
                !product.archive && (
                  <ProductContainerForSeller key={index} product={product} />
                )
            )}
          </div>
        </div>
      </div>

      <div className="relative py-6 px-10 w-[33vw] backdrop-blur-lg bg-[#161821f0] h-full rounded-lg shadow-lg text-white">
        <h2 className="text-xl mb-4">Archived Products</h2>
        <div className=" grid grid-cols-2 gap-3">
          {products.map(
            (product, index) =>
              product.archive && (
                <ProductContainerForSeller key={index} product={product} />
              )
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
         

          {isEditing && (
            
<>
            {profilePic && (
                <div className="avatar-editor absolute focus:outline-none rounded-xl top-1/2 left-1/2 h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 backdrop-blur-lg">
                <div className="w-full grid">
                  <button
                className="mt-4 ml-4"
                onClick={() => setProfilePic(null)}
                >
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

                    <button className="bg-white text-black ml-6 focus:outline-none p-2 rounded-full" onClick={() => setRotate((prev) => prev + 90)}>
                      <FaArrowRotateRight size={25}/>
                    </button>
                    </div>
                    <div>
                    <button className="bg-black text-white p-2 rounded mt-4" onClick={handleSave}>
                      Save Profile Picture
                    </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <br />
          {/* <button className='bg-black text-white m-6 p-2 rounded' onClick={handleDeleteClick}>Delete Account</button> 
           {isDeleteVisible && (
            <div className='bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
            <p>Are you sure you want to request to delete your account?</p>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={handleDeleteAccountRequest}>Request</button>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={() => setIsDeleteVisible(false)}>Cancel</button>
            </div>
           )} */}
        </div>

    </div>
  );
};

export default SellerProfile;
