//Functions to pull data from The Movie Db and push to Orchestrate

var settings = require("../utility/settings");
var orchestrate = require("orchestrate")(settings.getSettings.orchestrateKey());
var externalMovieDb = require("moviedb")(settings.getSettings.movieDbApiKey());//Would usually pull value from either config or Db.

var localMovieDb = require("../routes/moviedb");

exports.pushGenresToOrchestrate = function(){
    movieDb.genreList(function(err, res){
        
        res["genres"].forEach(function(genre){
            orchestrate.put("genres", genre.id, {
                name: genre.name
            }).then(function(result){
                
            }).fail(function(err){
                console.log("orchestrate error: " + err)
            });   
        });
        
        //console.log("genre object : " + res["genres"]);
        
        response.render("genre", {
            genres : res["genres"]
        });
        
    });
}

exports.pushMoviesByGenreToOrchestrate = function(){
    
}