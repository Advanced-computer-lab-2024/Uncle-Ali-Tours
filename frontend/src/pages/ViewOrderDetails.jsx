import React, { useEffect } from "react";
import { useOrderStore } from "../store/order";
import { useParams, useNavigate } from "react-router-dom";
import ProductContainerForSeller from "../components/ProductContainerForSeller";
import { FiLoader } from "react-icons/fi";

function ViewOrderDetails() {
  const { orders, getOrderById } = useOrderStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
    } else {
      getOrderById(id); // Fetch the specific order by ID
    }
  }, [id, getOrderById, navigate]);

  if (!orders[0]) {
    return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-b shadow-xl relative from-[#C1BAA1] min-h-[60vh] w-full mx-auto rounded-lg p-6">
        <h1 className="justify-center text-2xl">Order Details</h1>
        <br />
        <div className="mt-24">
          {orders[0].products && orders[0].products.length > 0 ? (
            orders[0].products.map((productItem) => (
              <ProductContainerForSeller
                key={productItem._id}
                product={productItem.productId} // Pass the entire product object
              />
            ))
          ) : (
            <p className="text-center text-xl text-white">No products found in this order.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewOrderDetails;
