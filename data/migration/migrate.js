//Functions to pull data from The Movie Db and push to Orchestrate

var settings = require("../../utility/settings");
var orchestrate = require("orchestrate")(settings.getSettings.orchestrateKey());
var externalMovieDb = require("moviedb")(settings.getSettings.movieDbApiKey());//Would usually pull value from either config or Db.

//var localMovieDb = require("../routes/movie");

exports.pushGenresToOrchestrate = function(){
    externalMovieDb.genreList(function(err, res){
        
        res["genres"].forEach(function(genre){
            orchestrate.put("genres", genre.id, {
                name: genre.name
            }).then(function(result){
                
            }).fail(function(err){
                console.log("orchestrate error: " + err)
            });   
        });
        
        //console.log("genre object : " + res["genres"]);
        
    });
}

exports.pushMoviesByGenreToOrchestrate = function(){
    
    //TODO: I have duplicate code in routes/movie.js to get the list of genres.  Need to refactor use Promises!
    orchestrate.list("genres").then(function(result){
       console.log(result.body.results[0]); 
    });
}