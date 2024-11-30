import { create } from "zustand";

export const usePaymentStore = create((set, get) => ({
    items: [{
        itemData : {
            name : "",
            profilePicture : "",
            price : 0,
        },
        quantity : 1,
    }],
    currency : "",
    bookedHotel: null,

    // Setters
    setItems: (items) => set({ items }),
    setCurrency: (currency) => set({ currency }),
    setBookedHotel: (bookedHotel) => set({ bookedHotel }),

     // Function to set selected items for payment
    setSelectedItems: (selectedItems , type) => {
        console.log("selectedItems: ", selectedItems);
        switch(type){
        case('hotel'):
        console.log(" in hotel case ");
            set({ items: [{
                itemData: {
                    name: selectedItems.name,
                    price: selectedItems.data.price.total,
                },
                quantity: 1, // Default quantity, you can customize this as needed
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
                quantity: 1, // Default quantity, you can customize this as needed
            }] });
            break;
            default:
                console.log(" in default case ");
                const itemsArray = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
                const mappedItems = itemsArray.map(item => ({
                    itemData: item,
                    quantity: 1, // Default quantity, you can customize this as needed
                }));
                set({ items: mappedItems });
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
    createCheckoutSession: async (items , currencyRate, currency) => {
        try {
        const session = await fetch("/api/payment/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            items: items,
            currentCurrency: currency,
            currencyRate: currencyRate,
            }),
        });
        const body = await session.json();
        if (body.url) {
            window.location.href = body.url;
        }
        } catch (error) {
        console.error("Error creating checkout session:", error);
        }
    }

    }));