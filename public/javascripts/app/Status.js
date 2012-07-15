// this is the controller for the status 
// contains basically the model of the "sub-app"
PlugUI.module("Status", function(Status, PlugUI, Backbone, Marionette, $, _) {
  // define the model
  Status.Status = Backbone.Model.extend({
    defaults: {
      loadavg: [],
      totalmem: 0,
      usedmem: 0,      
      freemem: 0,
      uptime: 0,
      version: "",

      release: "",
      platform: "",
      hostname: "",
      arch: "",
      type: ""      
    },
    urlRoot: function() {
      return '/api/status';
    },

    fetchStatus: function() {
      var status = new Status.Status();
      status.fetch({
        success: function(data, response){
          console.log("JSON: " + JSON.stringify(data));
//          var model = new Status.Status(response);
          Status.showStatus(response);
        }
      })
    }
  });

  Status.showUniqueStatus = function() {
    var status = new Status.Status();
    status.fetchStatus();
  }

  Status.showStatus = function(model){
    console.log("called correctly");
    console.log("putting statusView on layout");
    var status = new Status.Status(model);
    var statusView = new Status.StatusView({
      model: status
    });

    PlugUI.layout.main.show(statusView);
  }

  Status.StatusView = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    template: "#status"
  });

  Status.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      "": "showUniqueStatus"
    }
  });  

  PlugUI.addInitializer(function(options){
    PlugUI.router = new Status.Router({
      controller: PlugUI.Status
    }); 

    Status.showUniqueStatus();
  })
})