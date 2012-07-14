var os = require('os');

module.exports = function(app) {
  var logger = app.settings.logger;

  logger.info("starting api-call to status");

  // API for status
  app.get('/api/status', function(req,res) {
    logger.info("receiving call on /api/status");
    response = {};
  //  console.log("Constructing status response");
    response.success    = true;
    response.hostname   = os.hostname();
    response.type       = os.type();
    response.arch       = os.arch();
    response.platform   = os.platform();
    response.release    = os.release(); 
    response.freemem    = os.freemem();
    response.usedmem    = os.totalmem() - os.freemem();
    response.totalmem   = os.totalmem();
    response.loadavg    = os.loadavg();
    response.uptime     = os.uptime();
    response.version    = app.settings.packageJson.version;
  //  console.log("Response constructed");
    res.json(response);
  });  
}

