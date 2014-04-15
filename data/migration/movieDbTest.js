var settings = require("../../utility/settings");
var externalMovieDb = require("moviedb")(settings.getSettings.movieDbApiKey());//Would usually pull value from either config or Db.
var promise = require("promise");//promises from A+
//var promise = require("promisejs");

function getMovieList(currentPage, genreId){
    externalMovieDb.genreMovies(
          {
            id: genreId
          , page: currentPage
          , include_all_movies: true
          }
          , function(err, results){
              if(err) {
                  console.log(err);
              }
              else{
                console.log("Total Results: " + results[0].original_title);
                console.log("Current Page: " + results.page);
                console.log("Total Pages: " + results.total_pages); 
                return parseInt(results.total_pages, 10) === 0 ? true: false;
              }
   });
}

//returns a promise
function getMovieListPromise(currentPage, genreId){
    
    var genreMovies = promise.denodeify(externalMovieDb.genreMovies);
    
    var p = genreMovies(
      {
        id: genreId
      , page: currentPage
      , include_all_movies: true
      })
      .then(function(results){
            console.log("Total Results: " + results[0].original_title);
            console.log("Current Page: " + results.page);
            console.log("Total Pages: " + results.total_pages); 
            return parseInt(results.total_pages, 10) === 0 ? true: false;
          }
          , function(err){
            console.log(err);
            return err;
        });
}

//genre id 16
function TestMoviesByGenreWithCallbacks(genreId){
    
    var currentPage = 1;
    var isDone = false;
    while(!isDone)
    {
        console.log("Current Page: " + currentPage);
        isDone = getMovieList(currentPage, genreId);
        if(!isDone){
            currentPage ++;
        }
    }
}

function TestMoviesByGenreWithPromises(genreId){
    var currentPage = 1;
    var isDone = false;
    while(!isDone)
    {
        console.log("Current Page: " + currentPage);
        isDone = getMovieListPromise(currentPage, genreId);
        currentPage++;
        /*var p = getMovieListPromise(currentPage, genreId);
        p.then(function(error, result){
            isDone = p;
            if(!isDone){
                currentPage ++;
            }
        })*/
    }
}

function TestMoviesByGenreWithAsync(genreId){
    
}


//Run test w/ regular callback
//TestMoviesByGenreWithCallbacks(16);

//Run test w/ promise
//TODO: Not working, need to fix
//TestMoviesByGenreWithPromises(16);