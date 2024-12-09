import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import { useProductStore } from '../store/product.js'
import { FiLoader } from 'react-icons/fi'
import { BiSolidArchiveOut, BiSolidArchiveIn } from "react-icons/bi";
import { IoSaveOutline } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import avatar from "/avatar.png";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import AvatarEditor from "react-avatar-editor";
import { FaArrowRotateRight } from "react-icons/fa6";




function EditProduct() {
    const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);
    const [showPreview, setShowPreview] = useState(false);
    const { id } = useParams();
    const [updatedProduct, setUpdatedProduct] = useState({})
    const { products, updateProduct, getProducts, archiveProduct } = useProductStore();
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();
    let product = products[0]
    const keys = [
        "name",
        "price",
        "description",
        "Available_quantity",
      ];

    useEffect(() => {
        const fetchProduct = async () => {
            await getProducts({_id : id})
        }
        fetchProduct()
    }
    , [id])

    const handleArchiveClick = (e) => {
        e.preventDefault();
        archiveProduct(product._id, !product.archive);
      };

    useEffect(() => {
        product = products[0]
        setUpdatedProduct(product)
    }
    , [products])

    const handleUpdate = async () => {

        const {success, message} = await updateProduct(product._id, updatedProduct)
        if (success) {
            const t = toast.success(message)
            await new Promise(r => setTimeout(r, 1000));
            toast.remove(t)
            navigate('/')
        } else {
            toast.error(message)
        }
    }

    const handleSave = async () => {
        if (editorRef.current && profilePic) {
          const canvas = editorRef.current.getImageScaledToCanvas();
          const dataUrl = canvas.toDataURL();
          const blob = await fetch(dataUrl).then((res) => res.blob());
          console.log(blob);
    
          try {
            setProfilePic(null);
            product.profilePicture = dataUrl;
            toast.success("Profile picture saved locally", { className: "text-white bg-gray-800" });
          } catch (error) {
            toast.error(error.message, { className: "text-white bg-gray-800" });
          }
        } else {
          toast.error("No file selected for upload", { className: "text-white bg-gray-800" });
        }
      };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setProfilePic(file);
          localStorage.removeItem("profilePicture"); // Clear previous photo before uploading a new one
        } else {
          console.error("No file selected");
        }
      };


    if (!updatedProduct || !product) return <FiLoader size={30} className=' mx-auto mt-[40vh] animate-spin'/>


    return (
        <div>
        <div className="p-1 w-[20vw] backdrop-blur-lg bg-[#0e0e2281] mx-auto h-fit m-4 rounded-lg shadow-lg text-white">
            
            
                  <label for="pic-upload">
                  <img
                    src={
                      product?.profilePicture
                        ? `http://localhost:3000${product?.profilePicture}`
                        : avatar
                    }
                    alt="Profile Preview"
                    className="w-[6.5vh] rounded-full mx-auto hover:cursor-pointer"
                  />
                </label>
                <input
                id="pic-upload"
                type="file"
                name="profilePicture"
                className="hidden bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
                onChange={handleFileChange}
              />
          <div className="grid p-2">
            {keys.map((key, index) => (
                <div key={index} className="flex my-1 bg-[#00000012]  p-2 rounded-sm justify-between">
                <p>{key === "Available_quantity" ? "quantity" : key}: </p>
              <input value={updatedProduct[key]} onChange={(e) => (setUpdatedProduct({...updatedProduct, [key]: e.target.value}))} className="text-left h-[2.3ch] bg-gray-800 px-2 rounded-sm min-w-[10ch]"/>
                </div>
            ))}
            <div className="w-fit">
            <button onClick={handleArchiveClick} className="mr-2 transform w-fit transition-transform duration-300 hover:scale-125">
              { !product.archive ?
                <BiSolidArchiveIn size="18" color="white" />
                :
                <BiSolidArchiveOut size="18" color="white" />
                }
            </button>
            <button onClick={handleUpdate} className="mr-2 transform w-fit transition-transform duration-300 hover:scale-125">
              <IoSaveOutline size="18" color="white" />
            </button>
            </div>
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
                      product?.profilePicture
                        ? `http://localhost:3000${product?.profilePicture}`
                        : avatar
                    }
                    alt="Profile Preview"
                    className="img-fluid m-auto h-[60vh]"
                  />
                }
              </Modal.Body>
            </Modal>
            </div>
            <div>
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
              </div>
              </div>
      );
}

export default EditProduct