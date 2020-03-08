"use strict";

const express = require("express"), //note express is not a variable but a function so called on next line
  app = express(), 
  
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  petController = require("./controllers/petController"),
  
  layouts = require("express-ejs-layouts"), //load express EJS layouts and assign to a variable layouts
  
  mongoose = require("mongoose"),
  
  petProfile = require("./models/pet_profile");

mongoose.Promise = global.Promise;

/* MongoDB stuff for Azure
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

mongoose.connect(
  "mongodb://localhost:27017"     
);
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.once("open", () => {
console.log("Successfully connected to MongoDB using Mongoose!");
});


app.set("port", process.env.PORT || 3000); //read from file or default to port 3000
app.set("view engine", "ejs"); //use EJS engine for generating views for later sending to browser

app.use(express.static("public")); //use static files from the public folder - images, CSS, HTML
app.use(layouts); //layouts created earlier. here we tell app object about it.
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json()); //could split out and store in variable, then assign to app
app.use(homeController.logRequestPaths);

//app.get("/name", homeController.respondWithName);
//app.get("/items/:vegetable", homeController.sendReqParam);

app.get("/petprofile", petController.getPetProfile, (req, res, next) => {
  res.render("petprofile", { petprofile: req.data });
});

app.get("/", homeController.index);
app.get("/courses", homeController.showCourses);

//app.get("/contact", subscribersController.getSubscriptionPage);
//app.post("/subscribe", subscribersController.saveSubscriber);
//test change

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
