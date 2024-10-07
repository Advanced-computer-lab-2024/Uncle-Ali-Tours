import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function UpdateItinerary() {
  const itinerary={ id:1,
    activities:["Tennis","Football","Basketball","Volleyball"],
    durations:["1 week","1 month","3 days","2 weeks"],
    locations:["GUC","BUE","FUE","AUC"],
    timeline:"AAAAAAAAAAA",
    language:"English",
    accessibility:"1",
    pickup:"GUC Gate 1",
    dropoff:"GUC Gate 3",

  };
    const [currentItinerary, setCurrentItinerary] = useState(itinerary);
    const [checkedAttributes, setCheckedAttributes] = useState({
        activities: false,
        durations: false,
        locations: false,
        timeline: false,
        language: false,
        accessibility: false,
        pickup: false,
        dropoff: false,
        dateTimes: false,
    });

    // State to hold updated itinerary
    const [updatedItinerary, setUpdatedItinerary] = useState({
        activities: currentItinerary.activities || [],
        durations: currentItinerary.durations || [],
        locations: currentItinerary.locations || [],
        timeline: currentItinerary.timeline || '',
        language: currentItinerary.language || '',
        accessibility: currentItinerary.accessibility || '',
        pickup: currentItinerary.pickup || '',
        dropoff: currentItinerary.dropoff || '',
        dateTimes: currentItinerary.dateTimes || [],
    });

    // Save a copy of the original itinerary state for reference
    const [originalItinerary] = useState(itinerary);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckedAttributes((prev) => ({
            ...prev,
            [name]: checked,
        }));

        // Reset values to original when unchecked
        if (!checked) {
            if (name === 'activities' || name === 'durations') {
                setUpdatedItinerary((prev) => ({
                    ...prev,
                    activities: originalItinerary.activities || [],
                    durations: originalItinerary.durations || [],
                }));
            } else {
                setUpdatedItinerary((prev) => ({
                    ...prev,
                    [name]: originalItinerary[name] || (Array.isArray(originalItinerary[name]) ? [] : ''),
                }));
            }
        }
    };

    const handleInputChange = (e, key, index = null, subKey = null) => {
        const { value } = e.target;
        if (index !== null) {
            if (subKey) {
                // For date-time pairs
                setUpdatedItinerary((prev) => {
                    const updatedArray = [...prev[key]];
                    updatedArray[index] = {
                        ...updatedArray[index],
                        [subKey]: value,
                    };
                    return {
                        ...prev,
                        [key]: updatedArray,
                    };
                });
            } else {
                // For array fields
                setUpdatedItinerary((prev) => {
                    const updatedArray = [...prev[key]];
                    updatedArray[index] = value;
                    return {
                        ...prev,
                        [key]: updatedArray,
                    };
                });
            }
        } else {
            // For non-array fields
            setUpdatedItinerary((prev) => ({
                ...prev,
                [key]: value,
            }));
        }
    };

    const addActivityAndDuration = () => {
        setUpdatedItinerary((prev) => ({
            ...prev,
            activities: [...prev.activities, ''], // Add new empty activity input
            durations: [...prev.durations, ''],   // Add new empty duration input
        }));
    };

    const addDateTime = () => {
        setUpdatedItinerary((prev) => ({
            ...prev,
            dateTimes: [...prev.dateTimes, { date: '', time: '' }], // Add new empty date-time pair
        }));
    };

    const addLocation = () => {
        setUpdatedItinerary((prev) => ({
            ...prev,
            locations: [...prev.locations, ''], // Add new empty location input
        }));
    };

    const deleteActivityAndDuration = (index) => {
        setUpdatedItinerary((prev) => ({
            ...prev,
            activities: prev.activities.filter((_, i) => i !== index),
            durations: prev.durations.filter((_, i) => i !== index),
        }));
    };

    const deleteDateTime = (index) => {
        setUpdatedItinerary((prev) => ({
            ...prev,
            dateTimes: prev.dateTimes.filter((_, i) => i !== index),
        }));
    };

    const deleteLocation = (index) => {
        setUpdatedItinerary((prev) => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = () => {
        // Process updated itinerary
        console.log('Updated Itinerary:', updatedItinerary);
    };

    return (
        <div className="update-itinerary">
            <h2 className="text-2xl mb-4 text-center">Update Itinerary</h2>

            {/* Checkbox for Activities */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="activities"
                        checked={checkedAttributes.activities}
                        onChange={handleCheckboxChange}
                    />
                    Update Activities & Durations
                </label>
            </div>

            {checkedAttributes.activities && (
                <div className="flex flex-col items-center">
                    {updatedItinerary.activities.map((activity, index) => (
                        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={activity}
                                onChange={(e) => handleInputChange(e, 'activities', index)}
                                placeholder={`Activity ${index + 1}`}
                                className="rounded w-[150px] p-1 border border-[#ccc] rounded-md mr-1 text-black"
                            />
                            <input
                                type="text"
                                value={updatedItinerary.durations[index] || ''}
                                onChange={(e) => handleInputChange(e, 'durations', index)}
                                placeholder={`Duration ${index + 1}`}
                                className="rounded w-[150px] p-1 border border-[#ccc] rounded-md mr-1 text-black"
                            />
                            <button
                                onClick={() => deleteActivityAndDuration(index)}
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: 'red',
                                    color: '#fff',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: 'none',
                                    fontSize: '12px',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addActivityAndDuration}
                        className="px-2 py-1 bg-blue-500 text-white rounded mt-2 text-sm"
                    >
                        Add Activity & Duration
                    </button>
                </div>
            )}

            {/* Checkbox for Locations */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="locations"
                        checked={checkedAttributes.locations}
                        onChange={handleCheckboxChange}
                    />
                    Update Locations
                </label>
            </div>

            {checkedAttributes.locations && (
                <div className="flex flex-col items-center">
                    {updatedItinerary.locations.map((location, index) => (
                        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => handleInputChange(e, 'locations', index)}
                                placeholder={`Location ${index + 1}`}
                                className="rounded w-[150px] p-1 border border-[#ccc] rounded-md mr-1 text-black"
                            />
                            <button
                                onClick={() => deleteLocation(index)}
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: 'red',
                                    color: '#fff',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: 'none',
                                    fontSize: '12px',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addLocation}
                        className="px-2 py-1 bg-blue-500 text-white rounded mt-2 text-sm"
                    >
                        Add Location
                    </button>
                </div>
            )}

            {/* Checkbox for Timeline */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="timeline"
                        checked={checkedAttributes.timeline}
                        onChange={handleCheckboxChange}
                    />
                    Update Timeline
                </label>
            </div>

            {checkedAttributes.timeline && (
                <input
                    type="text"
                    value={updatedItinerary.timeline}
                    onChange={(e) => handleInputChange(e, 'timeline')}
                    placeholder="Timeline"
                    className="rounded w-[150px] p-1 border border-[#ccc] rounded-md text-black mb-4"
                />
            )}

            {/* Checkbox for Language */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="language"
                        checked={checkedAttributes.language}
                        onChange={handleCheckboxChange}
                    />
                    Update Language
                </label>
            </div>

            {checkedAttributes.language && (
                <input
                    type="text"
                    value={updatedItinerary.language}
                    onChange={(e) => handleInputChange(e, 'language')}
                    placeholder="Language"
                    className="rounded w-[150px] p-1 border border-[#ccc] rounded-md text-black mb-4"
                />
            )}

            {/* Checkbox for Accessibility */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="accessibility"
                        checked={checkedAttributes.accessibility}
                        onChange={handleCheckboxChange}
                    />
                    Update Accessibility
                </label>
            </div>

            {checkedAttributes.accessibility && (
                <input
                    type="text"
                    value={updatedItinerary.accessibility}
                    onChange={(e) => handleInputChange(e, 'accessibility')}
                    placeholder="Accessibility"
                    className="rounded w-[150px] p-1 border border-[#ccc] rounded-md text-black mb-4"
                />
            )}

            {/* Checkbox for Pickup */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="pickup"
                        checked={checkedAttributes.pickup}
                        onChange={handleCheckboxChange}
                    />
                    Update Pickup
                </label>
            </div>

            {checkedAttributes.pickup && (
                <input
                    type="text"
                    value={updatedItinerary.pickup}
                    onChange={(e) => handleInputChange(e, 'pickup')}
                    placeholder="Pickup"
                    className="rounded w-[150px] p-1 border border-[#ccc] rounded-md text-black mb-4"
                />
            )}

            {/* Checkbox for Dropoff */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="dropoff"
                        checked={checkedAttributes.dropoff}
                        onChange={handleCheckboxChange}
                    />
                    Update Dropoff
                </label>
            </div>

            {checkedAttributes.dropoff && (
                <input
                    type="text"
                    value={updatedItinerary.dropoff}
                    onChange={(e) => handleInputChange(e, 'dropoff')}
                    placeholder="Dropoff"
                    className="rounded w-[150px] p-1 border border-[#ccc] rounded-md text-black mb-4"
                />
            )}

            {/* Checkbox for Date and Time */}
            <div className="flex justify-center mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        name="dateTimes"
                        checked={checkedAttributes.dateTimes}
                        onChange={handleCheckboxChange}
                    />
                    Update Date & Time
                </label>
            </div>

            {checkedAttributes.dateTimes && (
                <div className="flex flex-col items-center">
                    {updatedItinerary.dateTimes.map((dateTime, index) => (
                        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <label htmlFor={`dateInput${index}`} className='text-white ml-2'>Date {index + 1}: </label>
                            <input
                                id={`dateInput${index}`}
                                type="date"
                                value={dateTime.date}
                                onChange={(e) => handleInputChange(e, 'dateTimes', index, 'date')}
                                className="ml-2 rounded w-[100px] p-1 border border-[#ccc] rounded-md text-black"
                            />
                            <label htmlFor={`timeInput${index}`} className='text-white ml-2'>Time {index + 1}: </label>
                            <input
                                id={`timeInput${index}`}
                                type="time"
                                value={dateTime.time}
                                onChange={(e) => handleInputChange(e, 'dateTimes', index, 'time')}
                                className="ml-2 rounded w-[100px] p-1 border border-[#ccc] rounded-md text-black"
                            />
                            <button
                                onClick={() => deleteDateTime(index)}
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: 'red',
                                    color: '#fff',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: 'none',
                                    fontSize: '12px',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addDateTime}
                        className="px-2 py-1 bg-blue-500 text-white rounded mt-2 text-sm"
                    >
                        Add Date & Time
                    </button>
                </div>
            )}

            {/* Final Submit Button */}
            <div className="flex justify-center mt-6">
                <button className="px-4 py-1 bg-green-700 text-white rounded-md text-sm" onClick={handleSubmit}>
                    Update Itinerary
                </button>
            </div>
        </div>
    );
}

export default UpdateItinerary;
