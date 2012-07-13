(function($) {
	window.SettingsView = Backbone.View.extend({
		tagName: 'div',
		className: 'settings',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = 'settings';
			this.userView = new UsersView();
		},
    
		render: function() {
			var that = this;
    	$.get("/static/templates/" + this.template + ".html", function(template){
  			// template source
      	var tmplHtml = $(template).html();
      	// convert the source to a real underscore template
      	var html = _.template(tmplHtml);
      	// fill the template variables
      	var renderedContent = html;
				// finalize
      	that.$el.html(renderedContent);
      	that.$el.append($(that.userView.render().el));
    	});
 
			return this;
		},

	});
})(jQuery);