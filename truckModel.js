const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
    marque : String,
    modele : String,
    couleur : String,
    description: String,
});

const Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;