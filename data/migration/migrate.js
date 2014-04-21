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

function pushResults(err, results){
    
    //TODO: use promises?
    if(err) console.log(err);
    else{
        console.log(results.results[0].id);   
        /*results.results.forEach(function(movie){
            orchestrate.put(
                "movies"
                , movie.id
                , {
                    originalTitle: movie.original_title
                    , title: movie.title
                    , releaseDate: movie.release_date
                    , posterPath: movie.poster_path
            });
        });*/
    }
}

function processMoviesByGenre(result){
    
    var pageCounter = 1;
    //TODO: use promises?
    externalMovieDb.genreMovies(
      {
        id: result.path.key
        , page: pageCounter
        , include_all_movies: true
      }
      , pushResults
    )
}

function processGenre(result){
    
    result.body.results.forEach(processMoviesByGenre);
}

exports.pushMoviesByGenreToOrchestrate = function(){
    
    //orchestrate.deleteCollection("movies);
    //Limit to 100 genres for now
    orchestrate.list("genres", {limit: 100}).then(processGenre);
}