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