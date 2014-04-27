//Functions to pull data from The Movie Db and push to Orchestrate

var settings = require("../../utility/settings");
var orchestrate = require("orchestrate")(settings.getSettings.orchestrateKey());
var externalMovieDb = require("moviedb")(settings.getSettings.movieDbApiKey());//Would usually pull value from either config or Db.
var movieRepoConstants = require("../movieRepo").constants;

exports.pushGenresToOrchestrate = function(){
    externalMovieDb.genreList(function(err, res){
        
        res["genres"].forEach(function(genre){
            orchestrate.put(movieRepoConstants.GENRE_COLLECTION_NAME, genre.id, {
                name: genre.name
            }).then(function(result){
                
            }).fail(function(err){
                console.log("orchestrate error: " + err)
            });   
        });
        
        //console.log("genre object : " + res["genres"]);
        
    });
}

function processMoviesByGenre(result, pageIndex){
    
    var pageCounter = (typeof pageIndex === "undefined") ? 1 : pageIndex;
    pageCounter = (pageCounter === 0) ? 1 : pageCounter;
    console.log(result.path.key + ":" + pageCounter + ":");
    
    //opting to not use promises to push as much data as quickly as possible
    externalMovieDb.genreMovies(
      {
        id: result.path.key
        , page: pageCounter
        , include_all_movies: true
      }
      , function(err, results){
    
            if(err) console.log(err);
            else{
                
                console.log("page count: " + pageCounter + " for genre key: " + result.path.key + ":" + movieRepoConstants.MOVIE_COLLECTION_NAME + ":");   
                results.results.forEach(function(movie){
                    orchestrate.put(
                        movieRepoConstants.MOVIE_COLLECTION_NAME
                        , movie.id
                        , {
                            originalTitle: movie.original_title
                            , title: movie.title
                            , releaseDate: movie.release_date
                            , posterPath: movie.poster_path
                    }).then(function(result){ //use a promise here because movie must exist to build the graph
                        console.log(JSON.stringify(result));
                        orchestrate.newGraphBuilder()
                        .create()
                        .from(movieRepoConstants.MOVIE_COLLECTION_NAME, movie.id)
                        .related("is")
                        .to(movieRepoConstants.GENRE_COLLECTION_NAME, result.path.key);
                    });
                });
                
                if(results.results.length > 0){
                    var i = pageCounter + 1;
                    //recurse through all pages
                    processMoviesByGenre(result, i);
                }
            }
        }
    )
}

function processGenre(result){
    
    result.body.results.forEach(processMoviesByGenre);
}

exports.pushMoviesByGenreToOrchestrate = function(){
    
    //orchestrate.deleteCollection(movieRepoConstants.MOVIE_COLLECTION_NAME);
    //Limit to 100 genres for now
    orchestrate.list(movieRepoConstants.GENRE_COLLECTION_NAME, {limit: 100}).then(processGenre);
}

exports.clearData = function(){
    orchestrate.deleteCollection(movieRepoConstants.MOVIE_COLLECTION_NAME);
}