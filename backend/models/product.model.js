import mongoose from 'mongoose'; // Import mongoose using ES module syntax

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    imgURL: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
     //   required: true,
    },
    seller: {
        type: String,
       // required: true,
    },
    rate: [
        {
          rating: Number,
          user: {
            userName: String,
            userId: mongoose.Schema.Types.ObjectId,
          },
        },
      ],
      review: [
        {
          reviewText: String,
          user: {
            userName: String,
            userId: mongoose.Schema.Types.ObjectId,
          },
        },
      ],
    sales: {
        type:Number,
        default:0
    }
,
creator:{
    type:String,

},
archive:{
    type:Boolean,
    default:false
},
Available_quantity: {
    type: Number,
},
profilePicture: {
    type: String,  // This will store the path to the uploaded picture
},
});

// Create and export the Product model using ES Modules syntax
const Product = mongoose.model('Product', productSchema);
export default Product;
