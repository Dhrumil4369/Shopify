import React from "react";
import Img1 from "../../assets/women/women.png";
import Img2 from "../../assets/women/women2.jpg";
import Img3 from "../../assets/women/women3.jpg";
import Img4 from "../../assets/women/women4.jpg";
import { FaStar } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Women Ethnic",
    rating: 5.0,
    color: "White",
    price: 1299,
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Women Western",
    rating: 4.5,
    color: "Red",
    price: 1599,
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Goggles",
    rating: 4.7,
    color: "Brown",
    price: 799,
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Printed T-Shirt",
    rating: 4.4,
    color: "Yellow",
    price: 999,
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img2,
    title: "Fashion T-Shirt",
    rating: 4.5,
    color: "Pink",
    price: 1199,
    aosDelay: "800",
  },
];

const Products = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">

        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Products for you
          </p>

          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Products
          </h1>

          <p data-aos="fade-up" className="text-sm text-gray-500 mt-2">
            Discover our curated collection of premium products
          </p>
        </div>
        
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 place-items-center">

            {/* card section */}
            {ProductsData.map((data) => (
              <div data-aos="fade-up" data-aos-delay={data.aosDelay} key={data.id} className="space-y-4 bg-white dark:bg-gray-800 
                p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img src={data.img} alt={data.title} className="h-[220px] w-full object-cover rounded-md"/>

                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg dark:text-white">{data.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Color: {data.color}</p>
                  <p className="text-green-600 font-bold dark:text-green-400">₹{data.price}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium dark:text-white">{data.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">(120 reviews)</span>
                  </div>

                  <button onClick={() => handleAddToCart(data)} className="w-full bg-gradient-to-r from-primary to-secondary 
                    text-white py-2 rounded-md hover:scale-105 duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* view all button */}
          <div className="flex justify-center mt-12">
            <button className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-8 rounded-full hover:scale-105 
              transition-transform duration-300 font-medium">
              View All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;