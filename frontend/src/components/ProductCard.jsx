import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { dialog } from '../components/Dialog.jsx';
import { formdialog } from './FormDialog.jsx';  
import { BiSolidArchiveIn, BiSolidArchiveOut } from "react-icons/bi";
import { useProductStore } from '../store/product.js';
import React, { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AvatarEditor from 'react-avatar-editor';
import { Modal } from 'react-bootstrap';
import { FaEye, FaEdit ,FaTimes  } from 'react-icons/fa';

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

  // useEffect(() => {
  //   if (product && product.profilePicture) {
  //     setPreviewFile(product.profilePicture);
  //     localStorage.setItem("profilePicture", product.profilePicture);
  //   }
  // }, [product]);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("productImages")) || [];
    const productImage = savedImages.find(img => img.id === product._id);
    if (productImage) {
      setPreviewFile(productImage.image);
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
      //localStorage.removeItem("profilePicture");
    }
  };

  const handleSave = () => {
    if (editorRef.current && profilePic) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL();

      try {
        const savedImages = JSON.parse(localStorage.getItem("productImages")) || [];
        const updatedImages = savedImages.filter(img => img.id !== product._id);
        updatedImages.push({ id: product._id, image: dataUrl });

        localStorage.setItem("productImages", JSON.stringify(updatedImages));
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
    <div className="mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rounded h-fit p-4">
      <div className="flex items-center justify-center mb-6">
        {previewFile ? (
          <img
            className="w-40 h-40 rounded-full object-cover"
            src={previewFile}
            alt="Product Image"
          />
        ) : (
          <div className="text-gray-500">Add image</div>
        )}
        <div className="icon-buttons ml-4">
          <button className="p-2" onClick={() => setShowPreview(true)}>
            <FaEye className="h-4 w-4" />
          </button>
          <button className="p-2" onClick={toggleEdit}>
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isEditing && (
        <>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 p-2 border rounded"
          />
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
                className="mx-auto mb-4"
              />
              <div className="controls mt-3 space-y-4">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
               
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-white p-2 rounded w-full"
                >
                  Save Image
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Image Preview</h2>
              <button onClick={() => setShowPreview(false)}>
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <img
              src={previewFile}
              alt="Product Preview"
              className="max-w-full h-auto mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
 


      {/* <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
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
      </Modal> */}

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
