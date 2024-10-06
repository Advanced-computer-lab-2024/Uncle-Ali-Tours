import React, { useState } from 'react';
import { useUserStore } from '../store/user';

const AdminDashboard = () => {
  const { deleteUser } = useUserStore();
  const [tourismGovernorUsername, setTourismGovernorUsername] = useState('');
  const [tourismGovernorPassword, setTourismGovernorPassword] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [accountId, setAccountId] = useState('');
  const [activityCategories, setActivityCategories] = useState([]);
  const [preferenceTags, setPreferenceTags] = useState([]);
  const [newActivityCategory, setNewActivityCategory] = useState('');
  const [newPreferenceTag, setNewPreferenceTag] = useState('');
  const [editingActivityCategory, setEditingActivityCategory] = useState(null);
  const [editingPreferenceTag, setEditingPreferenceTag] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: '', price: '', quantity: '' });

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      await deleteUser(accountId); // Delete the specific account
      setAccountId(''); // Clear the input field after deletion
    }
  };

  const handleAddTourismGovernor = async () => {
    console.log('Adding tourism governor:', tourismGovernorUsername, tourismGovernorPassword);
    setTourismGovernorUsername('');
    setTourismGovernorPassword('');
  };

  const handleAddNewAdmin = async () => {
    console.log('Adding new admin:', newAdminUsername, newAdminPassword);
    setNewAdminUsername('');
    setNewAdminPassword('');
  };

  const handleCreateActivityCategory = async () => {
    console.log('Creating activity category:', newActivityCategory);
    setActivityCategories([...activityCategories, newActivityCategory]);
    setNewActivityCategory('');
  };

  const handleCreatePreferenceTag = async () => {
    console.log('Creating preference tag:', newPreferenceTag);
    setPreferenceTags([...preferenceTags, newPreferenceTag]);
    setNewPreferenceTag('');
  };

  const handleUpdateActivityCategory = async () => {
    console.log('Updating activity category:', editingActivityCategory);
    const updatedActivityCategories = activityCategories.map((category, index) => {
      if (index === editingActivityCategory.index) {
        return editingActivityCategory.newValue;
      }
      return category;
    });
    setActivityCategories(updatedActivityCategories);
    setEditingActivityCategory(null);
  };

  const handleUpdatePreferenceTag = async () => {
    console.log('Updating preference tag:', editingPreferenceTag);
    const updatedPreferenceTags = preferenceTags.map((tag, index) => {
      if (index === editingPreferenceTag.index) {
        return editingPreferenceTag.newValue;
      }
      return tag;
    });
    setPreferenceTags(updatedPreferenceTags);
    setEditingPreferenceTag(null);
  };

  const handleDeleteActivityCategory = async (category) => {
    console.log('Deleting activity category:', category);
    const updatedActivityCategories = activityCategories.filter((cat) => cat !== category);
    setActivityCategories(updatedActivityCategories);
  };

  const handleDeletePreferenceTag = async (tag) => {
    console.log('Deleting preference tag:', tag);
    const updatedPreferenceTags = preferenceTags.filter((t) => t !== tag);
    setPreferenceTags(updatedPreferenceTags);
  };

  const handleAddProduct = async () => {
    console.log('Adding product:', newProduct, newProductPrice, newProductQuantity);
    setProducts([...products, { name: newProduct, price: newProductPrice, quantity: newProductQuantity }]);
    setNewProduct('');
    setNewProductPrice('');
    setNewProductQuantity('');
  };

  const handleUpdateProduct = async () => {
    console.log('Updating product:', editingProduct);
    const updatedProducts = products.map((p) => {
      if (p.name === editingProduct.name) {
        return editedProduct; // Use the updated product
      }
      return p;
    });
    setProducts(updatedProducts);
    setEditingProduct(null); // Exit edit mode
  };

  const handleDeleteProduct = async (product) => {
    console.log('Deleting product:', product);
    const updatedProducts = products.filter((p) => p.name !== product.name);
    setProducts(updatedProducts);
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex flex-wrap justify-center mb-4">
        {/* Delete Account Section */}
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
          <input 
            type="text" 
            value={accountId} 
            onChange={(e) => setAccountId(e.target.value)} 
            placeholder="Enter Account ID" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300" 
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>

        {/* Add Tourism Governor */}
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Add Tourism Governor</h2>
          <input 
            type="text" 
            value={tourismGovernorUsername} 
            onChange={(e) => setTourismGovernorUsername(e.target.value)} 
            placeholder="Username" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <input 
            type="password" 
            value={tourismGovernorPassword} 
            onChange={(e) => setTourismGovernorPassword(e.target.value)} 
            placeholder="Password" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300" 
            onClick={handleAddTourismGovernor}
          >
            Add Tourism Governor
          </button>
        </div>

        {/* Add New Admin */}
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>
          <input 
            type="text" 
            value={newAdminUsername} 
            onChange={(e) => setNewAdminUsername(e.target.value)} 
            placeholder="Username" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <input 
            type="password" 
            value={newAdminPassword} 
            onChange={(e) => setNewAdminPassword(e.target.value)} 
            placeholder="Password" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300" 
            onClick={handleAddNewAdmin}
          >
            Add New Admin
          </button>
        </div>
      </div>

      {/* Activity Categories */}
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Activity Categories</h2>
          <input 
            type="text" 
            value={newActivityCategory} 
            onChange={(e) => setNewActivityCategory(e.target.value)} 
            placeholder="New Activity Category" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300" 
            onClick={handleCreateActivityCategory}
          >
            Create Activity Category
          </button>
          <ul>
            {activityCategories.map((category, index) => (
              <li key={index}>
                {editingActivityCategory?.index === index ? (
                  <>
                    <input
                      type="text"
                      value={editingActivityCategory.newValue}
                      onChange={(e) =>
                        setEditingActivityCategory({ ...editingActivityCategory, newValue: e.target.value })
                      }
                      placeholder="Edit Activity Category"
                      className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
                    />
                    <button
                      className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                      onClick={handleUpdateActivityCategory}
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <>
                    {category}
                    <button
                      className="px-5 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                      onClick={() =>
                        setEditingActivityCategory({ index, oldValue: category, newValue: category })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => handleDeleteActivityCategory(category)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preference Tags */}
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Preference Tags</h2>
          <input 
            type="text" 
            value={newPreferenceTag} 
            onChange={(e) => setNewPreferenceTag(e.target.value)} 
            placeholder="New Preference Tag" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300" 
            onClick={handleCreatePreferenceTag}
          >
            Create Preference Tag
          </button>
          <ul>
            {preferenceTags.map((tag, index) => (
              <li key={index}>
                {editingPreferenceTag?.index === index ? (
                  <>
                    <input
                      type="text"
                      value={editingPreferenceTag.newValue}
                      onChange={(e) =>
                        setEditingPreferenceTag({ ...editingPreferenceTag, newValue: e.target.value })
                      }
                      placeholder="Edit Preference Tag"
                      className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
                    />
                    <button
                      className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                      onClick={handleUpdatePreferenceTag}
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <>
                    {tag}
                    <button
                      className="px-5 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                      onClick={() => setEditingPreferenceTag({ index, oldValue: tag, newValue: tag })}
                    >
                      Edit
                    </button>
                    <button
                      className="px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => handleDeletePreferenceTag(tag)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Products */}
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <input 
            type="text" 
            value={newProduct} 
            onChange={(e) => setNewProduct(e.target.value)} 
            placeholder="New Product Name" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <input 
            type="text" 
            value={newProductPrice} 
            onChange={(e) => setNewProductPrice(e.target.value)} 
            placeholder="Price" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <input 
            type="text" 
            value={newProductQuantity} 
            onChange={(e) => setNewProductQuantity(e.target.value)} 
            placeholder="Quantity" 
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300" 
            onClick={handleAddProduct}
          >
            Add Product
          </button>
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                {editingProduct?.name === product.name ? (
                  <>
                    <input
                      type="text"
                      value={editedProduct.name}
                      onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                      placeholder="Edit Product Name"
                      className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
                    />
                    <input
                      type="text"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                      placeholder="Edit Price"
                      className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
                    />
                    <input
                      type="text"
                      value={editedProduct.quantity}
                      onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
                      placeholder="Edit Quantity"
                      className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
                    />
                    <button
                      className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                      onClick={handleUpdateProduct}
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <>
                    {product.name} - ${product.price} - Qty: {product.quantity}
                    <button
                      className="px-5 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                      onClick={() => {
                        setEditingProduct(product);
                        setEditedProduct(product); // Initialize editing values
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
