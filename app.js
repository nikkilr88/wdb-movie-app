var express = require("express");
var request = require("request");
var app = express();

var port = process.env.PORT || 8080;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("search");
});

app.get("/movies", function(req, res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s="+query+"&apikey=thewdb"
    
    request(url, function(error, response, body){
        if(!error && response.statusCode === 200){
            var data = JSON.parse(body);
            res.render("results", {data: data});
        }
    });
});

app.get("/movies/:id", function(req, res){
    var id = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + id + "&apikey=thewdb";
    
    request(url, function(error, response, body){
        if(!error && response.statusCode === 200){
            var data = JSON.parse(body);
            res.render("show", {data: data});
        }
    });
});

app.listen(port, function(){
    console.log("Server Started!");
});