var fs     = require('fs');
var passwd = require('passwd');

module.exports = function(app) {
  app.get('/api/users', function(req, res){
    response = {};  
    response.success = false;

    passwd.getAll(function(users) {
      console.log("fetching all users");
      // we should make sure, that root is not shown as well ;-(

      response.success = true;
      response.userList = users;
      res.json(response);
    });
  });

  app.get('/api/users/:username', function(req, res){
    response = {};  
    response.success = false;

    username = req.params.username;

    console.log("username: " + username);

    passwd.get(username, function(user) {
      console.log("fetching user");
      response.success = true;
      response.user = user;
      res.json(response);
    });
  });

  app.put('/api/users', function(req, res){
    response = {};  
    response.success = false;

    var username = req.body.username;
    // note: this is vulnerable to potential attack, 'username; rm -rf /' 
    var useradd = spawn('useradd', [username]);
    useradd.on('exit', function (code) {
      if (code == 0) {
        response.success = true;
      }
      res.json(response);
    });          
  });

  app.delete('/api/users', function(req, res){
    response = {};  
    response.success = false;

    var username = req.body.username;
    // note: this is vulnerable to potential attack, 'username; rm -rf /' 
    var userdel = spawn('userdel', [username]);
    userdel.on('exit', function (code) {
      if (code == 0) {
        response.success = true;
      }
      res.json(response);
    });    
  });
}