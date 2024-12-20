import React, { useState, useEffect } from "react";
import { useProductStore } from "../store/product";
import { useTouristStore } from "../store/tourist";
import ProductContainer from "../components/productContainer";
import Slider from "../components/Slider";
import Button from "../components/Button";
import { Select, SelectItem } from "../components/Select";
function ViewProducts() {
  const { tourist } = useTouristStore();
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { getProducts, products } = useProductStore();

  useEffect(() => {
    handlePress();
  }, []);

  const handlePress = async () => {
    await getProducts(
      {
        ...filter,
        Available_quantity: { $gt: 0 },
        price: { $gte: priceRange[0], $lte: priceRange[1] },
      },
      sort,
    );
  };
  const handleSort = (value) => {
    setSort({ [value]: value.includes("High") ? -1 : 1 });
    handlePress();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-white">
              Available Products
            </h1>
          </div>
          <div className="p-6 sm:p-10">
            <div className="flex shadow-md items-center w-fit mx-auto h-fit px-2 rounded-lg flex-wrap gap-4 mb-6">
              <input
                className="border h-[3ch] rounded-md p-2"
                name="name"
                placeholder="Name"
                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
              />
              <div className="w-full md:w-64">
								<div className="relative h-[100px] flex flex-col justify-end">
                <p className="mb-2">Price Range</p>
                <input
                  type="range"
										className="absolute top-0 scale-x-[-1] left-0"
                  min={products.reduce(
                    (acc, product) => Math.min(acc, product.price),
                    0,
                  )}
                  max={products.reduce(
                    (acc, product) => Math.max(acc, product.price),
                    1000,
                  )/2}
                  step={10}
                  value={products.reduce(
                    (acc, product) => Math.max(acc, product.price),
                    1000,
                  )/2 - priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([e.target.max - e.target.value, priceRange[1]])
                  }
                />
                <input
                  type="range"
										className="absolute top-0 left-0 translate-x-[90%]"
                  min={products.reduce(
                    (acc, product) => Math.max(acc, product.price),
                    1000,
                  )/2}
                  max={products.reduce(
                    (acc, product) => Math.max(acc, product.price),
                    1000,
                  )}
                  step={10}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], e.target.value])
                  }
                />
                <p className="mt-2">
                  ${priceRange[0]} - ${priceRange[1]}
                </p>
								</div>
              </div>
              <Select onValueChange={handleSort}>
                <option value="" disabled selected hidden>
                  Please Choose...
                </option>
                <SelectItem value="ratingHigh">Rating High to Low</SelectItem>
                <SelectItem value="ratingLow">Rating Low to High</SelectItem>
                <SelectItem value="priceHigh">Price High to Low</SelectItem>
                <SelectItem value="priceLow">Price Low to High</SelectItem>
              </Select>
              <Button onClick={handlePress}>Search</Button>
            </div>

            <div className="grid grid-cols-1 gap-6 container">
              {products.map(
                (product, index) =>
                  !product.archive && (
                    <ProductContainer
                      key={index}
                      tourist={tourist}
                      product={product}
                    />
                  ),
              )}
            </div>
          </div>
          </div>
          </div>
          </div>
  );
}

export default ViewProducts;