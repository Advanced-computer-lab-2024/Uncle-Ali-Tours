import React, { useState, useEffect } from 'react';
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard.jsx';

import Dialog from '../components/Dialog.jsx';
import FormDialog from '../components/FormDialog.jsx';
import CreateForm, { createForm } from '../components/CreateForm.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { formdialog } from '../components/FormDialog.jsx';
import { useUserStore } from '../store/user';

function ViewProducts() {
  const [currentProduct, setCurrentProduct] = useState({});
  const [filter, setFilter] = useState({});
  const { user } = useUserStore();
  const [sort, setSort] = useState({});
  const [sortVisibility, setSortVisibility] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState(false);
  const { showFormDialog } = formdialog();
  const { showCreateFormDialog } = createForm();

  const { getProducts, products, createProduct, deleteProduct, updateProduct } = useProductStore();

  const productChanger = (product) => {
    setCurrentProduct(product);
  };

  // Fetch products whenever filter, sort, or user changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (user.type === 'seller') {
        await getProducts({ ...filter, creator: user.userName }, sort);
      } else {
        await getProducts(filter, sort);
      }
    };
    fetchProducts();
  }, [filter, sort, user]);

  const handlePress = async () => {
    if (user.type === 'seller') {
      await getProducts({ ...filter, creator: user.userName }, sort);
    } else {
      await getProducts(filter, sort);
    }
  };

  const handleSort = () => {
    setSortVisibility((prev) => !prev);
  };

  const handleFilter = () => {
    setFilterVisibility((prev) => !prev);
  };

  

  const del = async () => {
    const { success, message } = await deleteProduct(currentProduct._id);
    success ? toast.success(message, { className: 'text-white bg-gray-800' }) : toast.error(message, { className: 'text-white bg-gray-800' });
  };

  const handleUpdate = async (updatedProduct) => {
    const { success, message } = await updateProduct(currentProduct._id, updatedProduct);
    success ? toast.success(message, { className: 'text-white bg-gray-800' }) : toast.error(message, { className: 'text-white bg-gray-800' });
  };

  const handleCreateProduct = async (newProduct) => {
    const { success, message } = await createProduct({ ...newProduct, creator: user.userName });
    success ? toast.success(message, { className: 'text-white bg-gray-800' }) : toast.error(message, { className: 'text-white bg-gray-800' });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    handlePress(); // Re-fetch products with the new sort criteria
  };

  const handleFilterChange = (priceRange) => {
    setFilter((prev) => ({ ...prev, price: priceRange }));
    handlePress(); // Re-fetch products with the new filter criteria
  };

  return (
    <div className='text-black'>
      <Toaster />
      <input
        className='w-[15ch] m-2 pl-1'
        name="name"
        placeholder='Name'
        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
      />
      <button className='p-2 bg-black text-white' onClick={handlePress}>Search</button>

      <div className='grid w-fit mx-auto'>
        <button className='p-2 bg-black text-white' onClick={showCreateFormDialog}>Create Product</button>
        <div>
          <div className='mb-4 text-xl'>Available Products</div>
          {products.map((product, index) => (
            <ProductCard key={index} productChanger={productChanger} product={product} />
          ))}
          <Dialog
            msg="Are you sure you want to delete this product?"
            accept={del}
            reject={() => console.log('rejected')}
            acceptButtonText='Delete'
            rejectButtonText='Cancel'
          />
          <FormDialog
            msg="Update values"
            accept={handleUpdate}
            reject={() => console.log('DD')}
            acceptButtonText='Update'
            rejectButtonText='Cancel'
            inputs={['name', 'imgURL', 'price', 'description', 'Available_quantity']}
          />
        </div>
      </div>

      <div>
        <button onClick={handleSort}>{Object.keys(sort)[0] ? `Sorted by ${Object.keys(sort)[0]}` : 'Sort'}</button>
        <br></br>
        <button onClick={handleFilter}>Filter by Price</button>
        <br />
        
        <CreateForm
          msg="Created"
          accept={handleCreateProduct}
          reject={() => console.log('DD')}
          acceptButtonText='Create'
          rejectButtonText='Cancel'
          inputs={['name', 'imgURL', 'price', 'description', 'Available_quantity']}
        />

        <div className={`${sortVisibility ? '' : 'hidden'}`}>
          <div><button onClick={() => handleSortChange({ 'rating': -1 })}>Rating High to Low</button></div>
          <div><button onClick={() => handleSortChange({ 'rating': 1 })}>Rating Low to High</button></div>
          <div><button onClick={() => handleSortChange({ 'price': -1 })}>Price High to Low</button></div>
          <div><button onClick={() => handleSortChange({ 'price': 1 })}>Price Low to High</button></div>
        </div>


<br></br>
        <div className={`${filterVisibility ? '' : 'hidden'}`}>
          <div><button onClick={() => handleFilterChange({ $lte: 50 })}>Under $50</button></div>
          <div><button onClick={() => handleFilterChange({ $gte: 50, $lte: 100 })}>$50 - $100</button></div>
          <div><button onClick={() => handleFilterChange({ $gte: 100, $lte: 200 })}>$100 - $200</button></div>
          <div><button onClick={() => handleFilterChange({ $gte: 200 })}>Above $200</button></div>
        </div>
      </div>
    </div>
  );
}

export default ViewProducts;
