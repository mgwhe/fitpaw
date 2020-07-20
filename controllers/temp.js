addFoodBasketItemsToDiary: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    
  //  let foodDate = req.body.foodDate;

    if (currentUser) {
        
        let foodDate = helpers.fixDate(req.body.foodDate); //set date to yyyy-MM-DD 

        let foodBasketContents = JSON.parse(req.body.foodBasketContents);

        //check if diary Day exists
        FoodDiaryDay.findOne( {"foodDiaryDayDate": foodDate})
        .where('userRef').equals(currentUser.id).populate("foodDiaryItems") 
        .then(foodDiaryDay=>{

          if(foodDiaryDay == null){
            console.log("about to create FoodDiaryDay");
            foodDiaryDay= new FoodDiaryDay({userRef:currentUser.id,foodDiaryDayDate:foodDate});
          }
          
         //Find maximum value of a meal witihn an array of FoodItems 
         //source: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
        const maxMealCount = Math.max(...foodDiaryDay.foodDiaryItems.map(o => o.mealNumber), 0);
        console.log("Max meal number is: "+maxMealCount);

          foodBasketContents.forEach(foodItem =>{
              let newFoodItem = new FoodItem(foodItem);
          
              let foodName = foodItem.foodName.trim().toLowerCase();
              
              //search for food in FitPaw database 
              FoodNutrients.findOne( {"foodName": foodName})
              .then(nutrientqueryResult=>{
                  if(nutrientqueryResult===null){ //food nutrients not known to FitPaw database 

                    //Get nutrients from Nutritionix via API
                    helpers.getNutrients(foodName) //Issue resolved - needed to do .then as API call is async and using let will return too early!!
                    .then(nutrientAPIResults=>{
                      let foodNutrients = new FoodNutrients(helpers.assignNutrientAPIResultsToFoodNutrients(nutrientAPIResults));
                                
                      console.log(JSON.stringify(foodNutrients));
    
                      foodNutrients.save();
    
                      newFoodItem.foodNutrients = foodNutrients._id;
                      newFoodItem.mealNumber = maxMealCount+1;
                    
                      newFoodItem.save();
                      foodDiaryDay.foodDiaryItems.push(newFoodItem._id);  
                     
                    
                      console.log(newFoodItem._id);
                      console.log(newFoodItem.foodName);
    
                    }) //.then
                    .catch(error=>{ //helpers.getNutrients(foodName)
                        console.log("Error: "+error);
                    }); //.catch    
                  }//if
                  else{ //already exists
                    newFoodItem.foodNutrients = nutrientqueryResult._id;
                    newFoodItem.mealNumber = maxMealCount+1;
                  
                    newFoodItem.save();
                    foodDiaryDay.foodDiaryItems.push(newFoodItem._id);  
                  
                  
                    console.log(newFoodItem._id);
                    console.log(newFoodItem.foodName);
                  } //else
                })
                .catch(error=>{ //FoodNutrients.findOne( {"foodName": foodName})
                  console.log("Error: "+error);
                }); //.catch   
              
          }) //forEach
        
          foodDiaryDay.save();

          next(); 
          

          console.log("foodDiaryDay.foodDiaryItems.length= "+foodDiaryDay.foodDiaryItems.length);
          
        })
        .catch(error => {
          console.log(`Error: ${error.message}`); 
          next(error);
        });

        
    } //if user
 
  }

  //
  saveFoodsFromBasket: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    
  //  let foodDate = req.body.foodDate;

    if (currentUser) {

      let foodItemIDs = [];

          let foodBasketContents = JSON.parse(req.body.foodBasketContents);

        /*  FoodNutrients.findOne( {})
            .then(nutrientqueryResult=>{
              console.log("Hit before forEach");
            });
        */

        let basketQueries = [];

          foodBasketContents.forEach(foodItem =>{
            let newFoodItem = new FoodItem(foodItem);
        
            let foodName = foodItem.foodName.trim().toLowerCase();
            
            console.log("about to exec FoodNutrients.findOne for food"+foodName);
            //search for food in FitPaw database 
            basketQueries.push(FoodNutrients.findOne( {"foodName": foodName}));

/*
            .then(nutrientqueryResult=>{
              console.log("Hit");
                if(nutrientqueryResult===null){ //food nutrients not known to FitPaw database 

                  //Get nutrients from Nutritionix via API
                  helpers.getNutrients(foodName) //Issue resolved - needed to do .then as API call is async and using let will return too early!!
                  .then(nutrientAPIResults=>{
                    let foodNutrients = new FoodNutrients(helpers.assignNutrientAPIResultsToFoodNutrients(nutrientAPIResults));
                              
                    console.log(JSON.stringify(foodNutrients));

                    foodNutrients.save();

                    newFoodItem.foodNutrients = foodNutrients._id;
                  
                    newFoodItem.save();
                  //Add newFoodItem._id to array, so at the end pass on on addFoodsToDiary call which saves to FoodDay
                    foodItemIDs.push(newFoodItem._id);

                    console.log(newFoodItem._id);
                    console.log(newFoodItem.foodName);

                  }) //.then
                  .catch(error=>{ //helpers.getNutrients(foodName)
                      console.log("Error: "+error);
                  }); //.catch    
                }//if
                else{ //already Nutrients for food already exists in FoodNutrients
                  newFoodItem.foodNutrients = nutrientqueryResult._id;
                  newFoodItem.mealNumber = maxMealCount+1;
                
                  newFoodItem.save(); 
                  //Add newFoodItem._id to array
                  foodItemIDs.push(newFoodItem._id);
                
                  console.log(newFoodItem._id);
                  console.log(newFoodItem.foodName);
                } //else

                
              }) //.then
              .catch(error=>{ //FoodNutrients.findOne( {"foodName": foodName})
                console.log("Error: "+error);
              }); //.catch  
            */ 
          }) //forEach
          return Promise.all(basketQueries);
          
         next();

    } //if user
  }
  //
  //last
  saveFoodsFromBasket: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    
  //  let foodDate = req.body.foodDate;

    if (currentUser) {

        let foodItemIDs = [];

        let foodBasketContents = JSON.parse(req.body.foodBasketContents);
            
        foodBasketContents.forEach(foodItem =>{
          
          await FoodItem.create(foodItem)
          .then((newFoodItem)=>{
            let foodName = newFoodItem.foodName.trim().toLowerCase();
            
            foodItemIDs.push(newFoodItem._id); //Add newFoodItem._id to array, so at the end pass on on addFoodsToDiary call which saves to FoodDay
                          
            console.log(newFoodItem._id);
            console.log(newFoodItem.foodName);

            FoodNutrients.findOne( {"foodName": foodName})
            .then(nutrientqueryResult=>{
                
                if(nutrientqueryResult===null){ //food nutrients not known to FitPaw database 
                  console.log("No such food in FitPaw DB");
                    //Get nutrients from Nutritionix via API
                    helpers.getNutrients(foodName) //Issue resolved - needed to do .then as API call is async and using let will return too early!!
                    .then(nutrientAPIResults=>{
                        FoodNutrients.create(helpers.assignNutrientAPIResultsToFoodNutrients(nutrientAPIResults))
                        .then((foodNutrients)=>{
                            FoodItem.findOne({foodName:foodNutrients.foodName})
                            .then((foodItem)=>{
                              findByIdAndUpdate(foodItem._id,{foodNutrients:foodNutrients._id}).exec();
                            })
                        })
                    })

                } //if
                else{ //already Nutrients for food already exists in FoodNutrients
                  console.log("Found food in FitPaw DB");

                  newFoodItem.foodNutrients = nutrientqueryResult._id;
                  newFoodItem.mealNumber = maxMealCount+1;
                
                  newFoodItem.save(); 
                  //Add newFoodItem._id to array
                  foodItemIDs.push(newFoodItem._id);
                
                  console.log(newFoodItem._id);
                  console.log(newFoodItem.foodName);
                } //else
                    
            }) //.then
            .catch(error=>{ //FoodNutrients.findOne( {"foodName": foodName})
              console.log("Error: "+error);
            }); //.catch  
          }) //FoodItem.create(foodItem)

        })//forEach
        
    } //if user
    
  }