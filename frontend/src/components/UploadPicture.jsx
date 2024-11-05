import React, { useState } from 'react';
import axios from 'axios';

function UploadPicture({ userType }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Preview the image
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
        formData.append("userType", userType); // Send user type as metadata

        try {
            const response = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Error uploading the file:", error);
            alert("Failed to upload the file.");
        }
    };

    return (
        <div className="upload-picture">
            <h3>Upload {userType === "tourGuide" ? "Photo" : "Logo"}</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" style={{ width: "100px", height: "100px" }} />}
            <button onClick={handleUpload}>Upload Picture</button>
        </div>
    );
}

export default UploadPicture;
