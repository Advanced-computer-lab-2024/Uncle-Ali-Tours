import React from 'react'
import TagContainer from '../components/TagContainer.jsx'
function PreferenceTag() {
    const tags = ["tag1", "tag2"]

  return (
    <div>
        <div>Create New Tags</div>
        <div className='text-black'>
        <input name={"newTag"} placeholder='New Tag' onChange={(e) => setFilter({ ...filter, name: e.target.value})}></input>
        <button className='bg-black text-white m-6 p-2 rounded'>Add Tag</button>
        </div>
        {
            tags.map((tag, index)=> (
                <TagContainer key={index} tagName={tag}/>   
            ))
        }
        
        <div>
            Available Preference Tags
            
        </div>
    </div>
    
  )
}

export default PreferenceTag