const express = require('express');
const app = express();
const url = require('url');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const port = 3000;

var currUser;

// app.set('view engine', 'ejs'); 

app.engine('html', require('ejs').renderFile); 
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static('./'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/loginpage.html'));
});

// app.post('/signup', function(request, response) {
//     var username = request.body.username;
//     var password = request.body.password;

//     const MongoClient = require('mongodb').MongoClient;
//     url_at_mongo =
//     "mongodb+srv://tempuser:heylookitsMONGODB2001@cluster0.f5arw.mongodb.net/final-project?retryWrites=true&w=majority";
    
//     MongoClient.connect(url_at_mongo, function(err, db) {
//         if(err) { return console.log(err); }
//         var dbo = db.db("final-project");
//         var collection = dbo.collection('users');

//         collection.insertOne({
//             username: username,
//             password: password
//         });

//         request.session.loggedin = true;
//         request.session.username = username;
//         response.redirect('/logincheck'); 
//     }); 
// });

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    const MongoClient = require('mongodb').MongoClient;
    url_at_mongo =
    "mongodb+srv://tempuser:heylookitsMONGODB2001@cluster0.f5arw.mongodb.net/final-project?retryWrites=true&w=majority";
    
    MongoClient.connect(url_at_mongo, function(err, db) {
        if(err) { return console.log(err); }
        var dbo = db.db("final-project");
        var collection = dbo.collection('users');
        collection.find().toArray(function(err, items) {
            for (i = 0; i < items.length; i++) {
                if (items[i].username == username) {
                    if (items[i].password == password) {
                        request.session.loggedin = true;
                        request.session.username = username;
                        currUser = username;
                        response.redirect('/logincheck');
                    } else {
                        response.send('Incorrect password.');
                    }
                } else if (items[i].username != username && i == items.length-1) {
                    response.send("No such username. Please go back and click on our signup link.");
                }
            }
        });
    }); 
});



app.get('/logincheck', function(request, response) {
	if (request.session.loggedin == true) {
        response.redirect('/home');    
    } else {
		response.send('Please login to view this page!');
	}
});

app.get('/home', function(request, response) {
    response.sendFile(path.join(__dirname + '/public/index.html')); 
})

app.get('/functionality', function(request, response) {
    var url_info = url.parse(request.url, true).query;
    var is_comparing = url_info.is_comparing;
    console.log("is_comparing: " + is_comparing);

    const MongoClient = require('mongodb').MongoClient;
    url_at_mongo =
    "mongodb+srv://tempuser:heylookitsMONGODB2001@cluster0.f5arw.mongodb.net/final-project?retryWrites=true&w=majority";

    MongoClient.connect(url_at_mongo, function(err, db) {
        if(err) { return console.log(err); }
        var dbo = db.db("final-project");
        var str = "Commonly liked beers between you guys are: ";
        var collection = dbo.collection('users');
        if (is_comparing == "yes_comparing") {
            var user_arr = new Array();
            var friend_arr = new Array();
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    var user_friend = new Array();
                    collection.find().toArray(function(err, items) {
                        for (i = 0; i < items.length; i++) {
                            if (items[i].username == "mgm") {
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
                            if (items[i].username == "sl") {
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
            var common_liked;
            callMyPromise().then(function(result) {
                var user_liked = result[0];
                var friend_liked = result[1];
                common_liked = get_common_liked(user_liked, friend_liked);
                // Turn beer IDs to beer nnames
                for (var i = 0; i < common_liked.length; i++) {
                    str = str + common_liked[i] + "\n";
                }
                response.send(str);
            });
           
        }
    })

    // get liked/disliked/compare things from request.body, based on that pipe into different functions
})

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});