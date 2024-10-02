import React from 'react'
import { useState } from 'react'
import { useAttractionStore } from '../store/attraction';
function ViewAttractions() {
    const [filter, setFilter] = useState(
        {}
    );
    const {attractions, getAttractions} = useAttractionStore();
    
   const handlePress = async () => {
    await getAttractions(filter);
   };
  return (
    <div>
        <input name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input name={"cat"} placeholder='Category' onChange={(e) => setFilter({ ...filter, cat: e.target.value})}/>
        <input name={'tag'} placeholder='Tag' onChange={(e) => setFilter({ ...filter, tag: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <button onClick={() => (console.log(attractions))}>ss</button>
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