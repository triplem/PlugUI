/*
 * PlugUI client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
PlugUI = new Backbone.Marionette.Application();

PlugUI.addRegions({
	adminbarRegion: "#adminbar",
	contentRegion: "#content"
});

PlugUI.vent.on("layout:rendered", function(){
  Backbone.history.start();
});

// Set up async template loading from the server. A view with
// a template of `"#my-view-template"` will load a file called
// `"/templates/my-view-template.html"` from the server.
//
// Use the TrafficCop plugin to ensure we only make one
// request to get the template
Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId, callback){
  var that = this;
  var tmpId = templateId.replace("#", "");
  var url = "/templates/" + tmpId + ".html";
  var promise = $.ajax(url);
  promise.done(function(templateHtml){
    var $template = $(templateHtml);
    var template = that.compileTemplate($template.html());
    callback(template);
  });
}

