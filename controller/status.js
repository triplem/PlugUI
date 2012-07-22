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
    response.freemem    = prettysize(os.freemem());
    usedmem             = os.totalmem() - os.freemem();
    response.usedmem    = prettysize(usedmem);
    response.totalmem   = prettysize(os.totalmem());
    response.loadavg    = os.loadavg()[0].toFixed(2);
    response.uptime     = prettytime(os.uptime());
    response.version    = app.settings.packageJson.version;
  //  console.log("Response constructed");
    res.json(response);
  });  
}

function prettysize(bytes) {
  if (bytes == 0) {
    $('#filesize').text('Zero' );
  }
  
  else if (bytes >= 1000000000000) {
    //tb
    var terabytes =  bytes / 1000000000000;
    return terabytes.toFixed(1) + ' TB';
  }
  else if (bytes >= 1000000000) {
    //gb
    var gigabytes = bytes / 1000000000;
    return gigabytes.toFixed(1) + ' GB';
  }
  else if (bytes >= 1000000) {
    //mb
    var megabytes = bytes / 1000000;
    return megabytes.toFixed(1) + ' MB';
  }
  else if (bytes >= 1000) {
    //kb
    var kilobytes = bytes / 1000;
    return  kilobytes.toFixed(1) + ' KB';
    
  }
  else {
    return bytes.toFixed(1)  + ' B';
  } 
}

function prettytime(seconds) {
  var numdays = Math.floor(seconds / (60 * 60 * 24));
  var numhours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  if (numhours < 10) {
    numhours = "0" + numhours;
  }

  var numminutes = Math.floor(((seconds % (60 * 60 * 24)) % (60 * 60)) / 60);
  if (numminutes < 10) {
    numminutes = "0" + numminutes;
  }

  var numseconds = ((seconds % (60 * 60 * 24)) % (60 * 60)) % 60;
  numseconds = numseconds.toFixed(0);
  if (numseconds < 10) {
    numseconds = "0" + numseconds;
  }


  return numdays + " days " + numhours + ":" + numminutes + ":" + numseconds;
}


