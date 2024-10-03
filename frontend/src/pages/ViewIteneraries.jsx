import React from 'react'
import { useState } from 'react';
import { useIteneraryStore } from '../store/itenerary';

function ViewIteneraries() {
    const [filter, setFilter] = useState(
        {}
    );
    const {iteneraries, getIteneraries} = useIteneraryStore();
    
   const handlePress = async () => {
    await getIteneraries(filter);
   };
   return (
    <div className='text-black'>
        <input className='w-[15ch] m-2 pl-1'  name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={'tag'} placeholder='Tag' onChange={(e) => setFilter({ ...filter, tag: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={"bud"} placeholder='minBudget' onChange={(e) => setFilter({ ...filter, bud: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={"bud"} placeholder='maxBudget' onChange={(e) => setFilter({ ...filter, bud: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={"date"} placeholder='Date' onChange={(e) => setFilter({ ...filter, date: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={'pref'} placeholder='Preference' onChange={(e) => setFilter({ ...filter, pref: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1'  name={'lang'} placeholder='Language' onChange={(e) => setFilter({ ...filter, lang: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <button className="text-white" onClick={() => (console.log(iteneraries))}>ss</button>
        {iteneraries.map((itenerary, index) => 
        (
          <p key={index}>
            {itenerary.filter.name || "ss"}
          </p>
        )
        )}
        </div>
  )
}

export default ViewIteneraries