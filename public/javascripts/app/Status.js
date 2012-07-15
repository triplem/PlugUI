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
    urlRoot: '/api/status'
  });

  Status.showStatus = function(status){
    console.log("called correctly");
    console.log("putting statusView on layout");
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
      "": "showStatus"
    }
  });  

  PlugUI.addInitializer(function(options){
    PlugUI.router = new Status.Router({
      controller: PlugUI.Status
    }); 

    var status = new Status.Status();
    Status.showStatus(status);
  })
})