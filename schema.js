const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
type Truck {
id: String!
marque : String!
modele : String!
couleur : String!
description: String!
}
type Reservation {
id: String!
customer_id : String!
start_date : String!
end_date : String!
price : String!
camion_id : String!
}
type Query {
truck(id: String!): Truck
trucks: [Truck]
reservation(id: String!): Reservation
reservations: [Reservation]
addTruck(marque : String!,modele : String!,couleur : String!,description: String!): Truck
addReservation(customer_id : String!,start_date : String!,end_date : String!,price : String!,camion_id : String!): Reservation

}
`;
module.exports = typeDefs