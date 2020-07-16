"use strict";

const { default: validator } = require("validator");

const User = require("../models/user"),
httpStatus = require("http-status-codes"),  
axios = require('axios');

const NUTRITIONIX_API_ENDPOINT_FOOD_QUERY = 'https://trackapi.nutritionix.com/v2/search/instant?query=';
const NUTRITIONIX_API_ENDPOINT_FOOD_NUTRIENTS = 'https://trackapi.nutritionix.com/v2/natural/nutrients';


//Add helper function to do lookup call
//https://stackoverflow.com/questions/38204545/how-do-i-call-one-controllers-method-in-another-controller-in-node
exports.getNutrients = function(foodName){

    //make remote call to nutrition database
    const url =  NUTRITIONIX_API_ENDPOINT_FOOD_NUTRIENTS; 
    const data = {query:foodName};
  
    //check look up food name before calling API
     if(validator.isAlpha(validator.blacklist(foodName, ' '))){
      return axios.post(url, data, {
        headers: {'x-app-key':'527d7ac47737983a2197102edde9b34a',
                  'x-app-id':'179643b1'
            }, //Add API keys for account
        } //axios.post
        )
        .then(response=>{
       //   console.log("in helper, after call dumping repsonse.data..");  
        //  console.log(JSON.stringify(response.data));
          
          let result = response.data;
          return result;
        })
        .catch(error=>{
          console.log(error);
        });
      } //if
      else{
          return null;
      }
  } //getNutrients