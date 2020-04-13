"use strict";

const mongoose = require("mongoose"),
FoodDiaryEntry = require("./models/food_diary_entry"),

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

var food_diary_entries = [
  {
    foodName: "Bread",
    foodQuantity: "2",
    foodUnits: "Slices",
    foodEntryDate: "2020-02-23T16:26:43.511Z"
  },
  {
    foodName: "Meat",
    foodQuantity: ".3",
    foodUnits: "Kg",
    foodEntryDate: 10
  },
  {
    foodName: "Sweets",
    foodQuantity: "4",
    foodUnits: "Pieces",
    foodEntryDate: 10
  },
  {
    foodName: "Dog Biscuits",
    foodQuantity: "2",
    foodUnits: "Pieces",
    foodEntryDate: 10
  }
];

FoodDiaryEntry.deleteMany()
  .exec()
  .then(() => {
    console.log("FoodDiaryEntry data is empty!");
  });

var commands = [];

pets.forEach(c => {
  commands.push(
    //creates a MongoDB document using the array above 
    FoodDiaryEntry.create({
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