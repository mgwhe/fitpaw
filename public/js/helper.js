    //https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-50.php#:~:text=ES6%20Version%3A&text=toUpperCase()%20%2B%20str%5Bi%5D.,word%20of%20a%20given%20string.
    function capital_letter(str) 
    {
        str = str.split(" ");

        for (var i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(" ");

    }