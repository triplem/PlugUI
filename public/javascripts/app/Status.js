PlugUI.module("Status", function(Status, PluginUI, Backbone, Marionette, $, _) {


  Status.Status = Backbone.Model.extend({
    default: {
      this.loadavg = null;
      this.totalmem = null;
      this.usedmem = null;      
      this.freemem = null;
      this.uptime = null;
      this.version = null;

      this.release = null;
      this.platform = null;
      this.hostname = null;
      this.arch = null;
      this.type = null;      
    },

    urlRoot: '/api/status'

  });

  Status.get = function() {
    Status.status = new Status.Status();

    return Status.status;
  };
})