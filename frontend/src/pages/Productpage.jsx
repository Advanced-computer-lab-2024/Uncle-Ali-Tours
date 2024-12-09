import React, { useState, useEffect } from "react";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard.jsx";
import Dialog from "../components/Dialog.jsx";
import FormDialog from "../components/FormDialog.jsx";
import CreateForm, { createForm } from "../components/CreateForm.jsx";
import toast from "react-hot-toast";
import { formdialog } from "../components/FormDialog.jsx";
import { useUserStore } from "../store/user";

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

  useEffect(() => {
    const fetchProducts = async () => {
      if (user.type === "seller") {
        await getProducts({ ...filter, creator: user.userName }, sort);
      } else {
        await getProducts(filter, sort);
      }
    };
    fetchProducts();
  }, [filter, sort, user]);

  const productChanger = (product) => setCurrentProduct(product);

  const handlePress = async () => {
    if (user.type === "seller") {
      await getProducts({ ...filter, creator: user.userName }, sort);
    } else {
      await getProducts(filter, sort);
    }
  };

  const handleSort = () => setSortVisibility((prev) => !prev);
  const handleFilter = () => setFilterVisibility((prev) => !prev);

  const del = async () => {
    const { success, message } = await deleteProduct(currentProduct._id);
    success ? toast.success(message) : toast.error(message);
  };

  const handleUpdate = async (updatedProduct) => {
    const { success, message } = await updateProduct(currentProduct._id, updatedProduct);
    success ? toast.success(message) : toast.error(message);
  };

  const handleCreateProduct = async (newProduct) => {
    const { success, message } = await createProduct({ ...newProduct, creator: user.userName });
    success ? toast.success(message) : toast.error(message);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    handlePress();
  };

  const handleFilterChange = (priceRange) => {
    setFilter((prev) => ({ ...prev, price: priceRange }));
    handlePress();
  };

  return (
    <div className='text-black'>
      
      <input
        className='w-[15ch] m-2 pl-1'
        name="name"
        placeholder='Name'
        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
      />
      
      <button className='p-2 bg-black text-white' onClick={handlePress}>Search</button>
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#C1BAA1", minHeight: "100vh", color: "#333", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "4rem", fontWeight: "bold", color: "#333", marginBottom: "2rem" }}>
        Manage Your Products
      </h1>

      {/* Centered Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <input
          style={{
            width: "250px",
            padding: "0.75rem",
            border: "2px solid #dc5809",
            borderRadius: "30px",
            fontSize: "1rem",
            outline: "none",
          }}
          name="name"
          placeholder="Search by Name"
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#dc5809",
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onClick={handlePress}
        >
          Search
        </button>
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#dc5809",
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onClick={showCreateFormDialog}
        >
          Create Product
        </button>
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#dc5809",
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onClick={handleFilter}
        >
          Filter by Price
        </button>
      </div>

      {/* Sort Controls */}
      {sortVisibility && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button onClick={() => handleSortChange({ rating: -1 })} className="p-2 m-2 bg-gray-300 rounded">Rating High to Low</button>
          <button onClick={() => handleSortChange({ rating: 1 })} className="p-2 m-2 bg-gray-300 rounded">Rating Low to High</button>
          <button onClick={() => handleSortChange({ price: -1 })} className="p-2 m-2 bg-gray-300 rounded">Price High to Low</button>
          <button onClick={() => handleSortChange({ price: 1 })} className="p-2 m-2 bg-gray-300 rounded">Price Low to High</button>
        </div>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} productChanger={productChanger} product={product} />
        ))}
      </div>

      {/* Dialogs */}
      <Dialog msg="Are you sure you want to delete this product?" accept={del} reject={() => {}} acceptButtonText="Delete" rejectButtonText="Cancel" />
      <FormDialog msg="Update values" accept={handleUpdate} reject={() => {}} acceptButtonText="Update" rejectButtonText="Cancel" inputs={["name", "imgURL", "price", "description", "Available_quantity"]} />
      <CreateForm msg="Create Product" accept={handleCreateProduct} reject={() => {}} acceptButtonText="Create" rejectButtonText="Cancel" inputs={["name", "imgURL", "price", "description", "Available_quantity"]} />
    </div>
    </div>

  );

}

export default ViewProducts;
