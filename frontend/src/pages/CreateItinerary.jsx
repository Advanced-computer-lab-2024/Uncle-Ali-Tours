import React from 'react'
import { useState } from 'react';
import { useItineraryStore } from '../store/itinerary';
import toast, { Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/user';
import { Link } from 'react-router-dom';
function CreateItinerary() {
    const {user} = useUserStore();
    const {newItinerary, addItineraries} = useItineraryStore(); 
    const [currItinerary, setNewItinerary] = useState({
      activities:[],
      durations:[],
      tourLocations:[],
      timeline:"",
      language:"",
      price:"",
      availableDates:"",
      availableTimes:"",
      accessibility:"",
      pickupLocation:"",
      dropoffLocation:"",
  });
    const [activityFields, setActivityFields] = useState([]);
    const [durationFields, setDurationFields] = useState([]);
    const [locationFields, setLocationFields] = useState([]);
    const [dateFields, setDateFields] = useState([]);
    const [timeFields, setTimeFields] = useState([]);
    // Function to add new input fields
    const addFn = () => {
      // Create a new array with one more input field (represented as an empty string)
      setActivityFields([...activityFields, ""]);
      setDurationFields([...durationFields, ""]);
      
    };
    const deleteFn = (indexToDelete) => {
      // Filter out the input field at the given index
      setActivityFields(activityFields.filter((_, index) => index !== indexToDelete));
      setDurationFields(durationFields.filter((_, index) => index !== indexToDelete));
    };
    const addLoc= () => {
      setLocationFields([...locationFields,""]);
    };
    const deleteLoc = (indexToDelete) => {
      setLocationFields(locationFields.filter((_, index) => index !== indexToDelete));
    }
    const addDate= () => {
      setDateFields([...dateFields,""]);
      setTimeFields([...timeFields,""]);
    };
    const deleteDate = (indexToDelete) => {
      setDateFields(dateFields.filter((_, index) => index !== indexToDelete));
      setTimeFields(timeFields.filter((_, index) => index !== indexToDelete));
    }

    const [availableDates, setDate] = useState('');
    const [availableTimes, setTime] = useState('');

  // Event handlers for date and time inputs
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Date:", availableDates);
    console.log("Selected Time:", availableTimes);
  };
    
    const handleAddItinerary = async() => {
      let tempArr = []
      activityFields.map((activity, index) => (
        tempArr = [...tempArr,{name:activity,duration:durationFields[index]}]
      ))
      const {success, message} = await addItineraries({...currItinerary, activities:tempArr});
      success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    }
  return (
    <div>
    <div className='text-2xl mb-3 mt-3'>Create New Itinerary</div>
     <button onClick={addFn} className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'>
        Add Activity
      </button>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2 text-black' name={"name"} placeholder='Enter Name' onChange={(e) => setNewItinerary({ ...currItinerary, name: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2 text-black' name={"preferenceTag"} placeholder='Enter Preference Tag' onChange={(e) => setNewItinerary({ ...currItinerary, preferenceTag: e.target.value})}></input>

      {/* Render all input fields */}
      <div className="text-black" style={{ marginTop: "20px" }}>
        {activityFields.map((field, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {/* Input field with dynamic placeholder */}
            <input
              value={field}
              type="text"
              placeholder={`Enter activity ${index + 1}`}  // Dynamic placeholder based on index
              className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
              onChange={(e) => {
                const newFields = [...activityFields];
                newFields[index] = e.target.value;  // Update value of the input field
                setActivityFields(newFields);
              }}
            />
            <input
            value= {durationFields[index]}
              type="text"
              placeholder={`Duration for activity ${index + 1}`}  // Dynamic placeholder based on index
              className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
              onChange={(e) => {
                const newFields = [...durationFields];
                newFields[index] = e.target.value;  // Update value of the input field
                setDurationFields(newFields);
              }}
            />

            {/* Delete button for the individual input */}
            <button
              onClick={() => deleteFn(index)}
              style={{
                padding: "8px 12px",
                backgroundColor: "red",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <button onClick={addLoc} className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'>
        Add Location To visit
        </button>
      <div className="text-black" style={{ marginTop: "20px" }}>
        {locationFields.map((field, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {/* Input field with dynamic placeholder */}
            <input
              value={field}
              type="text"
              placeholder={`Enter location ${index + 1}`}  // Dynamic placeholder based on index
              className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
              onChange={(e) => {
                const newFields = [...locationFields];
                newFields[index] = e.target.value;  // Update value of the input field
                setLocationFields(newFields);
                setNewItinerary({...currItinerary, tourLocations: locationFields})
                setNewItinerary({...currItinerary, creator: user.userName})
              }}
            />
            

            {/* Delete button for the individual input */}
            <button
              onClick={() => deleteLoc(index)}
              style={{
                padding: "8px 12px",
                backgroundColor: "red",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <button onClick={addDate} className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'>
        Add Date & Time
        </button>
        <div className="text-black" style={{ marginTop: "20px" }}>
        {dateFields.map((field, index) => (
          <div key={index} style={{ marginBottom: "10px" }} >
          <input
              value={field}
              type="text"
              placeholder={`Enter date ${index + 1}`}  // Dynamic placeholder based on index
              className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
              onChange={(e) => {
                const newFields = [...dateFields];
                newFields[index] = e.target.value;  // Update value of the input field
                setDateFields(newFields);
                setNewItinerary({ ...currItinerary,availableDates: dateFields})
              }}
            />
            <input
            value= {timeFields[index]}
              type="text"
              placeholder={`Time ${index + 1}`}  // Dynamic placeholder based on index
              className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
              onChange={(e) => {
                const newFields = [...timeFields];
                newFields[index] = e.target.value;  // Update value of the input field
                setTimeFields(newFields);
                setNewItinerary({ ...currItinerary,availableTimes: timeFields})
              }}
            />
            <button
              onClick={() => deleteDate(index)}
              style={{
                padding: "8px 12px",
                backgroundColor: "red",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        ))} 
        </div>

      </div>
      <div className='flex flex-col items-center text-black space-y-4'>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"timeline"} placeholder='Timeline' onChange={(e) => setNewItinerary({ ...currItinerary, timeline: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"language"} placeholder='Language of Tour' onChange={(e) => setNewItinerary({ ...currItinerary, language: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"price"} placeholder='Price' onChange={(e) => setNewItinerary({ ...currItinerary, price: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"accessibility"} placeholder='Accessibility' onChange={(e) => setNewItinerary({ ...currItinerary, accessibility: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"pickupLocation"} placeholder='Pick Up Location' onChange={(e) => setNewItinerary({ ...currItinerary, pickupLocation: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"dropoffLocation"} placeholder='Drop Off Location' onChange={(e) => setNewItinerary({ ...currItinerary, dropoffLocation: e.target.value})}></input>
      </div>
      <div>
      <Link to='/itineraryPage'>  
      <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' onClick={()=>(handleAddItinerary())}>Add Itinerary</button>
      <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' onClick={()=>(handleAddItinerary())}>Cancel</button>
      </Link>
      </div>
    </div>
    <Toaster/>
    </div>
  );
  
}


export default CreateItinerary

