var express  = require("express"),
    app      = express(),
    bodyParser = require("body-parser"),
    request  = require("request"),
    mongoose = require("mongoose");

//App Config
var port = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/movie-app", {useMongoClient: true});

var commentSchema = new mongoose.Schema({
    imdb: String,
    name: String,
    text: String
});

var Comment = mongoose.model("Comment", commentSchema);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})); 

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
            Comment.find({imdb: req.params.id}, function(err, comments){
                if(err){
                    console.log(err);
                } else {
                     res.render("show", {data: data, comments: comments});
                }
            });
        } else {
            console.log(response.statusCode);
        }
    });
});

app.get("/movies/:id/comments/new", function(req, res){
    console.log(req.params.id);
    res.render("newComment", {id: req.params.id});
});

app.post("/movies/:id/comments", function(req, res){
    Comment.create(req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        } else {
            console.log(comment);
            res.redirect("/movies/"+req.params.id);
        }
    });
});
//Start Server
app.listen(port, function(){
    console.log("Server Started!");
});