var args;
var movieDbKey;
var oKey;

function getSettings(){
    args = process.argv[2].split(";");
    movieDbKey = args[0].split(":")[1];
    oKey = args[1].split(":")[1];
}

getSettings.prototype.movieDbApiKey = function(){
    return movieDbKey;
}

getSettings.prototype.orchestrateKey = function(){
    return oKey;
}

exports.getSettings = new getSettings();