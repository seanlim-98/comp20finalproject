var http = require('http');
var url = require('url');
var fs = require('fs');
const { resolveInclude } = require('ejs');
const { resolve } = require('path');
var correctLogin = false;
var express = require('express')();

http.createServer(function (req, res) {
    //console.log("WE ARE IN THE SERVER YO");
    // var http = require('http');
    // var url = require('url');
    res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write("we are in the server !!!!!!!!!!!!!");
    var url_info = url.parse(req.url, true).query;
    console.log(url_info);

    // username
    var uname = url_info.uf1;
    console.log("uname: " + uname);

    var uname_from_compare = url_info.u1;
    console.log("uname_from_compare: " + uname_from_compare);
    //var user_arr = new Array();

    // beer ID
    var beer_id = url_info.cbeer;
    console.log("beer_id: " + beer_id);

    var is_liking = url_info.is_adding_liked;
    console.log("is_liking: " + is_liking);

    var is_comparing = url_info.is_comparing;
    console.log("is_comparing: " + is_comparing);

    //<input type="text" id="friend" name="u2" value="--">
    var friend = url_info.u2;
    console.log("friend: " + friend);
    //var friend_arr = new Array();

    // connect to MongoDB
    const MongoClient = require('mongodb').MongoClient;

    //get the url
    url_at_mongo =
    "mongodb+srv://tempuser:heylookitsMONGODB2001@cluster0.f5arw.mongodb.net/final-project?retryWrites=true&w=majority";
    //console.log("set up and retrieved url");

    // execute the connect
    MongoClient.connect(url_at_mongo, function(err, db) {
        //console.log("in connect");
        if(err) { return console.log(err); }

        // get database
        var dbo = db.db("final-project");
        //console.log("database retrieved");

        //get collection
        var collection = dbo.collection('users');
        //console.log("collection retrieved");

        //functionality to find the query for liking and disliking
        //hit the like button or the dislike button
        if (is_liking == "yes_liking") {
            add_liked_beer(err, db, collection, uname, beer_id);
            res.write("- - - after liking - - -");
        } else if (is_liking == "disliking"){
            dislike_beer(err, db, collection, uname, beer_id);
            res.write("- - - after disliking - - -");
        }

        //checking the comparing stuff
        if (is_comparing == "yes_comparing") {
            var user_arr = new Array();
            var friend_arr = new Array();
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    var user_friend = new Array();
                    collection.find().toArray(function(err, items) {
                        for (i = 0; i < items.length; i++) {
                            if (items[i].username == uname_from_compare) {
                                for (var j = 0; j < items[i].liked.length; j++) {
                                    var curr = (items[i].liked)[j];
                                    user_arr.push(curr);
                                }
                                break;
                            }
                        }
                        err ? reject(err) : 
                        user_friend.push(user_arr);
                    });
                    collection.find().toArray(function(err, items) {
                        for (i = 0; i < items.length; i++) {
                            if (items[i].username == friend) {
                                for (var j = 0; j < items[i].liked.length; j++) {
                                    var curr = (items[i].liked)[j];
                                    friend_arr.push(curr);
                                }
                            }
                        }
                        err ? reject(err) : user_friend.push(friend_arr);
                        resolve(user_friend);
                    });
                });
            };

            var callMyPromise = async () => {
                var result = await (myPromise());
                return result;
             };
            
            callMyPromise().then(function(result) {
                // check that we wait for everything in db to be accessed before getting final thing
                var user_liked = result[0];
                var friend_liked = result[1];
                var common_liked = get_common_liked(user_liked, friend_liked);
                console.log(common_liked);
            });
        }

        // res.end();
    }); // end of connect

}).listen(8080);

function get_common_liked(arr1, arr2) {
    var common = [];
  
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i] == arr2[j]) { 
                common.push(arr1[i]);
            }
        }
    }
    return common;
}

// express.get("/", (req, res) => { res.send("Hello World"); });
// express.listen(8080, () => {
//     console.log("Server online on http://localhost:8080");
// });

// async function comparing(collection, uname_from_compare, friend){
//     // create new arrays
//     var friend_arr = new Array();
//     var user_arr = new Array();
   
//     console.log("we are COMPARING! \n\n");
    
//     // for the user
//     let promise = new Promise((resolve, reject) => {
//         collection.find().toArray(function(err, items) {
//             for (i = 0; i < items.length; i++) {
//                 if (items[i].username == uname_from_compare) {
//                     for (var j = 0; j < items[i].liked.length; j++) {
//                         var curr = (items[i].liked)[j];
//                         user_arr.push(curr);
//                     }
//                     break;
//                 }
//             }
//         });
//         resolve(user_arr);
//     });

