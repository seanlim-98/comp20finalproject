// console.log('Client-side code running');
//
// const button = document.getElementById('myButton');
// button.addEventListener('click', function(e) {
//   console.log('button was clicked');
// });



    //Global Variables
    var username;
    var beerID;
    var currBeer;
    var currBeerJSON;
    var likedBeers = [];
    var likedBeersJSON = [];

    var prevLiked;
    var numberLiked;
    var pastLikedBeers;

    //Requests and Gets the API
    //Sends the JSON file to be sorted
    function getData(num) {

        /* Step 1: Make instance of request object...
        ...to make HTTP request after page is loaded*/
        request = new XMLHttpRequest();
        //console.log("1 - request object created");

        // Step 2: Set the URL for the AJAX request to be the JSON file

        var url = "https://api.punkapi.com/v2/beers/" + beerID.toString();

        request.open("GET", url, true)
        //console.log("2 - opened request file");

        // Step 3: set up event handler/callback

        request.onreadystatechange = function() {
            //console.log("3 - readystatechange event fired.");

            if (request.readyState == 4 && request.status == 200) {

                // Step 5: wait for done + success
                //console.log("5 - response received");

                result = request.responseText;
                currBeer = result;

                data = JSON.parse(result);
                currBeerJSON = data;

                showFullJson();


            }
            else if (request.readyState == 4 && request.status != 200) {
                document.getElementById("data").innerHTML = "Something is wrong!  Check the logs to see where this went off the rails";
            }
            else if (request.readyState == 3) {
                document.getElementById("data").innerHTML = "Too soon!  Try again";
            }

        }
    // Step 4: fire off the HTTP request
        request.send();
        //console.log("4 - Request sent");
    }

    //Should be working
    function getDataAsJSON(input) {

        /* Step 1: Make instance of request object...
        ...to make HTTP request after page is loaded*/
        request = new XMLHttpRequest();
        console.log("1 - request object created");

        // Step 2: Set the URL for the AJAX request to be the JSON file

        var url = "https://api.punkapi.com/v2/beers?ids=" + input;

        request.open("GET", url, true)
        console.log("2 - opened request file");

        // Step 3: set up event handler/callback

        request.onreadystatechange = function() {
            console.log("3 - readystatechange event fired.");
            if (request.readyState == 4 && request.status == 200) {
                // Step 5: wait for done + success
                console.log("5 - response received");

                result = request.responseText;
                currBeer = result;
                //alert("result - " + result);
                //pastLikedBeers = result;

                data = JSON.parse(result);
                pastLikedBeers = data;
                showFullJson2();
            } else if (request.readyState == 4 && request.status != 200) {
                // document.getElementById("data").innerHTML = "Something is wrong!  Check the logs to see where this went off the rails";
            } else if (request.readyState == 3) {
                // document.getElementById("data").innerHTML = "Too soon!  Try again";
            }

        }
    // Step 4: fire off the HTTP request
        request.send();
        console.log("4 - Request sent");
    }

    function showFullJson() {
        a = document.getElementById("data");
        showBeer(currBeerJSON[0], a);
    }

    function showFullJson2() {
        // a = document.getElementById("data");
        // showBeer(pastLikedBeers[0], a);

        // likedBeersJSON.push(pastLikedBeers[0]);
        // insert(likedBeers, pastLikedBeers[0]["id"], pastLikedBeers[0]["name"]);
        for(i = 0; i < numberLiked; i++){
            likedBeersJSON.push(pastLikedBeers[i]);
            insert(likedBeers, pastLikedBeers[i]["id"], pastLikedBeers[i]["name"]);
        }
    }

    //TODO: Madeline or Sean
    function showBeer(beer, a){
        a.innerHTML = "";
        a.innerHTML += "<h2>" + beer["name"] +"<h2>";
        a.innerHTML += "<br>";
        a.innerHTML += "<img src='" + beer["image_url"] + "' height=300 />";
        a.innerHTML += "<p>" + beer["description"] + "<p>";
        a.innerHTML += "<br><br><br>"
        //a.innerHTML += "<h2>" + beer["id"] +"<h2>";
    }

    //TODO: Madeline or Sean
    function showBeerJSON(beer){
        output = "";
        output += "<h2>" + beer["name"] +"<h2>";
        output += "<br>";
        output += "<img src='" + beer["image_url"] + "' height=300 />";
        output += "<p>" + beer["description"] + "<p>";
        return output;
    }

    function nextBeer() {
        //alert("show next beer");
        beerID++;
        document.getElementById("currBeerForm1").value = beerID;
        getData();
    }

    function addCurrBeer() {

        insert(likedBeers, currBeerJSON[0]["id"], currBeerJSON[0]["name"]);
        likedBeersJSON.push(currBeerJSON[0]);
        f = document.getElementById("likedBeersArr");

        f.innerHTML = showArray(likedBeers);
        //adding to the form
        document.getElementById("addLikedForm1").value = "yes_liking"; //new


    }

    function showArray(arr){
        var output = "";
        for(key in arr)
        {
            // output += "(" + arr[key].id + ") " + arr[key].beer + " | ";
            output += arr[key].beer + " | ";
        }
        return output;
    }

    function insert(arr, id, beer) {
        arr.push({
            id: id,
            beer: beer
        });
    }

    function compareBeer(){

        $("#back").show();

        $("#dislike").hide();
        $("#like").hide();

        var username2 = prompt("Please Enter Your Friend's Username", "user0001");
        //var username2 = "ab";
        //todo we don't need this anymore
        // var input = prompt("Enter Friend's Beers they like", "1,3,4,5");
        // var arr = input.split(",");

        // var commonBeers = [];

        // for(key in likedBeers)
        // {
        //     var thisID = (likedBeers[key].id).toString();
        //     if(arr.includes(thisID)){
        //         commonBeers.push(likedBeers[key].id);
        //     }
        // }

        a = document.getElementById("data");
        a.innerHTML = "";



        // if(commonBeers.length == 0){
        //     a.innerHTML += "No Liked Beers";
        // }else{
        //     a.innerHTML += "<h2>" + username + " and " + username2 + " - Get Brewing!</h2>";
        //     a.innerHTML += "<ul>";

        //     n = likedBeersJSON.length - 1;

        //     for(i = n; i > -1; i--)
        //     {
        //         //alert( arr + " - " + (likedBeersJSON[i]["id"]).toString() );
        //         if(arr.includes( (likedBeersJSON[i]["id"]).toString() )){
        //             a.innerHTML += "<li>" + showBeerJSON(likedBeersJSON[i]) + "</li>";
        //         }
        //     }
        //     a.innerHTML += "</ul>";
        //     a.innerHTML += "<br><br><br>";
        // }

        document.getElementById("comparison").value = "yes_comparing"; //new
        document.getElementById("friend").value = username2; //new
        document.getElementById("addLikedForm1").value = "not_liking"; //new
        document.getElementById("user").value = username;
        // <input type="text" id="user" name="u1" value="">
    }

    function startSwiping(){

        $("#dislike").show();
        $("#like").show();
        $("#compare").show();
        $("#liked").show();
        $("form").show();
        $("#data").show();

        if(prevLiked != ""){
            //alert("Setting prev liked");
            setLikedBeers(prevLiked);
            prevLiked = "";
        }

        $("#ss").hide();
        $("#messy").hide();
        $("#messy-v").hide();
    }

    function showLiked(){

        $("#back").show();

        $("#dislike").hide();
        $("#like").hide();

        a = document.getElementById("data");
        a.innerHTML = "";

        if(likedBeers.length == 0){
            a.innerHTML += "No Liked Beers";
        }else{
            a.innerHTML += "<ul>";

            n = likedBeersJSON.length - 1;

            for(i = n; i > -1; i--)
            {
                a.innerHTML += "<li>" + showBeerJSON(likedBeersJSON[i]) + "</li>";
            }
            a.innerHTML += "</ul>";
            a.innerHTML += "<br><br><br>";
        }
    }

    function backToSwiping(){


        $("#back").hide();

        $("#dislike").show();
        $("#like").show();

        getData();
    }

    function setLikedBeers(input) {

        getDataAsJSON(prevLiked);
        //alert( showBeerJSON(beerJSON[0]) );
        //alert("the thingy - " + pastLikedBeers);
    }


    //functions needed for loading the webpage
    window.onload = function() {

        $("#back").hide();
        $("#dislike").hide();
        $("#like").hide();
        $("#compare").hide();
        $("#liked").hide();
        $("form").hide();
        $("#data").hide();

        //beerID = 1;
        //username = prompt("Please Enter Your Username", "user0000");
        username = "mgm"; // should be current user
        document.getElementById("usernameForm1").value = username;

        x = document.getElementById("username");

        x.innerHTML = "<h2>" + username + "</h2>";


        //beerID = prompt("Please enter user's currBeerID", 4);
        beerID = 3;
        document.getElementById("currBeerForm1").value = beerID;

        //TODO
        //prevLiked = prompt("Please enter current Liked Beers", "1|2|3");
        prevLiked = "1|2|3";
        numberLiked = prevLiked.length;

        numberLiked = (numberLiked/2) + .5;

        //alert("array [" + prevLiked + "] becomes [" + prevLiked.length + "] and then - " + numberLiked);

        getData();

        a = document.getElementById("dislike");
        b = document.getElementById("like");
        c = document.getElementById("compare");
        d = document.getElementById("liked");
        e = document.getElementById("back");
        f = document.getElementById("ss");

        a.onclick = function() {
            nextBeer();
            document.getElementById("addLikedForm1").value = "disliking";
        }
        b.onclick = function()
        {
            addCurrBeer();
            nextBeer();
        }

        // c.onclick = function() { compareBeer(); }
        // c.onclick = function() { fetchData("pons"); }
        d.onclick = function() { showLiked(); }

        e.onclick = function() { backToSwiping(); }
        f.onclick = function() { startSwiping(); }

    }
