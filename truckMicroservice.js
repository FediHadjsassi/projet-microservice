const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Truck = require('./models/truckModel');

const truckProtoPath = 'truck.proto';
const truckProtoDefinition = protoLoader.loadSync(truckProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const truckProto = grpc.loadPackageDefinition(truckProtoDefinition).truck;

const url = 'mongodb://localhost:27017/trucksDB';

mongoose.connect(url)
    .then(() => {
        console.log('connected to database!');
    }).catch((err) => {
        console.log(err);
    });

const truckService = {
    getTruck: async (call, callback) => {
        try {
            const truckId = call.request.truck_id;
            const truck = await Truck.findOne({ _id: truckId }).exec();
            if (!truck) {
                callback({ code: grpc.status.NOT_FOUND, message: 'truck not found' });
                return;
            }
            callback(null, { truck });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching truck' });
        }
    },
    searchTrucks: async (call, callback) => {
        try {
            const trucks = await Truck.find({}).exec();
            callback(null, { trucks });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching trucks' });
        }
    },
    addTruck: async (call, callback) => {
        const { marque, modele, couleur, description } = call.request;
        const newTruck = new Truck({ marque, modele, couleur, description });
        try {
            const savedTruck = await newTruck.save();
            callback(null, { truck: savedTruck });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding truck' });
        }
    },
    updateTruck: async (call, callback) => {
        const { id, marque, modele, couleur, description } = call.request;
        const _id = id;
        try {
            const updatedTruck = await Truck.findByIdAndUpdate(_id, { marque, modele, couleur, description }, { new: true });
            callback(null, { truck: updatedTruck });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while updating truck' });
        }
    },
    deleteTruck: async (call, callback) => {
        try {
            const truckId = call.request.id;
            const deletedTruck = await Truck.findByIdAndDelete(truckId);
            if (!deletedTruck) {
                callback({ code: grpc.status.NOT_FOUND, message: 'truck not found' });
                return;
            }
            callback(null, { truck: deletedTruck });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while deleting truck' });
        }
    }
};

const server = new grpc.Server();
server.addService(truckProto.TruckService.service, truckService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Failed to bind server:', err);
            return;
        }
        console.log(`Server is running on port ${port}`);
        server.start();
    });
console.log(`Truck microservice is running on port ${port}`);
