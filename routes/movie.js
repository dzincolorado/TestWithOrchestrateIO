var settings = require("../utility/settings");
var orchestrate = require("orchestrate")(settings.getSettings.orchestrateKey());

exports.getGenres = function(request, response){
    
    //TODO: refactor to move this to data/moviedb.js
    orchestrate.list("genres")
    .then(function(result){
        var genres = result.body.results;
        
        response.render("genre", {
            genres : genres
        });
        
    }).fail(function(err){
        
    });
}