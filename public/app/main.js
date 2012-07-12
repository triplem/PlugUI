/*
 * PlugUI client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
	window.authenticated = false;
	window.username = null;
	
	var dispatcher = _.clone(Backbone.Events);

(function($) {

	
	$(function() {
		console.log('creating app');



		window.App = new PlugUI;

		window.App.checkin();
		Backbone.history.start();
	});

  $(function() {
		/**
		 * TemplateManager taken from http://lostechies.com/derickbailey/2012/02/09/asynchronously-load-html-templates-for-backbone-views/
		 */
		TemplateManager = {
		  templates: {},

		  get: function(id, callback) {
		    var template = this.templates[id];

		    if (template) {
		      callback(template);
		    } else {
		      var that = this;

		      $.get("/static/templates/" + id + ".html", function(template) {
		        var $tmpl = $(template);
		        that.templates[id] = $tmpl;
		        callback($tmpl);
		      });

		    }

		  }

		}  	
	});
})(jQuery);