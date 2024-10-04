import React from 'react'
import { useState, useEffect } from 'react';
import { useActivityStore } from '../store/activity';
function ViewActivities() {
    const [filter, setFilter] = useState(
        {}
    );
    const [visibillity, setVisibillity] = useState(
      false
  );
  const [sort, setSort] = useState(
    {}
);
    useEffect( () => {
        getCategories()
      });

    const {activities, getActivities, categories, getCategories} = useActivityStore();
   const handlePress = async () => {
    await getActivities(filter, sort);
   };
   const handleSort = async () => {
     setVisibillity((prev) => !prev);
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
        <div><button onClick={() => (handleSort())}>sort</button>
        <div className={`${visibillity ? '' : 'hidden' }`} >
          <button onClick={()=>(setSort({'price' : -1}))}>{"Price High to Low"}</button>
          <button onClick={()=>(setSort({'price' : 1}))}>{"Price Low to High"}</button>
          <button onClick={()=>(setSort({'rating' : -1}))}>{"Ratings High to Low"}</button>
          <button onClick={()=>(setSort({'rating' : 1}))}>{"Ratings Low to High"}</button>
       </div>
       <button className='p-2 bg-black text-white' onClick={() => (console.log(activities))}>show</button>
        </div>
        </div>
  )
}

export default ViewActivities