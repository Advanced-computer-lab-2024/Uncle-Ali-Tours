import {create} from 'zustand';

const addTourGuide = async (newUser) => {
    const res = await fetch("/api/tourGuides", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};

const addAdvertiser = async (newUser) => {
    const res = await fetch("/api/advertisers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};

const addSeller = async (newUser) => {
    const res = await fetch("/api/sellers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        const filter = {};
        if (searchTerm) {
            filter.name = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search
        }

        try {
            const response = await axios.get('/api/products', {
                params: {
                    filter: JSON.stringify(filter),
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);


};

export default ProductList;


export const useAttractionStore = create((set) => ({
    attractions: [],
    setAttractions: (attractions) => set({attractions}),
    getAttractions: async (filter) => {
        // const res = await fetch("/api/attractions", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({"filter": filter, "sort": {}}),
        // });
        // const body = await res.json();
        // if (!body.success){
        //     return (body)
        // }
        // set({attractions: body.data})
        // return {success: true, message: "fetched attractions"};
        set({attractions: [{filter}]})
    }
    }
));