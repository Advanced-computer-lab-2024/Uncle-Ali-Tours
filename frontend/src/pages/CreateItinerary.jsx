import React from 'react'
import { useState } from 'react';
function CreateItinerary() {
    const [activityFields, setActivityFields] = useState([]);
    const [durationFields, setDurationFields] = useState([]);
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
    const handleAddItinerary = async() => {
        console.log({activityFields},{durationFields})

    }
  return (
    <div>
    <div className='text-2xl mb-3 mt-3'>Create New Itinerary</div>
     <button onClick={addFn} className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'>
        Add Activity
      </button>

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
      </div>
      <div className='flex flex-col items-center text-black space-y-4'>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"locationsVisited"} placeholder='Locations to be visited' onChange={(e) => setNewTag({ name: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"timeline"} placeholder='Timeline' onChange={(e) => setNewTag({ name: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"language"} placeholder='Language of Tour' onChange={(e) => setNewTag({ name: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"accessibility"} placeholder='Accessibility' onChange={(e) => setNewTag({ name: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"pickup"} placeholder='Pick Up Location' onChange={(e) => setNewTag({ name: e.target.value})}></input>
      <input className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2' name={"dropoff"} placeholder='Drop Off Location' onChange={(e) => setNewTag({ name: e.target.value})}></input>
      </div>
      <div>
      <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' onClick={()=>(handleAddItinerary())}>Add Itinerary</button>
      </div>
    </div>
  );
}


export default CreateItinerary

