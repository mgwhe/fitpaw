  //lib of calls for autocomplete
  /*
  Based on sample code from W3CSchools
  source: https://www.w3schools.com/howto/howto_js_autocomplete.asp 

  Main modificatins to sample:
  1. changed to only trigger on 3rd character as may not be responsive otherwise
  2. changed from a fixed array of countries in the sample to instead using an API lookup for a list of food values 
  3. changed so can use an object s1 that can point to two different searches - search external nutrition database, or
  search complementary local food database 
   */
function autocomplete(inp, obj) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;} 
        if (val.length <3 ) { return false;} //IW: think this is where to change so only updates if >3 letters
        //IW: make API call for list of matching foods
        let foods = [];
        foods = getFoods(val); //get food list or a null if invlaid food name

        if(foods===null || foods.length ===0){ //bail out because invalid foor name entered and dont want corrupt data
            alert("No food matches, do you want to add a new food to the database?");
            return;
        }
        //extract only the food names by using map
        var arr = foods.map(food=>food.foodName);

        console.log("after call to getFoods");
        console.log(arr);

        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length); //IW: add the rest of the name from the array
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                              
                    //IW: added. Find the food selected in the input control by looking up the array of foods objects created earlier
                    //store the units in the units list options. 

                    //clear down quantity
                    document.getElementById('inputFoodQuantity').value ="";

                    //clear down units
                    document.getElementById('idFoodUnits').innerHTML ="";

                    //lookup foodName so can then get the qty and default amount
                    let foodDetailsMatch = foods.find(food => food.foodName === inp.value); //https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
                    
                    //add food quantity to input box. user can edit as needs be
                    document.getElementById('inputFoodQuantity').value = foodDetailsMatch.foodQuantity;

                     //update units field
                     document.getElementById('idFoodUnits').innerHTML = foodDetailsMatch.foodUnits;
                     console.log(foodDetailsMatch.foodUnits);
                    //IW end

                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
            });
            a.appendChild(b);
        }
    }
});

/*execute a function presses a key on the keyboard:*/
inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
    } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
    } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
            if (x){ 
                x[currentFocus].click();
               
        }
        }
    }
});

function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}

function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
        } //if
    } //for
    
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
        closeAllLists(e.target);
        
    });
}
