var settings = require("../utility/settings");
var orchestrate = require("orchestrate")(settings.getSettings.orchestrateKey());
var movieDb = require("moviedb")(settings.getSettings.movieDbApiKey());//Would usually pull value from either config or Db.

exports.getGenres = function(request, response){
    movieDb.genreList(function(err, res){
        
        /*
        var i = 1;
        orchestrate.put("genres", i, {
            
        }).then(function(result){
            
        }).fail(function(err){
            
        });
        */
        
        //console.log("genre object : " + res["genres"]);
        
        response.render("genre", {
            genres : res["genres"]
        });
        
    });
}