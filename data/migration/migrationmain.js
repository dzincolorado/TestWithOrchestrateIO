//usage: node data/migration/migrationmain "moviedbAPiKey:xxxx;orchestrateApiKey:xxxx"
var migrate = require("./migrate");

migrate.pushMoviesByGenreToOrchestrate();