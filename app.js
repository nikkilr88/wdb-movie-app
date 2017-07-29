var express = require("express");
var request = require("request");
var app = express();

//App Config
var port = process.env.PORT || 8080;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("search");
});

//Results Page
app.get("/movies", function(req, res){
    var query = req.query.search;
    //Remove extra spaces
    for(var i = query.length-1; i > 0; i--){
        if(query[i] === " " && query[i+1] === undefined){
            query = query.substring(0, query.length-1);
        }
    }
    
    var url = "http://www.omdbapi.com/?s="+query+"&apikey=thewdb"
    
    request(url, function(error, response, body){
        if(error){
            console.log(error);
        }
        if(!error && response.statusCode === 200){
            var data = JSON.parse(body);
            res.render("results", {data: data});
        }
    });
});

//Show Route
app.get("/movies/:id", function(req, res){
    var id = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + id + "&apikey=thewdb";
    
    request(url, function(error, response, body){
        if(!error && response.statusCode === 200){
            var data = JSON.parse(body);
            res.render("show", {data: data});
        } else {
            console.log(response.statusCode);
        }
    });
});

//Start Server
app.listen(port, function(){
    console.log("Server Started!");
});