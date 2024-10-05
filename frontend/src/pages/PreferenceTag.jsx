import React from 'react'
import TagContainer from '../components/TagContainer.jsx'
import { useState, useEffect } from 'react'
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
import toast, { Toaster } from 'react-hot-toast';
import { useTagStore } from '../store/tag.js'
function PreferenceTag() {
    const [curTag, setCurTag] = useState("");
    const [newTag, setNewTag] = useState({
        name: "",
    });
    
    const {tags, addTag, getTags, deleteTag, updateTag} = useTagStore();

    useEffect(() => {
        getTags()
    }, [])

    const del = async () => {
        const {success, message} = await deleteTag(curTag)
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

}

    const changeTag = (name) => {
        setCurTag(name)

    }

    const handleUpdate = async (updatedTag) => {
        const {success, message} = await updateTag(curTag, updatedTag)
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    }


    const handleAddTag = async() => {
        console.log(newTag.name)
        const {success, message} = await addTag(newTag);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    }

  return (
    <div>
        <div className='mt-4 text-xl'>Create New Tag</div>
        <div className='text-black'>
        <input className='rounded' name={"newTag"} placeholder='New Tag' onChange={(e) => setNewTag({ name: e.target.value})}/>
        <button className='bg-black text-white m-6 p-2 rounded-xl transform transition-transform duration-300 hover:scale-105' onClick={()=>(handleAddTag())}>Add Tag</button>
        </div>
        <div className='mb-4 text-xl'>
            Available Preference Tags   
        </div>
        {
            tags.map((tag, index)=> (
                <TagContainer key={index} tagChanger={changeTag} tagName={tag.name}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this preference tag?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={handleUpdate} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name"]}/>
        <Toaster/>
    </div>
    
  )
}

export default PreferenceTag