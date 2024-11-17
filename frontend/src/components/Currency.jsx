// CurrencySelector.js
import React from 'react';
import { useUserStore } from '../store/user.js';

// List of currencies and their rates to EGP (you can adjust based on your requirements)
const currencyOptions = [
    { label: 'Egyptian Pounds', value: 'EGP', rate: 1.0 },
    { label: 'US Dollars', value: 'USD', rate: 0.021 },  // Sample rate; replace with accurate values
    { label: 'EUR', value: 'EUR', rate: 0.019 },
    { label: 'Pond Sterling', value: 'GBP', rate: 0.016 }
];

function Currency() {
    const { user, setUser } = useUserStore();

    const handleCurrencyChange = (e) => {
        const selectedCurrency = e.target.value;
        const currencyData = currencyOptions.find(currency => currency.value === selectedCurrency);
        
        if (currencyData) {
            setUser({
                ...user,
                chosenCurrency: currencyData.value,
                currencyRate: currencyData.rate
            });
            // Update local storage to persist changes
            localStorage.setItem("user", JSON.stringify({
                ...user,
                chosenCurrency: currencyData.value,
                currencyRate: currencyData.rate
            }));
        }
        console.log(user);
    };

    return (
            <select
                id="currency-select"
                value={user.chosenCurrency}
                onChange={handleCurrencyChange}
                className="p-2 w-[7.6ch] rounded-full text-black bg-transparent hover:cursor-pointer focus:outline-none"
                
            >
                {currencyOptions.map((currency) => (
                    <option key={currency.value} value={currency.value} className='bg-black text-white'>
                        {currency.value}
                    </option>
                ))}
            </select>
    );
}

export default Currency;
