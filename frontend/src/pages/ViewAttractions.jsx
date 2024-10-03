import React from 'react'
import { useState } from 'react'
import { useAttractionStore } from '../store/attraction';
function ViewAttractions() {
    const [filter, setFilter] = useState(
        {}
    );
    const {attractions, getAttractions} = useAttractionStore();
    
   const handlePress = async () => {
    await getAttractions(filter , sort);
   };
  return (
    <div>
        <input className= 'w-[15ch] m-2 pl-1' name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className= 'w-[15ch] m-2 pl-1' name={'tag'} placeholder='Tag' onChange={(e) => setFilter({ ...filter, tag: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <button className="text-white" onClick={() => (console.log(attractions))}>ss</button>
        {attractions.map((attraction, index) => 
        (
          <p key={index}>
            {attraction.filter.name || "ss"}
          </p>
        )
        )}
        </div>
  )
}

export default ViewAttractions