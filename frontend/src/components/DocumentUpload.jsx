// components/DocumentUpload.jsx
import React, { useState } from "react";
import axios from "axios";

const DocumentUpload = ({ userType, userName }) => {
    const [ID, setID] = useState(null);
    const [additionalDoc, setAdditionalDoc] = useState(null);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "ID") setID(files[0]);
        else setAdditionalDoc(files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("userType", userType);
        formData.append("userName", userName);
        formData.append("ID", ID);

        // Set the appropriate field name for the additional document based on the user type
        const additionalDocField = userType === "tourGuide" ? "certificate" : "taxationRegistryCard";
        formData.append(additionalDocField, additionalDoc);

        try {
            const response = await axios.post("/api/uploadDocuments", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Error uploading documents.");
        }
    };

    return (
        <div className="upload-section">
            <h3>Upload Documents</h3>
            <input type="file" name="ID" onChange={handleFileChange} required />
            <input
                type="file"
                name={userType === "tourGuide" ? "certificate" : "taxationRegistryCard"}
                onChange={handleFileChange}
                required
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default DocumentUpload;
