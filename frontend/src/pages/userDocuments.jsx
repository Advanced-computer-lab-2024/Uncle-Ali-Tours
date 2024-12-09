import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import toast from "react-hot-toast";

const UserDocuments = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [uploadedDocuments, setUploadedDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user.type !== "admin") navigate("/");

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/seller/getAllUploadedDocuments`);
        const data = await response.json();

        if (data.success) {
          setUploadedDocuments(data.documents); // Set the documents state with all seller documents
        } else {
          setError(data.message || "Failed to fetch documents.");
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to load documents.", { className: "text-white bg-red-600" });
        setError("An error occurred while fetching documents.");
      }
    };

    fetchDocuments();
  }, [user]);

  return (
    <div className="col-span-1 lg:col-span-3 p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
      <h3 className="text-xl text-center mb-4">Uploaded Documents</h3>

      {error && <p className="text-red-500">{error}</p>} {/* Show error if any */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-3">
        {uploadedDocuments ? (
          uploadedDocuments.length > 0 ? (
            uploadedDocuments.map((doc, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg mt-4">Seller: {doc.userName}</h4>
                <h5 className="text-md mt-2">Seller ID:</h5>
                {doc.sellerID ? (
                  <a
                    href={`http://localhost:5000${doc.sellerID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Seller ID
                  </a>
                ) : (
                  <p>No Seller ID uploaded</p>
                )}
                <h5 className="text-md mt-2">Taxation Registry Card:</h5>
                {doc.taxationRegistryCard ? (
                  <a
                    href={`http://localhost:5000${doc.taxationRegistryCard}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Taxation Registry Card
                  </a>
                ) : (
                  <p>No Taxation Registry Card uploaded</p>
                )}
              </div>
            ))
          ) : (
            <p>No documents found.</p>
          )
        ) : (
          <p>Loading documents...</p>
        )}
      </div>
    </div>
  );
};

export default UserDocuments;
