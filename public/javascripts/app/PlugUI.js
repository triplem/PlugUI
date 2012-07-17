/*
 * This is the main PlugUi application

 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
var PlugUI = new Backbone.Marionette.Application();
 
PlugUI.addRegions({
//  adminBarRegion: "#adminbar",
  contentRegion: "#content"
});

//PlugUI.vent.on("layout:rendered", function(){
//  if (Backbone.history) {
//    Backbone.history.start();    
//  }
//});

PlugUI.bind("initialize:after", function(options){
  if (Backbone.history){
    Backbone.history.start();
  }

  PlugUI.Navigation.showNavigation();
});

/*
Status = Backbone.Model.extend({
  defaults: {
    loadavg: [],
    totalmem: 0,
    usedmem: 0,      
    freemem: 0,
    uptime: 0,
    version: "1.0.1",

    release: "",
    platform: "",
    hostname: "",
    arch: "",
    type: ""      
  },
  urlRoot: '/api/status'
});

StatusView = Backbone.Marionette.ItemView.extend({
  tagName: "li",
  template: "#status"
});

PlugUI.addInitializer(function(options){
  var status = new Status();
  var statusView = new StatusView({
    model: status
  });
  PlugUI.contentRegion.show(statusView);
})
*/

// Set up async template loading from the server. A view with
// a template of `"#my-view-template"` will load a file called
// `"/templates/my-view-template.html"` from the server.
//
// Use the TrafficCop plugin to ensure we only make one
// request to get the template
Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId, callback){
  console.log("loading template with id: " + templateId);
  var that = this;
  var tmpId = templateId.replace("#", "");
  var url = "/public/templates/" + tmpId + ".html";
  var promise = $.ajax(url);
  promise.done(function(templateHtml){
    var $template = $(templateHtml);
    var template = that.compileTemplate($template.html());
    callback(template);
  });
}