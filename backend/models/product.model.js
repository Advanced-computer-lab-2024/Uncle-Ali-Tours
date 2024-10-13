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
    rate: {
        type: Number,
    },
    review: {
        type: String,
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
}
});

// Create and export the Product model using ES Modules syntax
const Product = mongoose.model('Product', productSchema);
export default Product;
