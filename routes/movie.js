var moviedb = require("../data/moviedb");

exports.getGenres = function(request, response){
    
    moviedb.genres(response);
}