import React from 'react'
import { useState, useEffect } from 'react';
import { useActivityStore } from '../store/activity';
function ViewActivities() {
    const [filter, setFilter] = useState(
        {}
    );

    useEffect(() => {
        getCategories()
      });

    const {activities, getActivities, categories, getCategories} = useActivityStore();
    
   const handlePress = async () => {
    await getActivities(filter);
   };


   return (
    <div className='text-black'>
        <input className='w-[15ch] m-2 pl-1' name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' name={"cat"} placeholder='Category' onChange={(e) => setFilter({ ...filter, cat: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' name={'tag'} placeholder='Tag' onChange={(e) => setFilter({ ...filter, tag: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={"bud"} placeholder='minBudget' onChange={(e) => setFilter({ ...filter, bud: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={"bud"} placeholder='maxBudget' onChange={(e) => setFilter({ ...filter, bud: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' name={"date"} placeholder='Date' onChange={(e) => setFilter({ ...filter, date: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1 'name={'ratings'} placeholder='Ratings' onChange={(e) => setFilter({ ...filter, ratings: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <button className="text-white" onClick={() => (console.log(categories))}>ss</button>
        {activities.map((activity, index) => 
        (
          <p key={index}>
            {activity.filter.name || "ss"}
          </p>
        )
        )}
        </div>
  )
}

export default ViewActivities