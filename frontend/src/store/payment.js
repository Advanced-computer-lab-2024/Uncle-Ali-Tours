import toast from 'react-hot-toast';
import { create } from "zustand";


export const usePaymentStore = create((set, get) => ({
    items: [{
        itemData : {
            name : "",
            profilePicture : "",
            price : 0,
        },
        itemDetails : {},
        quantity : 1,
    }],
    currency : "",
    bookedHotel: null,

    // orderDataProducts: [
    //         {
    //             productId: "",
    //             quantity: 1,
    //         },
    //     ],
    

    // Setters
    setItems: (items) => set({ items }),
    setCurrency: (currency) => set({ currency }),
    setBookedHotel: (bookedHotel) => set({ bookedHotel }),
    setOrderData: (orderData) => set({ orderData }),

     // Function to set selected items for payment
    setSelectedItems: (selectedItems , type , quantity) => {
        console.log("selectedItems: ", selectedItems);
        switch(type){
        case('hotel'):
        console.log(" in hotel case ");
            set({ items: [{
                itemData: {
                    name: selectedItems.name,
                    price: selectedItems.data.price.total,
                },
                itemDetails: selectedItems.data,
                quantity: 1,
            }] });
            console.log("items: ", get().items);
            break;
        case('flight'):
        console.log(" in flight case ");
            set({ items: [{
                itemData: {
                    name: 'Flight Ticket',
                    price: selectedItems.data.price.raw,
                },
                itemDetails: selectedItems.data,
                quantity: 1, // Default quantity, you can customize this as needed
            }] });
            break;
        case('product'):
        console.log(" in product case ");
            const productsArray = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
            const mappedProducts = productsArray.map(item => ({
                itemData: {
                    name: item.productId.name,
                    price: item.productId.price,
                },
                itemDetails: item.productId,
                quantity: item.quantity,
            }));
            set({ items: mappedProducts });
            break;
            default:
                console.log(" in default case ");
                const itemsArray = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
                const mappedItems = itemsArray.map(item => ({
                    itemData: {
                        name: item.name,
                        price: item.price,
                    },
                    itemDetails: item,
                    quantity: quantity,
                }));
                set({ items: mappedItems });

                // const mappedOrderProducts = itemsArray.map(item => ({
                //     productId: item._id,
                //     quantity: quantity,
                // }));
                // set({ orderDataProducts: mappedOrderProducts });
                break;
        }
        
    },

    setCurrency: (currency) => {
        switch (currency) {
            case 'USD':
                set({ currency: 'usd' });
                break;
            case 'EUR':
                set({ currency: 'eur' });
                break;
            case 'GBP':
                set({ currency: 'gbp' });
                break;
            case 'EGP':
                set({ currency: 'egp' });
                break;
            default:
                set({ currency: '' });
        }
    },


      // Create a checkout session
    createCheckoutSession: async (items , currencyRate, currency , type) => {
        try {
            // Store the items in session storage
        sessionStorage.setItem("paymentItems", JSON.stringify(items));

        const session = await fetch("/api/payment/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            items: items,
            currentCurrency: currency,
            currencyRate: currencyRate,
            type: type,
            }),
        });
        const body = await session.json();
        if (body.url) {
            window.location.href = body.url;
        }
        } catch (error) {
        console.error("Error creating checkout session:", error);
        }
    },

    handleSuccessfulPaymentForTourist: async (username, items, type) => {
        try {
            let amountPaid = 0;
            items.forEach(item => {
                amountPaid += (item.itemData.price*item.quantity);
            });
            console.log("Amount Paid:", amountPaid);

            const response =  await fetch(`/api/payment/handleSuccessfulPayment`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username,
                     items: items,
                      type: type,
                       amountPaid: amountPaid })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
                console.error("Error handling successful payment:", data.message);
            }
        } catch (error) {
            console.error("Error handling successful payment:", error);
            toast.error("Failed to handle successful payment.");
        }
    },

    CheckoutUsingWallet: async (items , username ,type) => {
        try {
            let amountPaid = 0;
            items.forEach(item => {
                amountPaid += (item.itemData.price*item.quantity);
            });
            console.log("Amount Paid:", amountPaid);
                 // Store the items in session storage
        sessionStorage.setItem("paymentItems", JSON.stringify(items));

            const response = await fetch(`/api/payment/checkoutUsingWallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, amountPaid , type })
            });
            const data = await response.json();
            console.log("data:", data);
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
                console.error("Error processing payment using wallet:", data.message);
            }
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error processing payment using wallet:", error);
            toast.error("Failed to process payment using wallet.");
        }
    }

    }));