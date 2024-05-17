const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto files for truck and reservation 
const truckProtoPath = 'truck.proto';
const reservationProtoPath = 'reservation.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Create a new Express application
const app = express();
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
app.use(bodyParser.json());
const truckProto = grpc.loadPackageDefinition(truckProtoDefinition).truck;
const reservationProto = grpc.loadPackageDefinition(reservationProtoDefinition).reservation;

// Create ApolloServer instance with imported schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });


// Apply ApolloServer middleware to Express application
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
});

app.get('/trucks', (req, res) => {
    const client = new truckProto.TruckService('localhost:50051',
        grpc.credentials.createInsecure());
    client.searchTrucks({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.trucks);
        }
    });
});

app.get('/trucks/:id', (req, res) => {
    const client = new truckProto.TruckService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getTruck({ truck_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.truck);
        }
    });
});

app.post('/trucks/add', (req, res) => {
    const client = new truckProto.TruckService('localhost:50051',
        grpc.credentials.createInsecure());
    const data = req.body;
    const marque =data.marque;
    const modele =data.modele;
    const couleur=data.couleur;
    const desc= data.description
    client.addTruck({ marque:marque,modele:modele,couleur:couleur,description:desc  }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.truck);
        }
    });

});
app.put('/trucks/update/:id', (req, res) => {
    const client = new truckProto.TruckService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id; 
    console.log(id);   
    const data = req.body;
    const marque = data.marque;
    const modele = data.modele;
    const couleur = data.couleur;
    const desc = data.description;
    client.updateTruck({id:id, marque: marque, modele: modele, couleur: couleur, description: desc }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.truck);
        }
    });
   
});
app.delete('/trucks/delete/:id', (req, res) => {
    const client = new truckProto.TruckService('localhost:50051',
        grpc.credentials.createInsecure());
    const truckId = req.params.id; 
    client.deleteTruck({ id: truckId }, (err, response) => { 
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.trucks);
        }
    });
});

app.get('/reservations', (req, res) => {
    const client = new reservationProto.ReservationService('localhost:50052',
        grpc.credentials.createInsecure());
    client.searchReservations({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.reservation);
        }
    });
});

app.get('/reservations/:id', (req, res) => {
    const client = new reservationProto.ReservationService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getReservation({ reservation_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.reservation);
        }
    });
});

app.post('/reservations/add', (req, res) => {
    const client = new reservationProto.ReservationService('localhost:50052',
        grpc.credentials.createInsecure());
    const data = req.body;
    const customer_id=data.customer_id;
    const start_date =data.start_date;
    const end_date =data.end_date;
    const price = data.price ;
    const car_id= data.car_id;
    client.addReservation({ customer_id: customer_id, start_date: start_date,end_date:end_date,price :price ,car_id:car_id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.reservation);
        }
    });
});

// Start Express application
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
