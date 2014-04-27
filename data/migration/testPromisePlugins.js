var settings = require("../../utility/settings");
var externalMovieDb = require("moviedb")(settings.getSettings.movieDbApiKey());//Would usually pull value from either config or Db.
var aPlusPromise = require("promise");//promises from A+
var Q = require("kew");
var promisejs = require("promisejs");

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
function getMovieListWithAPlusPromise(currentPage, genreId){
    
    var genreMovies = aPlusPromise.denodeify(externalMovieDb.genreMovies);
    
    var p = genreMovies({
        id: genreId
      , page: currentPage
      , include_all_movies: true
      })
      .then(function(err, results){
            if(err) console.log(results);
            else
            {
                console.log("Total Results: " + results[0].original_title);
                console.log("Current Page: " + results.page);
                console.log("Total Pages: " + results.total_pages); 
                
                    if(parseInt(results.total_pages, 10) > 0 && parseInt(results.total_results, 10) > 0 ){
                        currentPage++;
                        getMovieListWithAPlusPromise(currentPage, genreId);
                    }
            }
        });
}

//uses promisejs
function getMovieListWithPromisejs(currentPage, genreId){

    var p = new promisejs.Promise(); //This seems to fail on the 'new' keyword.  TODO: need to investigate
    externalMovieDb.genreMovies({
        id: genreId
      , page: currentPage
      , include_all_movies: true
      }
      , function(err, results){
            if(err) p.done(err, null);
            else
            {
                console.log("Total Results: " + results);
                
                    if(parseInt(results.total_pages, 10) > 0 && parseInt(results.total_results, 10) > 0 ){
                        p.done(null, results);
                    }
            }
        });
    
    return p;
}

//uses kew
function getMovieListWithKewPromise(currentPage, genreId){
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
                      getMovieListWithKewPromise(currentPage, genreId);
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
    //getMovieListWithKewPromise(currentPage, genreId);
    
    //uses promises/A+
    //TODO: need to fix issues that appear with this promise module
    //getMovieListWithAPlusPromise(currentPage, genreId);
    
    //uses promisejs
    /*
    var p = getMovieListWithPromisejs(currentPage, genreId);
    p.then(function(error, results){
       if(error) console.log(error);
       else{
           console.log("Promise is returned and resolved: Total Pages: " + results.total_pages);
       }
    });
    */
}

function TestMoviesByGenreWithAsync(genreId){
    
}


//Run test w/ regular callback
//TestMoviesByGenreWithCallbacks(16);

//Run test w/ promise
TestMoviesByGenreWithPromises(16);