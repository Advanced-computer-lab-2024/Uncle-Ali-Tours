import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ActivityCategoryContainer from '../components/ActivityCategoryContainer.jsx';
import Dialog from '../components/Dialog.jsx';
import FormDialog from '../components/FormDialog.jsx';
import { useActivityStore } from '../store/activity.js';
import { motion } from 'framer-motion';

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
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(../images/egypt.jpg)' }}>
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-3xl z-10"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Activity Categories</h2>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Create New Activity Category</h3>
                    <div className="flex items-center gap-4">
                        <input
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            name="newCategory"
                            placeholder="New Activity Category"
                            onChange={(e) => setNewCategory({ name: e.target.value })}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors"
                            onClick={handleAddCategory}
                        >
                            Add Category
                        </motion.button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Available Activity Categories</h3>
                    <div className="space-y-4">
                        {categories.map((activityCategory, index) => (
                            <ActivityCategoryContainer key={index} categoryChanger={changeCategory} categoryName={activityCategory} />
                        ))}
                    </div>
                </div>

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
            </motion.div>

            <footer className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-2 text-sm">
                <p>© {new Date().getFullYear()} U A T. All rights reserved.</p>
            </footer>

             position="top-right" />
        </div>
    );
}

export default ActivityCategory;
