/*
 * PlugUI client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
var PlugUI = new Backbone.Marionette.Application();

  console.log("starting Application");

PlugUI.addRegions({
	contentRegion: "#container"
});

PlugUI.vent.on("layout:rendered", function(){
  console.log("starting history");
  if (Backbone.history) {
    Backbone.history.start();    
  }
});

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

