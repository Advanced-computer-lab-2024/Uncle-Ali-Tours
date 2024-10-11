import React, { useState, useEffect } from 'react';
import { useItineraryStore } from '../store/itinerary';
import toast, { Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/user';
import { Link } from 'react-router-dom';
import { useTagStore } from '../store/tag';
import { useNavigate } from 'react-router-dom';
function UpdateItinerary() {
    const { user } = useUserStore();
    const { currentItinerary, setCurrentItinerary, updateItinerary } = useItineraryStore(); 
    const [currItinerary, setNewItinerary] = useState({});
    const originalItinerary = currentItinerary;
    const { tags, getTags } = useTagStore();

    useEffect(() => {
        getTags();
        setNewItinerary(currentItinerary); // Set the initial itinerary values
    }, [currentItinerary]); // Dependency on currentItinerary

    const [activityFields, setActivityFields] = useState([]);
    const [durationFields, setDurationFields] = useState([]);
    const [locationFields, setLocationFields] = useState([]);
    const [dateFields, setDateFields] = useState([]);
    const [timeFields, setTimeFields] = useState([]);

    // Function to add new input fields
    const addFn = () => {
        setActivityFields([...activityFields, ""]);
        setDurationFields([...durationFields, ""]);
    };

    const deleteFn = (indexToDelete) => {
        setActivityFields(activityFields.filter((_, index) => index !== indexToDelete));
        setDurationFields(durationFields.filter((_, index) => index !== indexToDelete));
    };

    const addLoc = () => {
        setLocationFields([...locationFields, ""]);
    };

    const deleteLoc = (indexToDelete) => {
        setLocationFields(locationFields.filter((_, index) => index !== indexToDelete));
    };

    const addDate = () => {
        setDateFields([...dateFields, ""]);
        setTimeFields([...timeFields, ""]);
    };

    const deleteDate = (indexToDelete) => {
        setDateFields(dateFields.filter((_, index) => index !== indexToDelete));
        setTimeFields(timeFields.filter((_, index) => index !== indexToDelete));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdate();
    };

    const handleUpdate = async () => {
      let tempArr = []
      activityFields.map((activity, index) => (
        tempArr = [...tempArr,{name:activity,duration:durationFields[index]}]
      ))
        const changes = {};
        for (let key in currItinerary) {
            if (currItinerary[key] !== originalItinerary[key]) {
                changes[key] = currItinerary[key];  // Only include changed fields
            }
        }
        if(currItinerary.activities !== tempArr && tempArr.length!==0){
          changes.activities = tempArr;
        }
        console.log(changes);
        const {success, message} = await updateItinerary(currItinerary._id,changes);
      if (success) {
        toast.success(message, { className: "text-white bg-gray-800" });
        navigate('/itineraryPage'); // Redirect to itineraryPage on success
      } else {
        toast.error(message, { className: "text-white bg-gray-800" });
        // Stay on the page if adding itinerary failed
      }     
    };

    const handleCancel = () => {
        setCurrentItinerary(originalItinerary);
        toast.info('Update canceled');
    };

    // State for storing the selected option
    const [selectedOption, setSelectedOption] = useState(currItinerary.preferenceTag || ""); // Default value

    // Handle the selection change
    const handleSelectionChange = (e) => {
        setSelectedOption(e.target.value);
        setNewItinerary({ ...currItinerary, preferenceTag: e.target.value });
    };

    return (
      <div>
          <div className='text-2xl mb-3 mt-3'>Update Itinerary</div>
          <input 
              className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2 mb-4 text-black' 
              name={"name"} 
              placeholder='Enter Name' 
              value={currItinerary.name || ""} // Ensure the value is tied to currItinerary
              onChange={(e) => setNewItinerary({ ...currItinerary, name: e.target.value })} 
          />
          <div className='text-black mb-4'>
              <label className='text-white'>Preference tag:</label>
              <select 
                  className='ml-2'
                  id="dropdown"
                  value={selectedOption}
                  onChange={handleSelectionChange}
              >
                  <option value="" disabled>
                      Select an option
                  </option>
                  {tags.map((tag, index) => (
                      <option key={index} value={tag.name}>
                          {tag.name}
                      </option>
                  ))}
              </select>
          </div>
          <button onClick={addFn} className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'>
              Add Activity
          </button>
          {/* Render all input fields */}
          <div className="text-black mt-4">
              {activityFields.map((field, index) => (
                  <div key={index} className='mb-4'>
                      <input
                          value={activityFields[index] || ""}
                          type="text"
                          placeholder={`Enter activity ${index + 1}`}
                          className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                          onChange={(e) => {
                              const newFields = [...activityFields];
                              newFields[index] = e.target.value;  // Update value of the input field
                              setActivityFields(newFields);
                              setNewItinerary({ ...currItinerary, activities: newFields });
                          }}
                      />
                      <input
                          value={durationFields[index] || ""}
                          type="text"
                          placeholder={`Duration for activity ${index + 1}`}
                          className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                          onChange={(e) => {
                              const newFields = [...durationFields];
                              newFields[index] = e.target.value;  // Update value of the input field
                              setDurationFields(newFields);
                              setNewItinerary({ ...currItinerary, durations: newFields });
                          }}
                      />
                      <button
                          onClick={() => deleteFn(index)}
                          className="rounded-md bg-red-500 text-white p-2 cursor-pointer border-none"
                      >
                          Delete
                      </button>
                  </div>
              ))}
              <button onClick={addLoc} className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'>
                  Add Location To Visit
              </button>
              <div className="text-black mt-4">
                  {locationFields.map((field, index) => (
                      <div key={index} className="mb-4">
                          <input
                              value={locationFields[index] || ""}
                              type="text"
                              placeholder={`Enter location ${index + 1}`}
                              className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                              onChange={(e) => {
                                  const newFields = [...locationFields];
                                  newFields[index] = e.target.value;  // Update value of the input field
                                  setLocationFields(newFields);
                                  setNewItinerary({ ...currItinerary, tourLocations: newFields });
                              }}
                          />
                          <button
                              onClick={() => deleteLoc(index)}
                              className="rounded-md bg-red-500 text-white py-2 px-3 cursor-pointer border-none"
                          >
                              Delete
                          </button>
                      </div>
                  ))}
                  <button onClick={addDate} className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'>
                      Add Date & Time
                  </button>
                  <div className="text-black mt-4">
                      {dateFields.map((field, index) => (
                          <div key={index} className='mb-4'>
                              <input
                                  value={dateFields[index] || ""}
                                  type="text"
                                  placeholder={`Enter date ${index + 1}`}
                                  className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                                  onChange={(e) => {
                                      const newFields = [...dateFields];
                                      newFields[index] = e.target.value;  // Update value of the input field
                                      setDateFields(newFields);
                                      setNewItinerary({ ...currItinerary, availableDates: newFields });
                                  }}
                              />
                              <input
                                  value={timeFields[index] || ""}
                                  type="text"
                                  placeholder={`Time ${index + 1}`}
                                  className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                                  onChange={(e) => {
                                      const newFields = [...timeFields];
                                      newFields[index] = e.target.value;  // Update value of the input field
                                      setTimeFields(newFields);
                                      setNewItinerary({ ...currItinerary, availableTimes: newFields });
                                  }}
                              />
                              <button
                                  onClick={() => deleteDate(index)}
                                  className="rounded-md bg-red-500 text-white py-2 px-3 cursor-pointer border-none"
                              >
                                  Delete
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
              <div className='flex flex-col items-center text-black space-y-4'>
                  <input
                      className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                      name={"timeline"}
                      placeholder='Timeline'
                      value={currItinerary.timeline || ""} // Ensure the value is tied to currItinerary
                      onChange={(e) => setNewItinerary({ ...currItinerary, timeline: e.target.value })} 
                  />
                  <input
                      className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                      name={"language"}
                      placeholder='Language of Tour'
                      value={currItinerary.language || ""} // Ensure the value is tied to currItinerary
                      onChange={(e) => setNewItinerary({ ...currItinerary, language: e.target.value })} 
                  />
                  <input
                      className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                      name={"price"}
                      placeholder='Price'
                      value={currItinerary.price || ""} // Ensure the value is tied to currItinerary
                      onChange={(e) => setNewItinerary({ ...currItinerary, price: e.target.value })} 
                  />
                  <input
                      className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                      name={"accessibility"}
                      placeholder='Accessibility'
                      value={currItinerary.accessibility || ""} // Ensure the value is tied to currItinerary
                      onChange={(e) => setNewItinerary({ ...currItinerary, accessibility: e.target.value })} 
                  />
                  <input
                      className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                      name={"pickupLocation"}
                      placeholder='Pick Up Location'
                      value={currItinerary.pickupLocation || ""} // Ensure the value is tied to currItinerary
                      onChange={(e) => setNewItinerary({ ...currItinerary, pickupLocation: e.target.value })} 
                  />
                  <input
                      className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                      name={"dropoffLocation"}
                      placeholder='Drop Off Location'
                      value={currItinerary.dropoffLocation || ""} // Ensure the value is tied to currItinerary
                      onChange={(e) => setNewItinerary({ ...currItinerary, dropoffLocation: e.target.value })} 
                  />
              </div>
              <div>
                  <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' onClick={handleSubmit}>Update</button>
                  <Link to='/itineraryPage'>
                  <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' onClick={handleCancel}>Cancel</button>
                  </Link>
              </div>
          </div>
          <Toaster />
      </div>
    );
}

export default UpdateItinerary;
