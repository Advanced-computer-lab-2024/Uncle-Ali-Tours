import React from "react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useComplaintStore } from "../store/complaint";
import { useNavigate } from "react-router-dom";
function FileComplaint() {
  const [complaint, setComplaint] = useState({
    title: "",
    body: "",
  });

  const { createComplaint } = useComplaintStore();
    const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.type !== "tourist") {
      navigate("/");
    }
  }, []);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const newComplaint = complaint;
    newComplaint.creator = user.userName;
    console.log(complaint);
    const { success, message } = await createComplaint(newComplaint);
    success
      ? toast.success(message, { className: "text-white bg-gray-800" })
      : toast.error(message, { className: "text-white bg-gray-800" });
  };

  return (
    <div>
        <Toaster />
      <p>FileComplaint</p>
      <div className="bg-white mt-32 h-fit mx-auto pt-2 w-fit rounded-xl">
        <div className="flex flex-col items-center">
          <input
            name="title"
            value={complaint.title}
            onChange={(e) =>
              setComplaint({ ...complaint, title: e.target.value })
            }
            placeholder="title"
            className="border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300"
            type="text"
          />
          <textarea
            name="body"
            value={complaint.body}
            onChange={(e) =>
              setComplaint({ ...complaint, body: e.target.value })
            }
            placeholder="body"
            className="border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300"
            type="text"
          />
          <button
            onClick={() => handleSubmit()}
            className="bg-black text-white m-6 p-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default FileComplaint;
