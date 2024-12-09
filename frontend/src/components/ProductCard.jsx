import React, { useState, useEffect, useRef } from "react";
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { BiSolidArchiveIn, BiSolidArchiveOut } from "react-icons/bi";
import { FaEye, FaEdit, FaTimes, FaCamera } from "react-icons/fa";
import { useProductStore } from "../store/product";
import AvatarEditor from "react-avatar-editor";
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import avatar from "/avatar.png";

function ProductCard({ product }) {
  const { archiveProduct, deleteProduct, updateProduct } = useProductStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewFile, setPreviewFile] = useState(
    product.profilePicture ? `http://localhost:3000${product.profilePicture}  `: avatar
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);

  // Editable product fields
  const [editableProduct, setEditableProduct] = useState({ ...product });

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("productImages")) || [];
    const productImage = savedImages.find((img) => img.id === product._id);
    if (productImage) {
      setPreviewFile(productImage.image);
    }
  }, [product]);

  // Toggle Edit Mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // Toggle Image Edit Mode
  const toggleImageEdit = () => {
    setIsEditingImage((prev) => !prev);
    setProfilePic(null);
  };

  // Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setProfilePic(file);
  };

  // Save Image
  const handleSaveImage = () => {
    if (editorRef.current && profilePic) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL();

      try {
        const savedImages = JSON.parse(localStorage.getItem("productImages")) || [];
        const updatedImages = savedImages.filter((img) => img.id !== product._id);
        updatedImages.push({ id: product._id, image: dataUrl });

        localStorage.setItem("productImages", JSON.stringify(updatedImages));
        setPreviewFile(dataUrl);
        setIsEditingImage(false);
        setProfilePic(null);
        toast.success("Profile picture saved locally");
      } catch (error) {
        toast.error("Error saving profile photo locally");
      }
    } else {
      toast.error("No file selected for upload");
    }
  };

  // Handle Archive Click
  const handleArchiveClick = async () => {
    const newArchiveStatus = !product.archive;
    const { success, message } = await archiveProduct(product._id, newArchiveStatus);
    if (success) {
      toast.success(newArchiveStatus ? "Product archived successfully" : "Product unarchived successfully");
    } else {
      toast.error(message);
    }
  };

  // Handle Delete Click
  const handleDeleteClick = async () => {
    const { success, message } = await deleteProduct(product._id);
    if (success) {
      toast.success("Product deleted successfully");
    } else {
      toast.error(message);
    }
  };

  // Handle Inline Update Click
  const handleUpdateClick = async () => {
    const { success, message } = await updateProduct(product._id, editableProduct);
    if (success) {
      toast.success("Product updated successfully");
      setIsEditing(false);
    } else {
      toast.error(message);
    }
  };

  // Handle Inline Field Change
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct((prev) => ({ ...prev, [name]: value }));
  };

  const fieldsToShow = [
    { label: "Name", key: "name" },
    { label: "Price", key: "price" },
    { label: "Description", key: "description" },
    { label: "Sales", key: "sales" },
    { label: "Creator", key: "creator" },
    { label: "Quantity", key: "Available_quantity" },
    { label: "Rate", key: "rate" },
    { label: "Review", key: "review" },
  ];

  return (
    <div className="relative justify-around items-center p-4 w-[95%] min-h-[450px] max-h-[450px] content-center flex backdrop-blur-lg bg-[#ECEBDE]/75 mx-auto h-fit m-4 rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        <img
          src={previewFile}
          alt="Product"
          className="w-40 h-40 rounded-full object-cover cursor-pointer mb-2"
          onClick={() => setShowPreview(true)}
        />
        <button onClick={toggleImageEdit} className="flex items-center text-blue-500">
          <FaCamera size="20" className="mr-1" /> Edit Photo
        </button>
      </div>

      <hr className="h-[200px] w-[1px] bg-black text-black" />

      <div className="grid p-2 w-[50%]">
        {fieldsToShow.map(({ label, key }, index) => (
          <div key={index} className="flex my-1 text-black p-2 rounded-sm">
            <p className="text-left font-bold w-[35%]">{label}:</p>
            {isEditing ? (
              <input
                type="text"
                name={key}
                value={editableProduct[key] || ""}
                onChange={handleFieldChange}
                className="border rounded w-full p-1"
              />
            ) : (
              <p className="text-left pl-4">{product[key]}</p>
            )}
          </div>
        ))}

        <div className="flex space-x-4 mt-4">
          <button onClick={handleArchiveClick} className="transform transition-transform duration-300 hover:scale-110">
            {product.archive ? <BiSolidArchiveOut size="24" className="text-pink-950" /> : <BiSolidArchiveIn size="24" className="text-pink-950" />}
          </button>
          <button onClick={toggleEdit} className="transform transition-transform duration-300 hover:scale-110">
            <MdOutlineDriveFileRenameOutline size="24" className="text-blue-500" />
          </button>
          <button onClick={handleDeleteClick} className="transform transition-transform duration-300 hover:scale-110">
            <MdDelete size="24" className="text-red-500" />
          </button>
        </div>

        {isEditing && (
          <button
            onClick={handleUpdateClick}
            className="mt-4 bg-green-500 text-white p-2 rounded transition-transform transform hover:scale-105"
          >
            Save Changes
          </button>
        )}
      </div>

      {isEditingImage && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 z-10 rounded-lg">
          <input type="file" onChange={handleFileChange} className="mb-4" />
          {profilePic && (
            <>
              <AvatarEditor
                ref={editorRef}
                image={profilePic}
                width={200}
                height={200}
                border={20}
                borderRadius={100}
                scale={scale}
                rotate={rotate}
              />
              <div className="mt-4">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <button onClick={handleSaveImage} className="bg-green-500 text-white p-2 rounded">
                  Save Image
                </button>
                <button onClick={toggleImageEdit} className="bg-gray-500 text-white p-2 rounded ml-2">
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {showPreview && (
        <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
          <Modal.Body className="text-center">
            <img src={previewFile} alt="Product Preview" className="img-fluid" />
            <button onClick={() => setShowPreview(false)} className="mt-4">
              <FaTimes size={30} className="text-red-500" />
            </button>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default ProductCard;