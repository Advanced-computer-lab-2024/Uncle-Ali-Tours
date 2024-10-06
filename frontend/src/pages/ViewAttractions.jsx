import React from 'react'
import { useState } from 'react'
import { useAttractionStore } from '../store/attraction';
import AttractionContainer from '../components/AttractionContainer.jsx';
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
function ViewAttractions() {
    const [filter, setFilter] = useState(
        {}
    );
    const {attractions, getAttractions} = useAttractionStore();
    
   const handlePress = async () => {
    await getAttractions(filter);
   };
  return (
    <div className='text-black'>
        <input className= 'w-[15ch] m-2 pl-1' name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className= 'w-[15ch] m-2 pl-1' name={'tag'} placeholder='Tag' onChange={(e) => setFilter({ ...filter, tag: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <div className={` grid w-fit mx-auto`} >
        <div>
      <div className='mb-4 text-xl'>
            Available Attractions   
        </div>
        {
            attractions.map((attraction, index)=> (
                <AttractionContainer key={index}  attraction={attraction}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name","value"]}/>
   
    
    </div>
       </div>
        </div>
  )
}

export default ViewAttractions