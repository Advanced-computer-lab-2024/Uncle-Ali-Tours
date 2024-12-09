

import mongoose from "mongoose";

const deliveryAddressSchema = new mongoose.Schema({
   
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },


  isDefault: { type: Boolean, default: false },
  creator: {
    type: String,
    required: true
},  // to mark default address
  // to mark default address

});

const DeliveryAddress = mongoose.model('DeliveryAddress', deliveryAddressSchema);
export default DeliveryAddress;
