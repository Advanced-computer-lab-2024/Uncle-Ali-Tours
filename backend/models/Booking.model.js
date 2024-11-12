// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  data: [],
    bookingUser: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
