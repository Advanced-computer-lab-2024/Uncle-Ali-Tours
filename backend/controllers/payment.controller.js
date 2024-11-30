import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {
    try{
        const { items , currentCurrency , currencyRate } = req.body;
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
            success_url: `http://localhost:5000/success`,
            cancel_url: `http://localhost:5000/cancel`,
        });
        res.json({ url : session.url });
    }
    catch(error){
        res.status(500).json({ message: error.message });
        console.log(error.message);
    }
}

    // const session = await stripe.checkout.sessions.create({
    //     line_items: [
    //       {
    //         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
    //         price: '{{PRICE_ID}}',
    //         quantity: 1,
    //       },
    //     ],
    //     mode: 'payment',
    //     success_url: `http://localhost:5000/checkout?success=true`,
    //     cancel_url: `http://localhost:5000/checkout?canceled=true`,
    // });
    
    //   res.redirect(303, session.url);
    // };