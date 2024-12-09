import mongoose from "mongoose";

<<<<<<< Updated upstream
const touristModel = new mongoose.Schema({
    email : {
        required:true,
        type: String
    },userName:{
        required:true,
        type: String,
        unique: true,
    },password:{
        required:true,
        type: String
    },
    mobileNumber:{
        required:true,
        type: Number
    },nationality:{
        required:true,
        type: String
    },dateOfBirth:{
        required:true,
        type: Date
    },myWallet:{
        type: Number,
        default: 100
    },occupation:{
        required:true,
        type: String
    },purchasedProducts:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Product'
    }],
    myPoints:{
        type: Number,
        default: 14000
    },myPreferences:{
        required:true,
        type:[String],
        default:[] 
    },badge:{
        type:String,
        default:"Level 1"
    },myBookings:{
        type:[String],
        required:false
    },ActivityBookings:{
        type:[String],
        required:false
    },itineraryBookings:{
        type:[String],
        required:false
    },
    productsWishlist:{
        type:[String],
        required:false
    },
    promoCodes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Promo',
        required:false
    }, 
    },{
        timestamps: true
    });
=======
const touristModel = new mongoose.Schema(
	{
		email: {
			required: true,
			type: String,
		},
		userName: {
			required: true,
			type: String,
			unique: true,
		},
		password: {
			required: true,
			type: String,
		},
		mobileNumber: {
			required: true,
			type: Number,
		},
		nationality: {
			required: true,
			type: String,
		},
		dateOfBirth: {
			required: true,
			type: Date,
		},
		myWallet: {
			type: Number,
			default: 100,
		},
		accumulatedPoints: {
			type: Number,
			default: 0,
		},
		occupation: {
			required: true,
			type: String,
		},
		purchasedProducts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		myPoints: {
			type: Number,
			default: 14000,
		},
		myPreferences: {
			required: true,
			type: [String],
			default: [],
		},
		badge: {
			type: String,
			default: "Level 1",
		},
		myBookings: {
			type: [String],
			required: false,
		},
		ActivityBookings: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Activity",
			required: false,
		},
		itineraryBookings: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Itinerary",
			required: false,
		},
		touristItems: {
			type: [
				{
					itemData: {
						type: Object,
						required: false,
					},
					quantity: {
						type: Number,
						required: false,
					},
					itemDetails: {
						type: Object,
						required: false,
					},
					type: {
						type: String,
						required: false,
					},
				},
			],
			required: false,
		},
		productsWishlist: {
			type: [String],
			required: false,
		},

		bookmark: {
			type: [String],
			required: false,
		},
		productsCart: {
			type: [
				{
					productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
					quantity: { type: Number, required: true, default: 1 },
				},
			],
			required: false,
		},
		promoCodes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Promo",
			required: false,
		},
		notifications: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Notification",
		},
	},
	{
		timestamps: true,
	},
);
>>>>>>> Stashed changes

const Tourist = mongoose.model("Tourist",touristModel);
export default Tourist;