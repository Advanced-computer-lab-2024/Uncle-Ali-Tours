import React from "react";

function ComplaintContainer({complaint}) {
    const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="relative py-4 px-12 w-[50vw] backdrop-blur-lg bg-[#161821f0] mb-12 h-fit rounded-lg shadow-lg text-white">
      <h2 className="text-2xl mb-3">{complaint.title}</h2>
      <p className="mb-3">Body: {complaint.body}</p>
      <p className="mb-3">Status: {complaint.status}</p>
      {user.type === "tourist" && (
        <p className="mb-3">
          Reply: {complaint.reply ? complaint.reply : "No reply yet"}
        </p>
      )}
      {user.type === "admin" && (
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Reply
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      )}
      
      
    </div>
  );
}

export default ComplaintContainer;
