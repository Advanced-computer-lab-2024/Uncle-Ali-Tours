import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ActivityCategoryContainer from '../components/ActivityCategoryContainer.jsx';
import Dialog from '../components/Dialog.jsx';
import FormDialog from '../components/FormDialog.jsx';
import { useActivityStore } from '../store/activity.js';

function ActivityCategory() {
    const [curCategory, setCurCategory] = useState('');
    const [newCategory, setNewCategory] = useState({
        name: '',
    });

    const { addCategory, deleteCategory, updateCategory, getCategories, categories } = useActivityStore();

    const del = async () => {
        const { success, message } = await deleteCategory(curCategory);
        success
            ? toast.success(message, { className: 'text-white bg-gray-800' })
            : toast.error(message, { className: 'text-white bg-gray-800' });
    };

    const changeCategory = (name) => {
        setCurCategory(name);
    };

    const updateCategoryHandler = async (updatedCategory) => {
        const { success, message } = await updateCategory(curCategory, updatedCategory.name);
        success
            ? toast.success(message, { className: 'text-white bg-gray-800' })
            : toast.error(message, { className: 'text-white bg-gray-800' });
    };

    const handleAddCategory = async () => {
        const { success, message } = await addCategory(newCategory.name);
        success
            ? toast.success(message, { className: 'text-white bg-gray-800' })
            : toast.error(message, { className: 'text-white bg-gray-800' });
    };

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    return (
        <div>
            <div className="mt-4 text-xl" onClick={() => console.log(curCategory)}>
                Create New Activity Category
            </div>
            <div className="text-black">
                <input
                    className="rounded"
                    name="newCategory"
                    placeholder="New Activity Category"
                    onChange={(e) => setNewCategory({ name: e.target.value })}
                />
                <button
                    className="bg-black text-white m-6 p-2 rounded-xl transform transition-transform duration-300 hover:scale-105"
                    onClick={handleAddCategory}
                >
                    Add Activity Category
                </button>
            </div>
            <div className="mb-4 text-xl">Available Activity Categories</div>
            {categories.map((activityCategory, index) => (
                <ActivityCategoryContainer key={index} categoryChanger={changeCategory} categoryName={activityCategory} />
            ))}
            <Dialog
                msg="Are you sure you want to delete this Activity Category?"
                accept={del}
                reject={() => console.log('rejected')}
                acceptButtonText="Delete"
                rejectButtonText="Cancel"
            />
            <FormDialog
                msg="Update values"
                accept={updateCategoryHandler}
                reject={() => console.log('rejected')}
                acceptButtonText="Update"
                rejectButtonText="Cancel"
                inputs={['name']}
            />
            
        </div>
    );
}

export default ActivityCategory;
