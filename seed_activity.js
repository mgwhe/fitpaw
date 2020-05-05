"use strict";

const mongoose = require("mongoose"),
ActivityTrack = require("./models/activity_track"),
User = require("./models/user");

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

  //create a user
  /*
  let newUser = new User({name: {first:'q',last: 'q'},email: 'q@q.com',password: 'q'});

    User.register(newUser, 'q', (error, user) => {
      if (user) {
        //may make this a popup
        console.log("Created & registered user");

      } else {
        console.log("Failed to create/register user");

      }
      
    })
    */

   /* test user t: 5eb109e9f821b94524021754 */

  ActivityTrack.create({
    activityTrackDistanceMetres:2000,
    activityTrackTimeSeconds:1500,
    userRef:'5eb109e9f821b94524021754',
    activityTrackDate:'2020-05-02'
})
.catch(error => {
        console.log(`IW Error: ${error.message}`);
});
  