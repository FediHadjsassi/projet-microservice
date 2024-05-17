const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Reservation = require('./models/reservationModel');

const reservationProtoPath = 'reservation.proto';
const reservationProtoDefinition = protoLoader.loadSync(reservationProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const reservationProto = grpc.loadPackageDefinition(reservationProtoDefinition).reservation;

const url = 'mongodb://localhost:27017/reservationsDB';

mongoose.connect(url)
    .then(() => {
        console.log('Connected to database!');
    }).catch((err) => {
        console.log(err);
    });

const reservationService = {
    getReservation: async (call, callback) => {
        try {
            const reservationId = call.request.reservation_id;
            const reservation = await Reservation.findOne({ _id: reservationId }).exec();
            if (!reservation) {
                callback({ code: grpc.status.NOT_FOUND, message: 'Reservation not found' });
                return;
            }
            callback(null, { reservation });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching reservation' });
        }
    },
    searchReservations: async (call, callback) => {
        try {
            const reservations = await Reservation.find({}).exec();
            callback(null, { reservations });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching Reservations' });
        }
    },
    addReservation: async (call, callback) => {
        const { customer_id, start_date, end_date, price, camion_id } = call.request;
        const newReservation = new Reservation({ customer_id, start_date, end_date, price, camion_id });
        try {
            const savedReservation = await newReservation.save();
            callback(null, { reservation: savedReservation });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding reservation' });
        }
    }
};

const server = new grpc.Server();
server.addService(reservationProto.ReservationService.service, reservationService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err);
        return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
});

console.log(`Reservation microservice is running on port ${port}`);
