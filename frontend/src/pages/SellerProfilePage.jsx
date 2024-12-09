import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";
import { IoSaveOutline, IoClose } from "react-icons/io5";
import { toast, Toaster } from "react-hot-toast";
import { useUserStore } from "../store/user";
import { useSellerStore } from "../store/seller";
import { useProductStore } from "../store/product";
import ProductContainerForSeller from "../components/ProductContainerForSeller";
import UnVerified  from "../components/UnVerified";

import { Bar } from "react-chartjs-2";
import AvatarEditor from "react-avatar-editor";
import egypt from "../images/egypt.jpg";
import avatar from "/avatar.png";
import { useRequestStore } from '../store/requests';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SellerProfilePage = () => {
  const { user } = useUserStore();
  const { sell, getSeller, updateSeller, uploadProfilePicture } = useSellerStore();
  const { getProducts, products } = useProductStore();
  const { createRequest } = useRequestStore();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedSeller, setUpdatedSeller] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [previewFile, setPreviewFile] = useState(
    localStorage.getItem("profilePicture") || ""
  );
  const [showPreview, setShowPreview] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [archivedButton, setArchivedButton] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const isVerified = sell?.verified;

  useEffect(() => {
    getSeller({ userName: user.userName }, {});
    handlePress();
  }, [user.userName]);

  useEffect(() => {
    setPreviewFile(sell.profilePicture);
  }, [sell]);

  useEffect(() => {
    setPage(1);
    setMaxPages(Math.ceil(products.filter((p) => p.archive === archivedButton).length / 4));
  }, [products, archivedButton]);

  const handlePress = async () => {
    await getProducts({ creator: user.userName }, {});
    setShowChart(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    if (Object.keys(updatedSeller).length) {
      const { success, message } = await updateSeller(user.userName, updatedSeller);
      success
        ? toast.success(message, { className: "text-white bg-gray-800" })
        : toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
      localStorage.removeItem("profilePicture");
    }
  };

  const handleSaveProfilePicture = async () => {
    if (editorRef.current && profilePic) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL();
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append("profilePicture", blob, "profile-photo.png");
      formData.append("userName", user.userName);

      try {
        const response = await uploadProfilePicture(formData);
        if (response.success) {
          setPreviewFile(response.profilePicture);
          localStorage.setItem("profilePicture", response.profilePicture);
          setIsEditing(false);
          setProfilePic(null);
          toast.success("Profile picture updated successfully", {
            className: "text-white bg-gray-800",
          });
          await getSeller({ userName: user.userName }, {});
        } else {
          toast.error("Failed to update profile picture", {
            className: "text-white bg-gray-800",
          });
        }
      } catch (error) {
        console.error("Error uploading profile photo:", error);
        toast.error("Error uploading profile photo", {
          className: "text-white bg-gray-800",
        });
      }
    }
  };

  const getSalesData = () => {
    return {
      labels: products.map((product) => product.name),
      datasets: [
        {
          label: "Sales",
          data: products.map((product) => product.sales || 0),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

  if (!isVerified) {
    return <UnVerified />;
  }
  const handleDeleteAccountRequest = async () => {
    const deleteRequest = {
      userName: user.userName,
      userType: user.type,
      userID: user._id,
      type: 'delete',
    };
    const { success, message } = await createRequest(deleteRequest);
    if (success) {
      toast.success('Account deletion request submitted successfully.');
      setIsDeleteVisible(false);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
       />
      <img
        src={egypt}
        className="fixed top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none"
      />
      <div className="max-w-7xl mx-auto">
     
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Seller Profile</h1>
              <div className="relative">
                <img
                  src={previewFile ? `http://localhost:3000${previewFile}` : avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer"
                >
                  <FaEdit className="text-orange-500" />
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                {["userName", "email", "mobileNumber", "description"].map((field) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <input
                      type="text"
                      name={field}
                      defaultValue={sell[field] || ""}
                      className={`${
                        isEditing ? "bg-gray-100" : "bg-transparent"
                      } transition-colors focus:outline-none border-b border-gray-300 px-2 py-1 w-2/3 text-right`}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        setUpdatedSeller({ ...updatedSeller, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
                {!isEditing ? (
                  <button
                    className="text-orange-500 hover:text-orange-600 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit size={20} />
                  </button>
                ) : (
                  <button
                    className="text-green-500 hover:text-green-600 transition-colors"
                    onClick={handleSaveClick}
                  >
                    <IoSaveOutline size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sales Data</h2>
                  {showChart && products.length > 0 && (
                    <Bar data={getSalesData()} options={{ responsive: true }} />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products</h2>
              <div className="flex justify-center mb-4">
                <button
                  className={`px-4 py-2 rounded-l-lg ${
                    !archivedButton
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setArchivedButton(false)}
                >
                  Visible
                </button>
                <button
                  className={`px-4 py-2 rounded-r-lg ${
                    archivedButton
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setArchivedButton(true)}
                >
                  Archived
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products
                  .filter((p) => p.archive === archivedButton)
                  .slice((page - 1) * 4, page * 4)
                  .map((product, index) => (
                    <ProductContainerForSeller key={index} product={product} />
                  ))}
              </div>
              <div className="flex justify-center mt-4">
                {[...Array(maxPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      index + 1 === page
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {profilePic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setProfilePic(null)}
            >
              <IoClose size={24} />
            </button>
            <AvatarEditor
              ref={editorRef}
              image={profilePic}
              width={250}
              height={250}
              border={50}
              borderRadius={125}
              color={[255, 255, 255, 0.6]}
              scale={scale}
              rotate={rotate}
            />
            <div className="mt-4 flex items-center justify-between">
              <input
                type="range"
                min="1"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-1/2"
              />
              <button
                className="bg-gray-200 text-gray-700 p-2 rounded-full"
                onClick={() => setRotate((prev) => prev + 90)}
              >
                <FaArrowRotateRight />
              </button>
            </div>
            <button
              className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
              onClick={handleSaveProfilePicture}
            >
              Save Profile Picture
            </button>
          </div>
        </div>
      )}
      <div className="mt-10 border-t pt-6">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              onClick={handleDeleteAccountRequest}
            >
              Delete Account
            </button>
          </div>
    </div>
  );
};

export default SellerProfilePage;

