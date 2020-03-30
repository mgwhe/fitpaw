"use strict";

const express = require("express"), //note express is not a variable but a function so called on next line
  app = express(), 
  
//setup routers
/*
const router = new express.Router();
router.get("/test", (req,res)=>{
res.send("this is from other router");
}) 
app.use = router;
*/

  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  petController = require("./controllers/petController"),
  
  layouts = require("express-ejs-layouts"), //load express EJS layouts and assign to a variable 
  // layouts which is then used later in this file
  
  mongoose = require("mongoose"),
  
  petProfile = require("./models/pet_profile");

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
app.use(express.json()); //could split out and store in variable, then assign to app. this is one step to do both
app.use(homeController.logRequestPaths);

//app.get("/name", homeController.respondWithName);
//app.get("/items/:vegetable", homeController.sendReqParam);
/*
app.get("/petprofile", petController.getPetProfile, (req, res, next) => {
  res.render("petprofile", { petprofile: req.data });
}); 
*/
//simple version 
//not sure about next
app.get("/petprofile", petController.getPetProfile, (req, res) => {
  console.log(req.data);
  res.send(req.data);
}); 

//when someone types or links to http://localhost:3000/petprofile in browser then go to call getPetProfile() method which
//gets the pet profile and stores it in the request object req. parameter iii of above then uses this data 
//to send back to web page  
//for the previous - ****NOTHING*** is happening just now. its just setting this up for when the app is running. 

app.get("/", homeController.index); //when http://localhost:3000/ is called just call homeController.index
app.get("/courses", homeController.showCourses); //when call http://localhosr:3000/courses call..

//app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/member_profile", memberController.saveMemberProfile);

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

//following code starts the up the web server and the app is now running 
//and waiting for HTTP requests via browser interactions (click on links, change URL, etc)
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
