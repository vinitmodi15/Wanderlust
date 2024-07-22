const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    rooms: {
        type: Number,
        required: true,
        min: 1
    },
    adults: {
        type: Number,
        required: true,
        min: 1,
        max: 2
    },
    children: {
        type: Number,
        required: true,
        min: 0
    },
    specialrequest: {
        type: String,
        trim: true
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
