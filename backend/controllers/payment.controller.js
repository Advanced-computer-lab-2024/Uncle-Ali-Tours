import Activity from '../models/activity.model.js';
import Itinerary from '../models/itinerary.model.js';
import Product from '../models/product.model.js';
import Tourist from '../models/tourist.model.js';
import TransportationActivity from '../models/transportationActivity.model.js';
import { sendEmail } from "../util/email.js";
import { createFlightBooking } from './flightBooking.controller.js';
import { createHotelBooking } from './hotelBooking.controller.js';
const { EMAIL } = process.env;

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {
    try{
        const { items , currentCurrency , currencyRate , type } = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: items.map(item => {
                return {
                    price_data: {
                        currency: currentCurrency,
                        product_data: {
                            name: item.itemData.name,
                            images: [item.itemData.profilePicture],
                        },
                        unit_amount: (item.itemData.price * currencyRate).toFixed(2) * 100,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `http://localhost:5000/success/${type}`,
            cancel_url: `http://localhost:5000/cancel/${type}`,
        });
        res.json({ url : session.url });
    }
    catch(error){
        res.status(500).json({ message: error.message });
        console.log(error.message);
    }
}

// checkout using tourist wallet
export const CheckoutUsingWallet = async (req, res) => {
    try {
        const { username, amountPaid , type } = req.body;
        console.log("before checking fields","username:",username,"amount:" ,amountPaid);
      // Validate request body
        if (!username || !amountPaid) {
        return res.status(400).json({ message: "Missing required fields." });
        }

      // Find the tourist by username
        const tourist = await Tourist.findOne({ userName: username });
        if (!tourist) {
        return res.status(404).json({ message: "Tourist not found." });
        }
if(tourist.myWallet < amountPaid){
    return res.status(400).json({ message: "Insufficient funds in wallet." , url : `http://localhost:5000/cancel/${type}` });
}
console.log("before updating wallet",tourist.myWallet);
tourist.myWallet -= amountPaid;
console.log("after updating wallet",tourist.myWallet);

      // Save the updated tourist document
        await tourist.save();
        // console.log(tourist);
        res.status(200).json({ message: "successful payment" , url : `http://localhost:5000/success/${type}` , success: true });
    } catch (error) {
        console.error("Error handling successful payment:", error);
        res.status(500).json({ message: error.message });
    }

}

// Handle successful payment
export const handleSuccessfulPaymentForTourist = async (req, res) => {
    try {
        const { username, items, type , amountPaid } = req.body;
        console.log("before checking fields","username:",username,"items:",items,"amount:" ,amountPaid);
      // Validate request body
        if (!username || !items || !type ) {
        return res.status(400).json({ message: "Missing required fields." });
        }

        if (isNaN(amountPaid) || amountPaid <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount paid" });
        }

      // Find the tourist by username
        const tourist = await Tourist.findOne({ userName: username });
        if (!tourist) {
        return res.status(404).json({ message: "Tourist not found." });
        }

      // Ensure items is an array
        const itemsArray = Array.isArray(items) ? items : [items];

      // Add each item to the touristItems array
        itemsArray.forEach(item => {
            // console.log(item);
            tourist.touristItems.push({ itemData: item.itemData ,quantity:item.quantity ,itemDetails:item.itemDetails, type });
        });

        let value = 0;

        // Validate the badge before proceeding
        switch (tourist.badge) {
            case 'level 1':
                value = amountPaid * 0.5;
                break;
            case 'level 2':
                value = amountPaid * 1;
                break;
            case 'level 3':
                value = amountPaid * 1.5;
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid badge level" });
        }

        // Ensure value is a valid number before adding to points
        if (isNaN(value)) {
            return res.status(400).json({ success: false, message: "Calculated value is invalid" });
        }

        tourist.myPoints += value;
        tourist.accumulatedPoints += value;

        switch(type){
            case 'activity':
                await Promise.all(items.map(async (item) => {
                    const activity = await Activity.findById(item.itemDetails._id);
                    tourist.ActivityBookings.push(activity._id);
                    activity.numberOfBookings++;
                    await activity.save();
                }));
                break;
            case 'itinerary':
                await Promise.all(items.map(async (item) => {
                    const itinerary = await Itinerary.findById(item.itemDetails._id);
                    tourist.itineraryBookings.push(itinerary._id);
                    itinerary.numberOfBookings++;
                    itinerary.isBooked = true;
                    await itinerary.save();
                }));
                break;
            case 'tActivity':
                await Promise.all(items.map(async (item) => {
                    const transportationActivity = await TransportationActivity.findById(item.itemDetails._id);
                    tourist.myBookings.push(transportationActivity._id);
                }));
                break;
            case 'hotel':
                await Promise.all(items.map(async (item) => {
                    try {
                        const hotelData = {data: item.itemDetails , name: item.itemData.name , creator: tourist.userName};
                        const hotelReq = { body: hotelData };
                        await createHotelBooking(hotelReq, res);
                    } catch (error) {
                        console.error('Error in adding hotel to booked hotels:', error.message);
                    }
                }));
                break;
            case 'flight':
                await Promise.all(items.map(async (item) => {
                    try {
                        const flightData = {data: item.itemDetails , creator: tourist.userName};
                        const flightReq = { body: flightData };
                        await createFlightBooking(flightReq, res);
                    } catch (error) {
                        console.error('Error in adding flight to booked flights:', error.message);
                    }
                }));
                break;
            case 'product':
                await Promise.all(items.map(async (item) => {
                    const product = await Product.findById(item.itemDetails._id);
                    tourist.purchasedProducts.push(product._id);
                    product.sales++;
                    product.Available_quantity -= item.quantity;
                    await product.save();
                }));
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid type" });
        }
        await sendEmailReceipt(tourist, items, amountPaid);
      // Save the updated tourist document
        await tourist.save();
    
        res.status(200).json({ message: "Item successfully added to tourist items.", tourist , success: true });
    } catch (error) {
        console.error("Error handling successful payment:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

const sendEmailReceipt = async (tourist, items, amountPaid) => {
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail', // You can use any email service provider
    //     auth: {
    //         user: 'your-email@gmail.com',
    //         pass: 'your-email-password',
    //     },
    // });

    const itemDetails = items.map(item => ({
        name: item.itemData.name,
        quantity: item.quantity,
        price: item.itemData.price,
        total: item.quantity * item.itemData.price,
    }));

    // Calculate the overall total
    const totalAmount = itemDetails.reduce((acc, item) => acc + item.total, 0);

    // Create HTML content for the email receipt
    const htmlContent = `
        <h2>Your Payment Receipt</h2>
        <p>Dear ${tourist.userName},</p>
        <p>Thank you for your payment. Here are the details of your purchase:</p>
        <table border="1">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price (per unit)</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemDetails.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.total}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p><strong>Total Paid: ${amountPaid}</strong></p>
        <p>We appreciate your business!</p>
    `;

    // Send the email
    const mailOptions = {
        from: EMAIL,
        to: tourist.email,  // Use the tourist's email from the tourist object
        subject: 'Payment Receipt',
        html: htmlContent,
    };

    try {
        await sendEmail(mailOptions);
        console.log('Receipt sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Handle unbooking payment
// export const handleUnbookingPaymentForTourist = async (req, res) => {
//     try {
//         const { username, items, type , amountPaid } = req.body;
//         console.log("before checking fields","username:",username,"items:",items,"amount:" ,amountPaid);
//       // Validate request body
//         if (!username || !items || !type ) {
//         return res.status(400).json({ message: "Missing required fields." });
//         }

//         if (isNaN(amountPaid) || amountPaid <= 0) {
//             return res.status(400).json({ success: false, message: "Invalid amount paid" });
//         }

//       // Find the tourist by username
//         const tourist = await Tourist.findOne({ userName: username });
//         if (!tourist) {
//         return res.status(404).json({ message: "Tourist not found." });
//         }


