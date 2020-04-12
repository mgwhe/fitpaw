"use strict";

const express = require("express"), //note express is not a variable but a function so called on next line
  app = express(), //create express application and store reference in app
   //reference routers master file index.js where router listing is located
  router = require("./routes/index"),
  homeController = require("./controllers/homeController"),

   
  layouts = require("express-ejs-layouts"), //load express EJS layouts and assign to a variable 
  // layouts which is then used later in this file
  
  mongoose = require("mongoose");
  
  //petProfile = require("./models/pet_profile");

mongoose.Promise = global.Promise;

/* MongoDB stuff
mongoose.connect(
    "mongodb://dogpaw-db:Pz1aO7zh5i2zVcZ9O8VRxMjKffbcXt8cXbUzNUNYI5f3ySGNgS97BxQ0m4nOaqgNmc5HN1Fd10Z69K3pN8grDg==@dogpaw-db.documents.azure.com:10255/?ssl=true&replicaSet=globaldb",
  { useNewUrlParser: true, 
    useUnifiedTopology: true
  }
);
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});
*/
/*
Database Setup
*/
/* Connect to MongoDB engine & fitpaw_db on port 27017*/
mongoose.connect(
    "mongodb://localhost:27017/fitpaw_db",
  { 
    useNewUrlParser: true, //required
    useUnifiedTopology: true 
  }
);
mongoose.set("useCreateIndex", true);
const db = mongoose.connection; //grab the MongoDB connection from Mongoose
//Then check connection to MongoDB is open, after this can use database
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

/* 
Web Server Set-up 
*/
app.set("port", process.env.PORT || 3000); //read from file or default to port 3000
app.set("view engine", "ejs"); //use EJS view engine for viewing. could be any one of 20 different view engines
//ones available on npmjs.com 

app.use(express.static("public")); //use static files from the public folder - things like images, 
// CSS, HTML files. These are files that don't ever change so application just presents them as they are
app.use(layouts); //layouts variable created earlier. here we tell app to use it. app object controls everything
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json()); //parse incoming json data only
app.use(homeController.logRequestPaths);

app.use("/",router);

//following code starts the up Node web server  
//and waits for HTTP requests via browser interactions (click on links, change URL, etc)
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
