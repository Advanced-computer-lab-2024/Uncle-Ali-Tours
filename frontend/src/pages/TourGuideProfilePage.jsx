import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from '../store/user';
import { useGuideStore } from '../store/tourGuide';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Dialog, { dialog } from '../components/Dialog.jsx';
import AvatarEditor from 'react-avatar-editor';
import { FaEye, FaEdit } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useRequestStore } from '../store/requests.js';
import { FiLoader } from "react-icons/fi";
import {useItineraryStore} from "../store/itinerary";

const TourGuideProfilePage = () =>{
    const {user} = useUserStore();
    const {guide,getGuide,updateGuide} = useGuideStore();
    const [isRequired, setIsRequired] = useState(true);
    const { showDialog } = dialog()
    const [isEditing, setIsEditing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [filter, setFilter] = useState({});
    const { getItineraries, itineraries } = useItineraryStore();
    const [profilePic, setProfilePic] = useState(null);
    const [previewFile, setPreviewFile] = useState(localStorage.getItem("ProfilePicture") || "");
    const editorRef = useRef(null);
    const [report, setReport] = useState({
      totalTourists: 0,
      activities: [],
      itineraries: []
    });
    const handleButtonClick = () => {
        setIsRequired(false);
    };
    const [salesReport, setSalesReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [filters, setFilters] = useState({ product: "", dateRange: { start: "", end: "" }, month: "" });
  
     useEffect(() => {
      fetchSalesReport();
     },[itineraries]);
    const fetchSalesReport = async () => {
      await getItineraries({ ...filter, creator: user.userName }); // Ensure itineraries are fetched

    
      const itinerariesSales = itineraries
        .map((itinerary) => ({
          name: itinerary.name,
          revenue: (itinerary.numberOfBookings || 0) * itinerary.price,
          availableDates: itinerary.availableDates || "2024-11-01",
        }));
    
      const data = [
        ...itinerariesSales,
      ];
    
      setSalesReport(data);
      
      setFilteredReport(data);
    };
    const handleFilterChange = (field, value) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    };
  
    const applyFilters = () => {
      let filtered = salesReport;
  
  
  
      // Filter by date range
      if (filters.dateRange.start && filters.dateRange.end) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.date);
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
  
      // Filter by month
      if (filters.month) {
        filtered = filtered.filter((item) => new Date(item.date).getMonth() + 1 === parseInt(filters.month));
      }
  
      setFilteredReport(filtered);
      
    };
    useEffect(() => {
      const fetchReport = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/tourGuide/report/${user.userName}`);
          if (!response.ok) {
            throw new Error('Failed to fetch report');
          }
          const data = await response.json(); // Parse the JSON data
          console.log('Fetched Report:', data); // Debug log
          setReport(data); // Update the report state
        } catch (error) {
          console.error('Error fetching report:', error);
          toast.error('Failed to fetch report.', { className: 'text-white bg-gray-800' });
        }
      };
    
      if (user.userName) {
        fetchReport();
      }
    }, [user.userName]);
    const [updatedGuide,setUpdatedGuide]= useState({});  
    const handleButtonClickk = async () => {
        if(!isRequired){
           const {success, message}  = await updateGuide(user.userName , updatedGuide);
           success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

        }
    }
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/itineraryPage');
    };

    useEffect(() => {
        if (user.type !== 'tour guide') {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        const fetchGuideData = async () => {
            if (user.userName) {
            const result = await getGuide({ userName: user.userName });
            if (result.success && guide.profilePicture) {
                setPreviewFile(guide.profilePicture);
                localStorage.setItem("ProfilePicture", guide.profilePicture);
            }}
        };
        fetchGuideData();
    }, [user.userName, guide.profilePicture]);

    
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
        setProfilePic(null);
      };

    const handleEditClick = () => setIsRequired(false);
    const handleSaveClick = async () => {
        if (!isRequired) {
            const { success, message } = await updateGuide(user.userName, updatedGuide);
            success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(file);
            localStorage.removeItem("ProfilePicture");
        } else {
            console.error("No file selected");
        }
    };
    const handleUploadClick = async () => {
        if (selectedFile) {
          const formData = new FormData();
          formData.append('profilePicture', selectedFile);
          formData.append('userName', user.userName);
      
          try {
            const response = await axios.put('/api/tourGuide/uploadPicture', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(response.data.message, { className: "text-white bg-gray-800" });
            
            // Refresh seller data after upload
            if (user.userName) {
              await getGuide({ userName: user.userName }, {});
            }
            
          } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed", { className: "text-white bg-gray-800" });
          }
        } else {
          toast.error("Please select a file first", { className: "text-white bg-gray-800" });
        }
      };
      

      const handleSaveProfilePicture = async () => {
        if (editorRef.current && profilePic) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            const dataUrl = canvas.toDataURL();
            const blob = await fetch(dataUrl).then((res) => res.blob());
            const formData = new FormData();
            formData.append("profilePicture", blob, "profile-photo.png");
            formData.append("userName", user.userName);
    
            try {
                const response = await axios.put(`http://localhost:3000/api/tourGuide/uploadPicture`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                if (response.data.success) {
                    const profileImagePath = response.data.profilePicture;
                    setPreviewFile(profileImagePath);
                    localStorage.setItem("ProfilePicture", profileImagePath);
                    setIsEditing(false);
                    setProfilePic(null);
                    toast.success(response.data.message, { className: "text-white bg-gray-800" });
    
                    // Refresh guide data to show the updated image
                    await getGuide({ userName: user.userName });
                } else {
                    toast.error(response.data.message || "Upload failed", { className: "text-white bg-gray-800" });
                }
            } catch (error) {
                console.error("Error uploading profile photo:", error);
                toast.error("Error uploading profile photo", { className: "text-white bg-gray-800" });
            }
        } else {
            console.error("No file selected for upload");
            toast.error("No file selected for upload", { className: "text-white bg-gray-800" });
        }
    };
    
    

   

    return (
        <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
            <Toaster/>
            <div className="flex items-center justify-center mb-6">
        {previewFile ? (
          <img
            style={{ width: "160px", height: "160px", borderRadius: "50%", objectFit: "cover" }}
            src={`http://localhost:3000${previewFile}`}
            alt="ProfilePicture"
          />
        ) : (
          <div className="text-gray-500">add profile picture</div>
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

      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile Picture Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={`http://localhost:3000${previewFile}`}
            alt="Profile Preview"
            className="img-fluid"
            style={{ maxWidth: "100%", borderRadius: "50%" }}
          />
        </Modal.Body>
      </Modal>

           <h1>profile</h1>
           <div className="grid">
           <label>NAME : <input type = "text" name='name' defaultValue={guide.userName} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange= {(e) => setUpdatedGuide({ ...updatedGuide, userName: e.target.value})}></input></label>
           <label>Email : <input type = "text" name='email' defaultValue={guide.email} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, email: e.target.value})}></input></label>
           <label>Mobile number : <input type = "text" name='mobileNumer' defaultValue={guide.mobileNumber} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, mobileNumber: e.target.value})}></input></label>
           <label>Years of experience : <input type = "Number" name='yearsOfExperiance' defaultValue={guide.yearsOfExperience} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, yearsOfExperience: e.target.value})}></input></label>
           <label>Previous Work : <input type = "text" name='previousWork' defaultValue={guide.previousWork} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, previousWork: e.target.value})}></input></label>
           <label>Nationality : <input type = "text" name='nationality' defaultValue={guide.nationality} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, nationality: e.target.value})}></input></label>
           <label>Date of birth : <input type = "text" name='dateOfBirth' defaultValue={guide.dateOfBirth ? guide.dateOfBirth.split('T')[0] : ""} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, dateOfBirth: e.target.value})}></input></label>           
           </div>

           

        

           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleButtonClick}>Edit</button> 
           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleButtonClickk}>save</button>
           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleRedirect}>itinerary</button>
           <div>
           <Dialog msg={"Are you sure you want to delete your account?"} accept={() => (console.log("deleted"))} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
            <button className='bg-red-600 text-white m-6 p-2 rounded' onClick={handleDeleteClick}>Delete Account</button>
           </div>
           {isEditing && (
            <>
              <label>
                Upload img:
                <input
                  type="file"
                  name="ProfilePicture"
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
                    
                    style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                  />
                  <div className="controls mt-3">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      
                      className="slider bg-gray-700"
                    />
                    
                    <button className="bg-black text-white p-2 rounded mt-4" onClick={handleSaveProfilePicture}>
                      Save Profile Picture
                    </button>
                    
                  </div>
                </div>
              )}
            </>
          )}
        
       
           <br />
          <button className='bg-black text-white m-6 p-2 rounded' onClick={handleDeleteClick}>Delete Account</button> 
           {isDeleteVisible && (
            <div className='bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
            <p>Are you sure you want to request to delete your account?</p>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={handleDeleteAccountRequest}>Request</button>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={() => setIsDeleteVisible(false)}>Cancel</button>
            </div>
           )}         
           {/* Report Section */}

      <div className="mt-6 bg-gray-700 p-4 rounded-md">
        <h2 className="text-xl mb-4">Tourist Report</h2>
        <p>
          <strong>Total Tourists:</strong> {report.totalTourists}
        </p>
       

      <div className="mt-4">
          <h3 className="text-lg mb-2">Itineraries</h3>
          <table className="w-full text-left text-sm border-collapse border border-gray-600">
            <thead>
              <tr>
                <th className="border border-gray-600 px-2 py-1">Title</th>
                <th className="border border-gray-600 px-2 py-1">Language</th>
                <th className="border border-gray-600 px-2 py-1">Tourists</th>
              </tr>
            </thead>
            <tbody>
              {report.itineraries.length > 0 ? (
                report.itineraries.map((itinerary, index) => (
                  <tr key={index}>
                    <td className="border border-gray-600 px-2 py-1">{itinerary.title}</td>
                    <td className="border border-gray-600 px-2 py-1">
                      {itinerary.language}
                    </td>
                    <td className="border border-gray-600 px-2 py-1">{itinerary.numberOfTourists}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-gray-600 px-2 py-1" colSpan="3">
                    No itineraries available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
                                 {/* Sales Report Section */}
                                 <div className="relative py-8 px-8 w-[33vw] backdrop-blur-lg bg-[#161821f0] h-full rounded-lg shadow-lg text-white">
          <h3 className="text-2xl text-center mb-4">Sales Report</h3>

          {/* Filters */}
          <div className="flex gap-4 mb-4">

            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, start: e.target.value })}
              className="bg-gray-800 text-white rounded-md px-2 py-2"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, end: e.target.value })}
              className="bg-gray-800 text-white rounded-md px-2 py-2"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>

          {/* Report Table */}
          <table className="w-full text-white">
  <thead>
    <tr className="border-b border-gray-600">
      <th className="py-2 px-4">Name</th>
      <th className="py-2 px-4">Revenue</th>
      <th className="py-2 px-4">Available Dates</th>
    </tr>
  </thead>
  <tbody>
    {filteredReport.length > 0 ? (
      filteredReport.map((item, index) => (
        <tr key={index} className="border-b border-gray-600">
          <td className="py-2 px-4">{item.name}</td>
          <td className="py-2 px-4">${item.revenue}</td>
          <td className="py-2 px-4">{item.availableDates}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="py-4 text-center">
          No sales data available for the selected filters.
        </td>
      </tr>
    )}
  </tbody>
</table>

        </div>
             </div>
        
    );
};

export default TourGuideProfilePage;