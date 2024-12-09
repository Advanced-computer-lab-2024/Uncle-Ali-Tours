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
          setUploadedDocuments(data.documents);
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
  }, [user, navigate]);

  // Handle Accept Button Click
  const handleAccept = async (userName) => {
    try {
      const response = await fetch(`/api/seller/acceptDocument`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Documents for ${userName} accepted successfully!`);
        setUploadedDocuments((prev) =>
          prev.map((doc) =>
            doc.userName === userName ? { ...doc, verified: true } : doc
          )
        );
      } else {
        toast.error(data.message || "Failed to accept documents.");
      }
    } catch (error) {
      console.error("Error accepting documents:", error);
      toast.error("An error occurred while accepting documents.");
    }
  };

  // Handle Reject Button Click
  const handleReject = async (userName) => {
    try {
      const response = await fetch(`/api/seller/rejectDocument`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Documents for ${userName} rejected successfully!`);
        setUploadedDocuments((prev) =>
          prev.map((doc) =>
            doc.userName === userName ? { ...doc, verified: false } : doc
          )
        );
      } else {
        toast.error(data.message || "Failed to reject documents.");
      }
    } catch (error) {
      console.error("Error rejecting documents:", error);
      toast.error("An error occurred while rejecting documents.");
    }
  };

  return (
    <div className="col-span-1 lg:col-span-3 p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
      <h3 className="text-xl text-center mb-4">Uploaded Documents</h3>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-3">
        {uploadedDocuments ? (
          uploadedDocuments.length > 0 ? (
            uploadedDocuments.map((doc, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-700 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Seller: {doc.userName}</h4>

                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  {doc.verified ? (
                    <span className="text-green-400">Verified</span>
                  ) : (
                    <span className="text-red-400">Unverified</span>
                  )}
                </p>

                <div className="mb-2">
                  <h5 className="text-md font-semibold">Seller ID:</h5>
                  {doc.sellerID ? (
                    <a
                      href={`http://localhost:5000${doc.sellerID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      View Seller ID
                    </a>
                  ) : (
                    <p className="text-gray-400">No Seller ID uploaded</p>
                  )}
                </div>

                <div className="mb-4">
                  <h5 className="text-md font-semibold">Taxation Registry Card:</h5>
                  {doc.taxationRegistryCard ? (
                    <a
                      href={`http://localhost:5000${doc.taxationRegistryCard}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      View Taxation Registry Card
                    </a>
                  ) : (
                    <p className="text-gray-400">No Taxation Registry Card uploaded</p>
                  )}
                </div>

                {/* Accept and Reject Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAccept(doc.userName)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(doc.userName)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No documents found.</p>
          )
        ) : (
          <p className="text-gray-400 text-center">Loading documents...</p>
        )}
      </div>
    </div>
  );
};

export default UserDocuments;
