# Project MicroService

This project is a simple skeleton code for microservice architecture pattern using Node.js , PostgreSQL  , Rest , GraphQL.


# Technologies

* **gRPC** : Used for efficient communication between microservices.


* **GraphQL** : Implemented for flexible and efficient querying of data.


* **REST**: RESTful APIs are used for exposing the services to external clients.


# User MicroService

Contains API related to creating a new RESERVATION and API end point to get this Reservation

- Rest :


```http
POST /reservation
```

| Parameter   | Type     | Description                       |
| :-----------| :------- | :-------------------------------- |
| `customer_id `      | `string` | **Required**.                     |
| `start_date`    | `string` | **Required**.                     |
| `end_date `      | `string` | **Required**.                     |
| `price `      | `string` | **Required**.                     |
| `camion_id `      | `string` | **Required**.                     |


```



# Truck MicroService

Contains API related to creating a new TRUCK and API end point to get this TRUCK

- Rest :


```http
POST /truck
```

| Parameter   | Type     | Description                       |
| :-----------| :------- | :-------------------------------- |
| `id `      | `string` | **Required**.                     |
| `marque`    | `string` | **Required**.                     |
| `modele `      | `string` | **Required**.                     |
| `couleur `      | `string` | **Required**.                     |
| `description `      | `string` | **Required**.          

- 
# Express routes:
The code defines several Express routes for handling RESTful API requests:

            GET /voitures: Fetches voiture using the jeanService gRPC .

            POST /voitures/add: Creates a new voiture using the voitureService gRPC .

            UPDATE /voitures/update/:id :updates a voiture using the voitureService gRPC. 

            DELETE /voitures/delete/:id: Deletes a voiture using the voitureService gRPC .

            GET /voitures/:id: Retrieves a voiture by ID using the voitureService gRPC .

            GET /reservations: Fetches reservation using the reservationService gRPC .

            POST /reservations/add: Creates a new reservation using the reservationService gRPC .

            GET /reservations/:id: Retrieves a reservation by ID using the reservationService gRPC .

```


# Requirements

**Ensure you have the following software installed on your local machine** :

git

Node.js (version 18 or higher)

npm (version 6 or higher)

PostgreSQL

# Common setup

`cd Project`

`npm install`

# Run

To start the ApiGateway server, run the following

`node apiGerway.js`

To start the User server, run the following

`node reservationMicroservice.js`

To start the Order server, run the following

`node truckMicroservice.js`
