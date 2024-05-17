const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    customer_id : String,
    start_date : String,
    end_date : String,
    price : String,
    camion_id:String,
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;