//     let updated_user_arr = await promise;

//     // for friend
//     let promise2 = new Promise((resolve, reject) => {
//         collection.find().toArray(function(err, items) {
//             for (i = 0; i < items.length; i++) {
//                 if (items[i].username == friend) {
//                     for (var j = 0; j < items[i].liked.length; j++) {
//                         var curr = (items[i].liked)[j];
//                         friend_arr.push(curr);
//                     }
//                 }
//             }
//         });
//         resolve(friend_arr);
//     });

//     let updated_friend_arr = await promise2; 


//     console.log(updated_user_arr.length);
//     console.log(updated_friend_arr.length);

//     //testing(user_arr, friend_arr);
//     //res.end("- - - end - - -");
// }

// /* Server to check for existing user's login details */
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     var url_info = url.parse(req.url, true).query;
//
//     // username
//     var uname = url_info.username;
//
//     // beer ID
//     var pw = url_info.password;
//
//     // connect to MongoDB
//     const MongoClient = require('mongodb').MongoClient;
//
//     //get the url
//     url_at_mongo =
//     "mongodb+srv://tempuser:heylookitsMONGODB2001@cluster0.f5arw.mongodb.net/final-project?retryWrites=true&w=majority";
//
//     // execute the connect
//     MongoClient.connect(url_at_mongo, function(err, db) {
//         if(err) { console.log("uh oh"); return console.log(err); }
//
//         // get database
//         var dbo = db.db("final-project");
//         //console.log("database retrieved");
//
//         //get collection
//         var collection = dbo.collection('users');
//         //console.log("collection retrieved");
//
//         check_user_exists(uname, pw, collection);
//         //functionality to find the query
//     }); // end of connect
//
//     if (correctLogin == true) {
//         console.log('reached here');
//
//         // HOW TO REDIRECT TO INDEX.HTML?????
//
//         correctLogin = false;
//         res.end();
//     }
// }).listen(8000);
//
// /* Server to add new user to database */
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     var url_info = url.parse(req.url, true).query;
//     var uname = url_info.username;
//     var pw = url_info.password;
//
//     // connect to MongoDB
//     const MongoClient = require('mongodb').MongoClient;
//     url_at_mongo =
//     "mongodb+srv://tempuser:heylookitsMONGODB2001@cluster0.f5arw.mongodb.net/final-project?retryWrites=true&w=majority";
//
//     // execute the connect
//     MongoClient.connect(url_at_mongo, function(err, db) {
//         if(err) { return console.log(err); }
//         var dbo = db.db("final-project");
//         var collection = dbo.collection('users');
//
//         add_new_user(uname, pw, collection);
//     });
//
//     // HOW TO REDIRECT TO INDEX.HTML????
//
//     res.end();
// }).listen(8001);

function add_liked_beer (err, db, collection, uname, beer_id) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write("inside the add_liked_beer function");
    console.log("inside the add_liked_beer function");
    console.log("uname: " + uname);
    console.log("beer_id: " + beer_id);

    var currUser = {"username": uname};
    collection.updateOne(
       currUser,
       { $push: { liked: beer_id } },
       {
         upsert: false,
       }
    )
    db.close();
    // res.end("end --------");
}

function dislike_beer (err, db, collection, uname, beer_id) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write("inside the dislike_beer function");
    console.log("inside the dislike_beer function");
    console.log("uname: " + uname);
    console.log("beer_id: " + beer_id);

    var currUser = {"username": uname};
    collection.update(
        currUser,
        { $pull: { liked: { $in: [beer_id] } } },
        { multi: true}
    )
    db.close();
    //res.end("YO");
}

function check_user_exists (un, pw, collection) {
    collection.find().toArray(function(err, items) {
        for (i = 0; i < items.length; i++) {
            if (items[i].username == un) {
                if (items[i].password == pw) {
                    correctLogin = true;
                    return;
                }
            }
        }
    })
    correctLogin = false;
}

function add_new_user(un, pw, collection) {
    // Haven't actually tested
    collection.insertOne(
        {
            "username": un,
            "password": pw
        },
        {
          upsert: false,
        }
     )

    collection.find().toArray(function(err, items) {
        for (i = 0; i < items.length; i++) {
            console.log(items[i]);
        }
    })
}
