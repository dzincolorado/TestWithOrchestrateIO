//functions to pull movie data from orchestrate

var settings = require("../utility/settings");
var orchestrate = require("orchestrate")(settings.getSettings.orchestrateKey());

//get list of genres
exports.genres = function(response){
    orchestrate.list("genres")
        .then(function(result){
            var genres = result.body.results;
            
            response.render("genre", {
                genres : genres
            });
            
        }).fail(function(err){
            
        });   
}