import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadPicture({ userType }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const placeholderUrl = "https://via.placeholder.com/100?text=Profile"; // Replace with your placeholder image URL

    // Load saved profile picture URL from local storage when the component mounts
    useEffect(() => {
        const savedProfilePic = localStorage.getItem("profilePicUrl");
        if (savedProfilePic) {
            setPreview(savedProfilePic);
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Preview the selected image before uploading
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userType", userType);
    
        try {
            const response = await axios.post("http://localhost:5000/api/tourGuide/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            // Log the filePath from the response to debug
            console.log("File path from server:", response.data.filePath);
    
            // Construct the full URL for the uploaded image
            const uploadedFileUrl = `http://localhost:5000${response.data.filePath}`;
            console.log("Full URL for image:", uploadedFileUrl);
    
            // Save the uploaded image URL to local storage
            localStorage.setItem("profilePicUrl", uploadedFileUrl);
    
            // Update the preview to the uploaded file URL
            setPreview(uploadedFileUrl);
            alert(response.data.message);
        } catch (error) {
            console.error("Error uploading the file:", error);
            alert("Failed to upload the file.");
        }
    };

    return (
        <div className="upload-picture">
            <h3>Upload {userType === "tourGuide" ? "Photo" : "Logo"}</h3>
            
            <div style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#d8d8d8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}>
                {preview ? (
                    <img
                        src={preview}
                        key={preview} // Force re-render if preview URL changes
                        alt="Profile Preview"
                        onError={() => setPreview(placeholderUrl)} // Reset to placeholder if image fails to load
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <span style={{ color: "#ffffff" }}>Profile</span>
                )}
            </div>

            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Picture</button>
        </div>
    );
}

export default UploadPicture;
