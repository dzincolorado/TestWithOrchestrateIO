exports.getData = function(req, res, http){
    //var url = "http://www.ncdc.noaa.gov/cdo-web/api/v2/datasets";
    
    var options = {
        host: "www.ncdc.noaa.gov",
        port: 80,
        path: "/cdo-web/api/v2/datasets",
        headers: {Token: "ftSRYvoDmvbzBeQaYWbvmAEzoPLVmMtK"}
    };
    
    http.get(options, function(res){
        var body = "";
        
        res.on("data", function(chunk){
            body += chunk;
        });
        
        res.on("end", function(){
            var jsonData = JSON.parse(body);
            
            console.log("Got response: " + jsonData.uid);
        });
    }).on("error", function(e){
        console.log("Got error: " + e);
    });
    
    
    res.render('index', { title: 'Getting data' })
};