// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les trucks et lesreservation
const truckProtoPath = 'truck.proto';
const reservationProtoPath = 'reservation.proto';
const truckProtoDefinition = protoLoader.loadSync(truckProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const reservationProtoDefinition = protoLoader.loadSync(reservationProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const truckProto = grpc.loadPackageDefinition(truckProtoDefinition).truck;
const reservationProto = grpc.loadPackageDefinition(reservationProtoDefinition).reservation;
// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
    Query: {
        truck: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de truck
            const client = new truckProto.TruckService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getTruck({ truck_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.truck);
                    }
                });
            });
        },
        addTruck: (_, { marque:marque,modele:modele,couleur:couleur,description:desc}) => {
            // Effectuer un appel gRPC au microservice de truck
            const client = new truckProto.TruckService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.addTruck({ marque:marque,modele:modele,couleur:couleur,description:desc }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.truck);
                    }
                });
            });
        },
        trucks: () => {
            // Effectuer un appel gRPC au microservice de films
            const client = new truckProto.TruckService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchTrucks({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.trucks);
                    }
                });
            });
        },
        addReservation: (_, { customer_id: customer_id, start_date: start_date,end_date:end_date,price :price ,pick_up_location:pick_up_location}) => {
            // Effectuer un appel gRPC au microservice de films
            const client = new reservationProto.ReservationService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.addReservation({ customer_id: customer_id, start_date: start_date,end_date:end_date,price :price ,pick_up_location:pick_up_location }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.tv_show);
                    }
                });
            });
        },
        reservation: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de séries TV
            const client = new reservationProto.ReservationService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getReservation({ tv_show_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.tv_show);
                    }
                });
            });
        },
        reservations: () => {
            // Effectuer un appel gRPC au microservice de séries TV
            const client = new reservationProto.ReservationService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchReservations({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.tv_shows);
                    }
                });
            });
        },
    },
};
module.exports = resolvers;