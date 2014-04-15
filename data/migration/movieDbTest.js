var settings = require("../../utility/settings");
var externalMovieDb = require("moviedb")(settings.getSettings.movieDbApiKey());//Would usually pull value from either config or Db.
var promise = require("promise");//promises from A+
var Q = require("kew");
//var promise = require("promisejs");

//regular callback style
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

//uses promises/A+
function getMovieListPromise(currentPage, genreId){
    
    var p = new promise(function(reject, resolve){
        externalMovieDb.genreMovies(
          {
            id: genreId
          , page: currentPage
          , include_all_movies: true
          })
          , function(err, results){
                if(err) reject(err);
                else
                {
                    resolve(results).then(function(str){
                        console.log("Total Results: " + results[0].original_title);
                        console.log("Current Page: " + results.page);
                        console.log("Total Pages: " + results.total_pages); 
                        
                            if(parseInt(results.total_pages, 10) > 0 && parseInt(results.total_results, 10) > 0 ){
                                currentPage++;
                                getMovieListPromise(currentPage, genreId);
                            }
                    });
                }
          }
        });
}

//uses kew
function getMovieListKewPromise(currentPage, genreId){
    externalMovieDb.genreMovies(
      {
        id: genreId
      , page: currentPage
      , include_all_movies: true
      }, function(err, results){
          if(err) 
          {
              console.log("failing promise: " + err);
              Q.reject(err);
          }
          else
          {
              console.log("success promise: " + results.page);
              console.log("currentPage: " + currentPage);
              if(parseInt(results.total_pages, 10) > 0 && parseInt(results.total_results, 10) > 0)
              {
                  //once promise is resovled, then recursively call self
                  Q.resolve(results)
                  .then(function(result){
                      currentPage++;
                      getMovieListKewPromise(currentPage, genreId);
                  });
              }
          }
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
    
    //use kew promises
    getMovieListKewPromise(currentPage, genreId);
    
    //uses promises/A+
    //TODO: need to fix issues that appear with this promise module
    //getMovieListPromise(currentPage, genreId);
}

function TestMoviesByGenreWithAsync(genreId){
    
}


//Run test w/ regular callback
//TestMoviesByGenreWithCallbacks(16);

//Run test w/ promise
TestMoviesByGenreWithPromises(16);