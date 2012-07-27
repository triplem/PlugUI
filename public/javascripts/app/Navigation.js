// this is the controller for the status 
// contains basically the model of the "sub-app"
PlugUI.module("Navigation", function(Navigation, PlugUI, Backbone, Marionette, $, _) {

  Navigation.Entry = Backbone.Model.extend({
    defaults: {
      image: "",
      name: "",
      route: "",
      eventId: "",
      htmlId: "",
      style: "",
      seqNum: 100
    }
  });

  Navigation.Entries = Backbone.Collection.extend({
  	model: Navigation.Entry,
  	comparator: function(entry) {
  		return entry.get("seqNum");
  	}
  });

  var NavigationView = Backbone.Marionette.ItemView.extend({
  	tagName: "ul",
  	className: "gradient",
  	template: "#navigation",

    events: {
      'click .adminbutton': 'click'
    },

    click: function(adminbutton) {
      console.log("adminbutton clicked");
      PlugUI.vent.trigger(adminbutton.currentTarget.id + ":show");
    }
  });

  Navigation.addEntry = function(entry) {
  	console.log("addEntry called with: " + entry.get("name"));
  	Navigation.entries.add(entry);
  };

  PlugUI.vent.on("navbar:show", function(entryId){
    PlugUI.Navigation.showNavigation(entryId);
  }) 

  Navigation.showNavigation = function() {
		PlugUI.Navigation.showNavigation(undefined);
  };

  Navigation.showNavigation = function(entryId) {
    console.log("called correctly");
    if (entryId != undefined) {
    	console.log("called with entryId");
    	Navigation.entries.each(function(entry){
  			if (entry.get("htmlId") == entryId) {
  				entry.set("class", "selected");
  			} else {
          entry.set("class", "");
        }
    	})
    }

    var navigationView = new NavigationView({
      collection: Navigation.entries
    });

    PlugUI.layout.navbar.show(navigationView);
  };

  PlugUI.addInitializer(function(){
  	Navigation.entries = new Navigation.Entries();
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