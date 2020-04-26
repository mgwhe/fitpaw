"use strict";

const express = require("express"), //note express is not a variable but a function so called on next line
  app = express(), //create express application and store reference in app
   //reference routers master file index.js where router listing is located
  router = require("./routes/index"),
  homeController = require("./controllers/homeController"),
  userController = require("./controllers/userController"),
  layouts = require("express-ejs-layouts"), //load express EJS layouts and assign to a variable 
  // layouts which is then used later in this file
  
  User = require("./models/user"), //for user management

  mongoose = require("mongoose"),
  passport = require("passport"), //for authenication
  methodOverride = require("method-override"),
 
  expressSession = require("express-session"), //session management
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator");
  //end require

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

//process.env.MONGODB_URI used by Heroku string used for local database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fitpaw_db",
  { 
    useNewUrlParser: true, //required
    useUnifiedTopology: true 
  }
);
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false); //needed to supress deprecation warning 

const db = mongoose.connection; //grab the MongoDB connection from Mongoose
//Then check connection to MongoDB is open, after this can use database
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

/* 
Web Server Set-up 
*/
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
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);
app.use(express.json()); //parse incoming json data only
app.use(homeController.logRequestPaths);
//
app.use(cookieParser("secret_passcode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

//use of passport plugin for authentication & npm for session handling
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());

//This allows local vairables appearing in every view to know who the user is & if they are authenticated
//Of less impportance is the flash facility from passport to create messages  
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use(expressValidator()); //watch this for errors as docs suggest it is a function!

//for better code layout, pass all routing to router object instead of app object handling it. 
app.use("/",router);

//following code starts the up Node web server  
//and waits for HTTP requests via browser interactions (click on links, change URL, etc)

app.set("port", process.env.PORT || 3000); //read from file or default to port 3000
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

