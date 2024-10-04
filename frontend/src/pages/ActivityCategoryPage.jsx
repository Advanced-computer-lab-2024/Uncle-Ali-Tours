import React from 'react'
import { useState, useEffect } from 'react'
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
import toast, { Toaster } from 'react-hot-toast';
import ActivityCategoryContainer from '../components/ActivityCategoryContainer.jsx'
import { useActivityStore } from '../store/activity.js';
function ActivityCategoryPage() {
    const [curCategory, setCurCategory] = useState("");
    const [newCategory, setNewCategory] = useState({
        name: "",
    });
    
    const del = async () => 
    {
        const {success, message} = await deleteActivityCategory(curCategory);
         success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    }

    const changeCategory = async(name) => {
        setCurCategory(name)
        
    }
    const updateCategory = async(updatedCategory) => {
        console.log(updatedCategory)
        const {success, message} = await updateActivityCategory(curCategory,updatedCategory);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}
    
    const {createActivityCategory, deleteActivityCategory,updateActivityCategory ,getCategories, categories} = useActivityStore();
    const handleAddCategory = async() => {
        console.log(newCategory.name)
         const {success, message} = await createActivityCategory(newCategory);
         success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    }
    useEffect( () => {
        getCategories()
      });

  return (
    <div>
        <div className='mt-4 text-xl' onClick={() => (console.log(curCategory))}>Create New ActivityCategory</div>
        <div className='text-black'>
        <input className='rounded' name={"newCategory"} placeholder='New ActivityCategory' onChange={(e) => setNewCategory({ name: e.target.value})}></input>
        <button className='bg-black text-white m-6 p-2 rounded-xl transform transition-transform duration-300 hover:scale-105' onClick={()=>(handleAddCategory())}>Add ActivityCategory</button>
        </div>
        <div className='mb-4 text-xl'>
            Available Activity Categories   
        </div>
        {
            categories.map((activityCategory, index)=> (
                <ActivityCategoryContainer key={index} categoryChanger={changeCategory} categoryName={activityCategory}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this Activity Category?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={updateCategory} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name"]}/>
        <Toaster/>
    </div>
    
  )
}

export default ActivityCategoryPage