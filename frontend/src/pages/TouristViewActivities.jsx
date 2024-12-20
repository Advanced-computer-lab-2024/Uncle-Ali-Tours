import React from 'react'
import { useState, useEffect } from 'react';
import { useActivityStore } from '../store/activity';
import { useTouristStore } from '../store/tourist';
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
import ActivityContainer from '../components/ActivityContainer.jsx';
import TouristActivityContainer from '../components/TouristActivityContainer.jsx';

function TouristViewActivities() {
    const [filter, setFilter] = useState(
        {}
    );
    const [applyPreferences, setApplyPreferences] = useState(false);
    const [curActivity, setCurActivity] = useState(-1);

    const changeActivity = (id) => (
      setCurActivity(id)
    )
    const [visibillity, setVisibillity] = useState(
      false
  );

  const [sort, setSort] = useState(
    {}
);
const [activity, setActivities] = useState([]);

const [bookmarkedIds, setBookmarkedIds] = useState([]); // Store bookmarked activity IDs

const { tourist } = useTouristStore();
useEffect(() => {
  getCategories();

  if (applyPreferences && tourist && tourist.myPreferences && tourist.myPreferences.length > 0) {
    // Apply tourist preferences when checkbox is checked
    setFilter((prevFilter) => ({
      ...prevFilter,
      preferenceTag: tourist.myPreferences.join(', '), // Assuming preferences are strings
    }));
  } else if (!applyPreferences || (tourist && tourist.myPreferences && tourist.myPreferences.length === 0)) {
    // Reset the preference filter when the checkbox is unchecked
    setFilter((prevFilter) => {
      const { preferenceTag, ...rest } = prevFilter; // Remove preferenceTag filter
      return rest;
    });
  }
}, [applyPreferences, tourist]);
    
    const {activities, getActivities, categories, getCategories} = useActivityStore();
   const handlePress = async () => {
    
    await getActivities(filter, sort);
    console.log(filter);
    setFilter({});
    
   };
   const handleSort = async () => {
     setVisibillity((prev) => !prev);
     console.log(sort)
     setSort({});
     
   };
  

   const fetchActivities = async () => {
    try {
        const response = await fetch('/api/activity');
        const data = await response.json();
        if (data.success) {
            setActivities(data.data);
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
};

useEffect(() => {
    fetchActivities();
    fetchBookmarkedActivities(); // Fetch bookmarked activities on page load

}, []);

const fetchBookmarkedActivities = async () => {
  try {
      const response = await fetch(
          `/api/activity/bookmarkedActivities?userName=${localStorage.getItem('userName')}`
      );
      const data = await response.json();
      if (data.success) {
        const ids = data.data.map((activity) => activity._id);
        setBookmarkedIds(ids); // Save bookmarked activity IDs
      }
  } catch (error) {
      console.error('Error fetching bookmarked activities:', error);
  }
};


// Handle Bookmark Toggle
const handleBookmarkToggle = (activityId, isBookmarked) => {
  if (isBookmarked) {
      setBookmarkedIds((prev) => [...prev, activityId]); // Add to bookmarks
  } else {
      setBookmarkedIds((prev) => prev.filter((id) => id !== activityId)); // Remove from bookmarks
  }
};

  

   return (
    <div className='text-black'>
      <label className='m-2'>
        <input 
          type="checkbox" 
          checked={applyPreferences} 
          onChange={(e) => setApplyPreferences(e.target.checked)} 
        /> 
        Apply My Preferences
      </label>
        <input className='w-[15ch] m-2 pl-1' value={filter.name || ""} name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' onClick={()=> (console.log(categories))} value={filter.category || ""} name={"category"} placeholder='Category' onChange={(e) => setFilter({ ...filter, category: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'value={filter.tag || ""} name={'tag'} placeholder='Tag' onChange={(e) => setFilter({ ...filter, tag: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' value={filter.minPrice || ""} name={"bud"} placeholder='minBudget' onChange={(e) => setFilter({ ...filter, minPrice: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  value={filter.maxPrice || ""} name={"bud"} placeholder='maxBudget' onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'value={filter.date || ""} name={"date"} placeholder='Date' onChange={(e) => setFilter({ ...filter, date: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1 'value={filter.ratings || ""} name={'ratings'} placeholder='Ratings' onChange={(e) => setFilter({ ...filter, ratings: e.target.value})}/>

        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <div className={` grid w-fit mx-auto`} >
        <div>
      <div className='mb-4 text-xl'>
            Available Activities   
        </div>
        {
            activities.map((activity, index)=> (
                <TouristActivityContainer key={index}
                //activityChanger={activity}
                  activity={activity}
                    isBookmarked={bookmarkedIds.includes(activity._id)} // Pass bookmark status
                    onBookmarkToggle={handleBookmarkToggle} // Pass toggle function onBookmarkToggle={handleBookmarkToggle} // Pass the toggle function here
/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name","value"]}/>
   
    
    </div>
       </div>
        <div><button className='p-2 bg-black text-white' onClick={() => (handleSort())}>{Object.keys(sort)[0]? "sorted by " + Object.keys(sort)[0] : "Sort"}</button>
        <div className={`${visibillity ? '' : 'hidden' } grid w-fit mx-auto`} >
          <button className='p-2 bg-black text-white' onClick={()=>(setSort({'price' : -1}))}>{"Price High to Low"}</button>
          <button className='p-2 bg-black text-white' onClick={()=>(setSort({'price' : 1}))}>{"Price Low to High"}</button>
          <button className='p-2 bg-black text-white' onClick={()=>(setSort({'rating' : -1}))}>{"Ratings High to Low"}</button>
          <button className='p-2 bg-black text-white' onClick={()=>(setSort({'rating' : 1}))}>{"Ratings Low to High"}</button>
       </div>
        </div>
        </div>
  )
}

export default TouristViewActivities