

import mongoose from "mongoose";

const deliveryAddressSchema = new mongoose.Schema({
   
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
<<<<<<< HEAD
  isDefault: { type: Boolean, default: false },
  creator: {
    type: String,
    required: true
},  // to mark default address
=======
  isDefault: { type: Boolean, default: false }, 
  data: [],
  creator: {
      type: String,
      required: true
  }, // to mark default address
>>>>>>> 2e86b1ce43d2bc94e338a1927599cace8e8fa6a8
});

const DeliveryAddress = mongoose.model('DeliveryAddress', deliveryAddressSchema);
export default DeliveryAddress;
