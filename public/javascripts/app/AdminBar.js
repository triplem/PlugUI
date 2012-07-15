// this is the controller for the status 
// contains basically the model of the "sub-app"
PlugUI.module("AdminBar", function(AdminBar, PlugUI, Backbone, Marionette, $, _) {

  AdminBar.Entry = Backbone.Model.extend({
    defaults: {
      image: "",
      name: "",
      route: ""
    }
  });

  AdminBar.Entries = Backbone.Collection.extend({
  	model: AdminBar.Entry
  });

  AdminBar.addEntry = function(entry) {
  	AdminBar.entries.add(entry);
  };

  AdminBar.View = Backbone.Marionette.CollectionView.extend({
    template: "#adminbar"
  });

  AdminBar.showAdminBar = function(model){
    console.log("called correctly");
    var adminBarView = new AdminBar.View({
      collection: AdminBar.entries
    });

    PlugUI.layout.adminbar.show(adminBarView);
  };

  PlugUI.addInitializer(function(){
  	AdminBar.entries = new AdminBar.Entries();
  });
})

/*
(function($) {

	window.AdminBar = Backbone.View.extend({
		tagName: 'ul',
		className: 'gradient',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#adminbar-template').html());
			
			var lthis = this;
			dispatcher.on("didAuthenticate", function(msg) {
				lthis.render();
			});
			dispatcher.on("needsAuthentication", function(msg) {
				lthis.render();
			});
		},
		events: {
            "click #controlbutton": "reveal",
			"click #dashboard-button": "dashboard",
			"click #files-button": "files",
			"click #packages-button": "packages",
			"click #settings-button": "settings",
			"click #userbutton": "auth"
        },
		auth: function() {
			window.App.authView.toggle();
		}, 
		dashboard: function() {
			if (!window.authenticated == true) return;
			$('.adminbutton').removeClass('selected'); 
			$('#dashboard-button').addClass('selected'); 
		},
		files: function() {
			if (!window.authenticated == true) return;
			$('.adminbutton').removeClass('selected'); 
			$('#files-button').addClass('selected');
		},
		packages: function() {
			if (!window.authenticated == true) return;
			$('.adminbutton').removeClass('selected'); 
			$('#packages-button').addClass('selected');
		},
		settings: function() {
			if (!window.authenticated == true) return;
			$('.adminbutton').removeClass('selected'); 
			$('#settings-button').addClass('selected');
		},
        reveal: function () {
			if ($("div.inset").is(":hidden")) {
				if (!window.authenticated == true) return;
				$('#controlbutton').addClass('selected');
				$("div.inset").slideDown({
					duration:500,
					easing:"swing",
					complete:function(){
						//alert("complete!");
					}
				});
			} else {
				$('#controlbutton').removeClass('selected');

				$("div.inset").slideUp({
					duration:500,
					easing:"swing",
					complete:function(){
						//alert("complete!");
					}
				});
			}            
			
			
			
        },
		render: function() {
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
      
			return this;
		}
	});	
})(jQuery);
*/