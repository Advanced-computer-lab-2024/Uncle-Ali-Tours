import React from 'react'
import { useState } from 'react';
import { useItineraryStore } from '../store/itinerary';
import ItineraryContainer from '../components/ItineraryContainer';
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
import PreferenceTag from './PreferenceTag.jsx';

function ViewItineraries() {
    const [filter, setFilter] = useState(
        {}
    );
    const [curActivity, setCuritinrary] = useState(-1);
    const changeitinrary = (id) => (
      setCuritinrary(id)
    )
    const {itineraries, getItineraries} = useItineraryStore();
    const [visibillity, setVisibillity] = useState(
      false
  );
  const [sort, setSort] = useState(
    {}
);
  
  const SortingList=["High to low","Low to High"];
   const handlePress = async () => {
    await getItineraries(filter , sort);
    setFilter({});
    console.log(filter);
   };
   const handleSort =  () => {
    setVisibillity((prev) => !prev);
   };
   return (
    <div className='text-black'>
        <input className='w-[15ch] m-2 pl-1'  name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' value={filter.minPrice || ""} name={"bud"} placeholder='minBudget' onChange={(e) => setFilter({ ...filter, minPrice: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' value={filter.maxPrice || ""} name={"bud"} placeholder='maxBudget' onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value})}/>
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
                <ItineraryContainer key={index} itineraryChanger={changeitinrary} itinerary={itinerary}/>   
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

export default ViewItineraries