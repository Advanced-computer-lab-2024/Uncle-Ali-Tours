import React, { useEffect, useState } from 'react';
import Dialog from '../components/Dialog.jsx';
import FormDialog from '../components/FormDialog.jsx';
import TouristItineraryContainer from '../components/TouristItineraryContainer';
import { useItineraryStore } from '../store/itinerary';
import { useTouristStore } from '../store/tourist';


function TouristViewItineraries() {
  const { tourist , setIsUpcoming , setIsPast} = useTouristStore(); 
    const [filter, setFilter] = useState({});
    const [curActivity, setCuritinrary] = useState(-1);
    const changeitinrary = (id) => ( setCuritinrary(id))
    const [applyPreferences, setApplyPreferences] = useState(false);
    const {itineraries, getItineraries} = useItineraryStore();
    const [visibillity, setVisibillity] = useState(false);
  const [sort, setSort] = useState({});
  
useEffect(() => {
  console.log(applyPreferences , tourist , tourist.myPreferences , tourist.myPreferences?.length > 0)
  if (applyPreferences && tourist && tourist.myPreferences && tourist.myPreferences.length > 0) {
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
  setIsUpcoming(false);
  setIsPast(false);
}, [applyPreferences, tourist]);

useEffect(() => {
    getItineraries(filter, sort);
}, [filter, sort]);



  
  const SortingList=["High to low","Low to High"];

   const handlePress = async () => {
    if(filter.name === "") delete filter.name;
    getItineraries(filter, sort);
    console.log(filter, sort);
    };

   const handleSort =  () => {
    setVisibillity((prev) => !prev);
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
        <input className='w-[15ch] m-2 pl-1' name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' type="number" value={filter.minPrice || ""} name={"bud"} placeholder='minBudget' onChange={(e) => setFilter({ ...filter, minPrice: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' type="number" value={filter.maxPrice || ""} name={"bud"} placeholder='maxBudget' onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={"date"} placeholder='Date' onChange={(e) => setFilter({ ...filter, availableDates: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={'pref'} placeholder='PreferenceTags' onChange={(e) => setFilter({ ...filter, preferenceTag: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={'lang'} placeholder='Language' onChange={(e) => setFilter({ ...filter, language: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <div className={` grid w-fit mx-auto`} >
        <div>
      <div className='mb-4 text-xl'>
            Available Itineraries
        </div>
        {
            itineraries.map((itinerary, index)=> (
                <TouristItineraryContainer key={index} itineraryChanger={changeitinrary} itinerary={itinerary}/>   
            ))
        }
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

export default TouristViewItineraries