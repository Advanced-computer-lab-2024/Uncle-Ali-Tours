import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { dialog } from '../components/Dialog.jsx';
import { formdialog } from './FormDialog.jsx';  
import { BiSolidArchiveIn, BiSolidArchiveOut } from "react-icons/bi";
import { useProductStore } from '../store/product.js';
import React, { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AvatarEditor from 'react-avatar-editor';
import { Modal } from 'react-bootstrap';
import { FaEye, FaEdit } from 'react-icons/fa';

function ProductCard({ product, productChanger }) {
  const { archiveProduct } = useProductStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewFile, setPreviewFile] = useState(localStorage.getItem("profilePicture") || "");
  const [showPreview, setShowPreview] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);

  const handleClick = () => {
    dialog().showDialog();
    productChanger(product);
  };

  const handleUpdateClick = () => {
    formdialog().showFormDialog();
    productChanger(product);
  };

  useEffect(() => {
    if (product && product.profilePicture) {
      setPreviewFile(product.profilePicture);
      localStorage.setItem("profilePicture", product.profilePicture);
    }
  }, [product]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setProfilePic(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
      localStorage.removeItem("profilePicture");
    }
  };

  const handleSave = async () => {
    if (editorRef.current && profilePic) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL();

      try {
        localStorage.setItem("profilePicture", dataUrl);
        setPreviewFile(dataUrl);
        setIsEditing(false);
        setProfilePic(null);
        toast.success("Profile picture saved locally", { className: "text-white bg-gray-800" });
      } catch (error) {
        toast.error("Error saving profile photo locally", { className: "text-white bg-gray-800" });
      }
    } else {
      toast.error("No file selected for upload", { className: "text-white bg-gray-800" });
    }
  };

  const handleArchiveClick = () => {
    archiveProduct(product._id, !product.archive);
  };

  return (
    <div className="mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded">
      
      <div className="flex items-center justify-center mb-6">
        {previewFile ? (
          <img
            style={{ width: "160px", height: "160px", borderRadius: "50%", objectFit: "cover" }}
            src={previewFile}
            alt="Profile Picture"
          />
        ) : (
          <div className="text-gray-500">add img</div>
        )}
        <div className="icon-buttons ml-4">
          <button onClick={() => setShowPreview(true)}>
            <FaEye />
          </button>
          <button onClick={toggleEdit}>
            <FaEdit />
          </button>
        </div>
      </div>

      {isEditing && (
        <>
          <label>
            Upload img:
            <input
              type="file"
              name="profilePicture"
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              onChange={handleFileChange}
            />
          </label>
          {profilePic && (
            <div className="avatar-editor">
              <AvatarEditor
                ref={editorRef}
                image={profilePic}
                width={150}
                height={150}
                border={30}
                borderRadius={75}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={rotate}
                style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
              />
              <div className="controls mt-3">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="slider bg-gray-700"
                />
                <button className="bg-gray-600 text-white p-2 rounded" onClick={() => setRotate((prev) => prev + 90)}>
                  Rotate
                </button>
                <button className="bg-black text-white p-2 rounded mt-4" onClick={handleSave}>
                  Save img
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile Picture Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={previewFile}
            alt="Profile Preview"
            className="img-fluid"
            style={{ maxWidth: "100%", borderRadius: "50%" }}
          />
        </Modal.Body>
      </Modal>

      <div className="grid p-2">
        {Object.keys(product).map((key, index) => (
          <p key={index}>{`${key}: ${product[key]}`}</p>
        ))}
      </div>
      <button onClick={handleUpdateClick} className="mr-4 transform transition-transform duration-300 hover:scale-125">
        <MdOutlineDriveFileRenameOutline size="18" color="black" />
      </button>
      <button onClick={handleClick} className="mr-2 transform transition-transform duration-300 hover:scale-125">
        <MdDelete size="18" color="black" />
      </button>
      {product.archive ? (
        <button onClick={handleArchiveClick} className="mr-2 transform transition-transform duration-300 hover:scale-125">
          <BiSolidArchiveIn size="18" color="black" />
        </button>
      ) : (
        <button onClick={handleArchiveClick} className="mr-2 transform transition-transform duration-300 hover:scale-125">
          <BiSolidArchiveOut size="18" color="black" />
        </button>
      )}
    </div>
  );
}

export default ProductCard;
