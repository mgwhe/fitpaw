nutritionDBLookup:(req,res,next)=>{
      let currentUser = res.locals.currentUser;
      let foodResults ={};
      const url =  NUTRITIONIX_API_ENDPOINT + req.params.foodName; 

      if (currentUser) {
        if(req.params.foodName != null)
        {
            //make remote call to nutrition database
            console.log("About to make call: "+url);

            fetch(url, {
              headers: {'x-app-key':'527d7ac47737983a2197102edde9b34a',
                        'x-app-id':'179643b1'
                  } //Add API keys for account
            })
            .then(apiRes => apiRes.json()) //wait for object to download and then convert. 
            .then(apiResJSON=>{
           //   apiRes.json();
       //       browserRes.locals.foodNames = new Array(); 
         ////     res.locals.foodNames.push(Object.assign({},apiRes.json()));
         //     res.locals.foodNames.push("Tayto");
              foodResults = apiResJSON;
              console.log(foodResults);
              console.log("=================")
        //      console.log(res.locals.foodNames);
              console.log("In fetch @ "+new Date());
           //   res.locals.foodNames = apiResJSON;
              //console.log(foodResults);
            
              
            })
       /*     .then(results=>{
                res.locals.foodNames = results; //flip it so can be rec-overted with status code in final call
           //     res.status= httpStatus.OK; //does this get added as json or es6 ???
                console.log(res.locals.foodNames);  
        //     const aGRoup= apiRes.json().filter(groupType =>{groupType===});
        //   const commonFoods = apiRes.filter(item=>{item.common.food_name});    
           //   return aGroup;
       //    res.locals = apiRes.body; //attach API response with matching food lists to application respsonse object
       //    return apiRes.json();
       //return res;
       //Array.from
          
            })   */
            .catch(error => {
              console.log("Error:" +error);
            });
        } //if(req.params.foodName != null)
        else{
          console.log("Food name is null!!");
        }
        
        //set response before sending back to user..
    //    res.locals.foodNames = new Array(); 
   //     res.locals.foodNames = {}
        //we have food list! simulate for now
    /*    res.locals.foodNames.push('abcd');
        res.locals.foodNames.push('abcde');
        res.locals.foodNames.push('abcdef');
        res.locals.foodNames.push('abcdef123');
        res.locals.foodNames.push('abcdefghij!');
        */
        
        //res.locals.foodNames = foodResults;
        //console.log(foodResults);
      } //if(currentuser)
      console.log("hitting next");
      next(); //chain to next call in router - call respondJSON()
    }