import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/itinerary';
import { useTagStore } from '../store/tag';
import { useUserStore } from '../store/user';

function CreateItinerary() {
    const { user } = useUserStore();
    const { newItinerary, addItineraries } = useItineraryStore(); 
    const { tags, getTags } = useTagStore();

    useEffect(() => {
        getTags()
    }, [])

    const [currItinerary, setNewItinerary] = useState({
      activities: [],
      durations: [],
      tourLocations: [],
      timeline: "",
      language: "",
      price: "",
      availableDates: "",
      availableTimes: "",
      accessibility: "",
      pickupLocation: "",
      dropoffLocation: "",
      isAppropriate: true,  // Default value is true
    });

    const [activityFields, setActivityFields] = useState([]);
    const [durationFields, setDurationFields] = useState([]);
    const [locationFields, setLocationFields] = useState([]);
    const [dateFields, setDateFields] = useState([]);
    const [timeFields, setTimeFields] = useState([]);
    const navigate = useNavigate();

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

    const handleAddItinerary = async () => {
        let tempArr = [];
        activityFields.map((activity, index) => (
            tempArr = [...tempArr, { name: activity, duration: durationFields[index] }]
        ));
        const { success, message } = await addItineraries({ ...currItinerary, activities: tempArr });
        if (success) {
            toast.success(message, { className: "text-white bg-gray-800" });
            navigate('/itineraryPage'); // Redirect to itineraryPage on success
        } else {
            toast.error(message, { className: "text-white bg-gray-800" });
        }
    };

    // State for storing the selected option
    const [selectedOption, setSelectedOption] = useState("");

    // Handle the selection change
    const handleSelectionChange = (e) => {
        setSelectedOption(e.target.value);
        setNewItinerary({ ...currItinerary, preferenceTag: e.target.value });
    };

    return (
        <div>
            <div className='text-2xl mb-3 mt-3'>Create New Itinerary</div>
            <input
                className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2 mb-4 text-black'
                name={"name"}
                placeholder='Enter Name'
                onChange={(e) => setNewItinerary({ ...currItinerary, name: e.target.value })}
            ></input>

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

            <button
                onClick={addFn}
                className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'
            >
                Add Activity
            </button>

            <div className="text-black mt-4">
                {activityFields.map((field, index) => (
                    <div key={index} className='mb-4'>
                        <input
                            value={field}
                            type="text"
                            placeholder={`Enter activity ${index + 1}`}
                            className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                            onChange={(e) => {
                                const newFields = [...activityFields];
                                newFields[index] = e.target.value;
                                setActivityFields(newFields);
                            }}
                        />
                        <input
                            value={durationFields[index]}
                            type="text"
                            placeholder={`Duration for activity ${index + 1}`}
                            className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                            onChange={(e) => {
                                const newFields = [...durationFields];
                                newFields[index] = e.target.value;
                                setDurationFields(newFields);
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
                <button
                    onClick={addLoc}
                    className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'
                >
                    Add Location To visit
                </button>
                <div className="text-black mt-4">
                    {locationFields.map((field, index) => (
                        <div key={index} className="mb-4">
                            <input
                                value={field}
                                type="text"
                                placeholder={`Enter location ${index + 1}`}
                                className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                                onChange={(e) => {
                                    const newFields = [...locationFields];
                                    newFields[index] = e.target.value;
                                    setLocationFields(newFields);
                                    setNewItinerary({ ...currItinerary, tourLocations: locationFields });
                                    setNewItinerary({ ...currItinerary, creator: user.userName });
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
                    <button
                        onClick={addDate}
                        className='px-5 py-2 bg-green-700 text-white rounded cursor-pointer border-none'
                    >
                        Add Date & Time
                    </button>
                    <div className="text-black mt-4">
                        {dateFields.map((field, index) => (
                            <div key={index} className='mb-4'>
                                <input
                                    value={field}
                                    type="text"
                                    placeholder={`Enter date ${index + 1}`}
                                    className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                                    onChange={(e) => {
                                        const newFields = [...dateFields];
                                        newFields[index] = e.target.value;
                                        setDateFields(newFields);
                                        setNewItinerary({ ...currItinerary, availableDates: dateFields });
                                    }}
                                />
                                <input
                                    value={timeFields[index]}
                                    type="text"
                                    placeholder={`Time ${index + 1}`}
                                    className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                                    onChange={(e) => {
                                        const newFields = [...timeFields];
                                        newFields[index] = e.target.value;
                                        setTimeFields(newFields);
                                        setNewItinerary({ ...currItinerary, availableTimes: timeFields });
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
                        onChange={(e) => setNewItinerary({ ...currItinerary, timeline: e.target.value })}
                    ></input>
                    <input
                        className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                        name={"language"}
                        placeholder='Language of Tour'
                        onChange={(e) => setNewItinerary({ ...currItinerary, language: e.target.value })}
                    ></input>
                    <input
                        className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                        name={"price"}
                        placeholder='Price'
                        onChange={(e) => setNewItinerary({ ...currItinerary, price: e.target.value })}
                    ></input>
                    <input
                        className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                        name={"accessibility"}
                        placeholder='Accessibility'
                        onChange={(e) => setNewItinerary({ ...currItinerary, accessibility: e.target.value })}
                    ></input>
                    <input
                        className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                        name={"pickupLocation"}
                        placeholder='Pick Up Location'
                        onChange={(e) => setNewItinerary({ ...currItinerary, pickupLocation: e.target.value })}
                    ></input>
                    <input
                        className='rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2'
                        name={"dropoffLocation"}
                        placeholder='Drop Off Location'
                        onChange={(e) => setNewItinerary({ ...currItinerary, dropoffLocation: e.target.value })}
                    ></input>
                </div>

                <div>
                    <button
                        className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105'
                        onClick={handleAddItinerary}
                    >
                        Add Itinerary
                    </button>
                    <Link to='/itineraryPage'>
                        <button
                            className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105'
                        >
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default CreateItinerary;
