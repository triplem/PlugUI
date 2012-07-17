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
    var status = new Status.Status(model);
    var statusView = new Status.StatusView({
      model: status
    });

    PlugUI.layout.main.show(statusView);
    PlugUI.Navigation.showNavigation();
    console.log("added entry to adminbar");
  }

  Status.StatusView = Backbone.Marionette.ItemView.extend({
    tagName: "div",
    className: "one-third column statusbox",
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

    var entry = new PlugUI.Navigation.Entry();
    entry.set("image", "/public/images/app/status.png");
    entry.set("name", "Status");
    entry.set("route", "/#/status");
    entry.set("htmlId", "status-icon");
    entry.set("seqNum", 1);
    console.log("adding entry to adminbar: " + entry.get("name"));
    PlugUI.Navigation.addEntry(entry);


    Status.showUniqueStatus();
  })
})