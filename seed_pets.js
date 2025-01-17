"use strict";

const mongoose = require("mongoose"),
//reference models so can create objects from them and store in MongoDB using Mongoose API
PetProfile = require("./models/pet_profile"),
Breed = require("./models/breed");

  /*
  mongoose.connect(
    "mongodb://dogpaw-db:Pz1aO7zh5i2zVcZ9O8VRxMjKffbcXt8cXbUzNUNYI5f3ySGNgS97BxQ0m4nOaqgNmc5HN1Fd10Z69K3pN8grDg==@dogpaw-db.documents.azure.com:10255/?ssl=true&replicaSet=globaldb",
  { useNewUrlParser: true, 
    useUnifiedTopology: true
  }
);
*/
//Connect to fitpaw_db database
mongoose.connect(
  "mongodb://localhost:27017/fitpaw_db",
{ 
  useNewUrlParser: true, //required 
  useUnifiedTopology: true
}
);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

var pets = [
  {
    petName: "Spot",
    petAge: 4,
    petTagNumber: "ABC123",
    petWeight: 10
  },
  {
    petName: "Tiny",
    petBreed: new Breed({breedName:"Field Spaniel"}),
    petAge: 3,
    petWeight: 20
  }
];

 
PetProfile.deleteMany()
  .exec()
  .then(() => {
    console.log("PetProfile data is empty!");
  });

var commands = [];

pets.forEach(c => {
  commands.push(
    //creates a MongoDB document using the array above 
    PetProfile.create({
      petName: c.petName,
      petAge: c.petAge,
      petBreed: c.petBreed,
      petTagNumber: c.petTagNumber,
      petWeight: c.petWeight 
    })
  );
});

Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });
