var spawn = require('child_process').spawn;

module.exports = function(app) {
  app.get('/api/pacman', function(req, res) {
    // returns a list of all installed packages
    response = {};
    response.success = false;
    packages = [];

    filter = req.query.filter;
    console.log("filter: " + filter);

    // default: list all installed packages
    // for performance reasons, we could use also -Qe
    var packagelist = spawn('pacman', ["-Sl"]);
    
    packagelist.stdout.on('data', function (data) {
      var packagelines = data.toString().split("\n");
      for(i in packagelines) {  
        if ( packagelines[i].match("^\ ") ) return;
        if ( packagelines[i].match("^\:") ) return;
        var packagesplit = packagelines[i].split(" ");
        var isInstalled;
        // problem herre is localization as well ;-(          
        if (packagesplit[3] != undefined) { 
          console.log("package is installed");
          isInstalled = true;
        } else {
          console.log("package is not defined: " + packagesplit[4]);
          isInstalled = false;
        }

        if (filter == undefined || filter == 'all' || (filter == 'installed' && isInstalled)) {
          var package = { repo: packagesplit[0], name: packagesplit[1], version: packagesplit[2], installed: isInstalled };
          packages.push(package);       
        }
      }
    });

    packagelist.on('exit', function (code) {
      if (code == 0) {
        response.success = true;
        response.packages = packages;
      }
      res.json(response);
    });
  });

  app.get('/api/pacman/:packageName', function(req, res) {
    response = {};
    response.success = false;
    packageName = req.params.packageName;
    package = {};
/** 
    pacman is delivering only localized content, by no means made for an api, we are delivering back the information line
    by line, in future versions, we are going to use libalpm informaitons
**/
    var packageInformation = spawn('pacman', ["-Si", packageName]); //-Qi for detailed information about local packages, -Si seems to be a better choice here
    var packageArray = [];
    
    packageInformation.stdout.on('data', function (data) {
      var infoLines = data.toString().split("\n");
      for(line in infoLines) {  
        if ( infoLines[line].match("^\ ") ) return;
        if ( infoLines[line].match("^\:") ) return;
        var packagesplit = infoLines[line].split(" : ");

        packageArray[line] = packagesplit[1];

        if (line >= 2) {
          package = { repo: packageArray[0], name: packageArray[1], version: packageArray[2], installed: false };
          packageArray = [];
          return;         
        }
      }
    });

    packageInformation.on('exit', function (code) {
      if (code == 0) {
        response.success = true;
        response.package = package;
      }
      res.json(response);
    });

  });

  app.delete("/api/pacman/:packageName", function(req, res){
    response = {};
    response.success = false;
    packageName = req.params.packageName;

    // remove a package    
  });

/**
    else if ( apicmd == "list_upgrades" ) {
      var packagelist = spawn('pacman', ["-Syup","--print-format","'%n %v'"]);
      packagelist.stdout.on('data', function (data) {
        response.upgradelist.push(data);
      });

      packagelist.on('exit', function (code) {
        if (code == 0) {
          response.success = true;
        }
        res.json(response);
      });
    }
    else if ( apicmd == "do_upgrade" ) {
      var packagelist = spawn('pacman', ["-Syu","--noconfirm","--noprogressbar"]);
      packagelist.stdout.on('data', function (data) {
        response.upgraderesult.push(data);
      });

      packagelist.on('exit', function (code) {
        if (code == 0) {
          response.success = true;
        }
        res.json(response);
      });
    }   
  });
**/  
}
