PlugUI.module("Package", function(Package, PlugUI, Backbone, Marionette, $, _) {

	Package.Package = Backbone.Model.extend({
/*
		defaults: {
			name: null,
			version: null,
			repo: null,
			installed: false
    }
*/        
  });

  Package.Packages = Backbone.Collection.extend({
  	model: Package.Package,
  	url: "/api/packages",
  	comparator: function(package) {
  		return package.get("name");
  	},
  	parse: function(data) {
			return data.packages;
  	}	
  });

  Package.PackageView = Backbone.Marionette.ItemView.extend({
		tagName: 'div',
//    className: "one-third column statusbox",
    template: "#packages"		

/**
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = 'packages'; //_.template($('#packages-template').html());
			this.collection	= new Packages();
			this.collection.bind('reset', this.render);
			
			this.packageCache = null;
			
			this.currentindex = 0;
			
			var lthis = this;

			dispatcher.on("didAuthenticate", function(msg) {
				console.log('Packages view firing authenticated event');
				lthis.fetch();
			});
			dispatcher.on("needsAuthentication", function(msg) {
				console.log('Packages view firing deauthenticated event');
				lthis.collection.reset();
			});
		},
**/
/**
		render: function() {
			var that = this;

    	$.get("/static/templates/" + this.template + ".html", function(template){
  			// template source
      	var tmplHtml = $(template).html();
      	// convert the source to a real underscore template
      	var html = _.template(tmplHtml);
      	// fill the template variables
      	var renderedContent = tmplHtml;
				// finalize
      	that.$el.html(renderedContent);

      	alert("fetching finished");
 
	//			var renderedContent = this.template();
	//			$(this.el).html(renderedContent);
				console.log('Packages view rendering');
				
				console.log('Creating cache of packages');
				that.packageCache = document.createDocumentFragment();
				var lthis = that;	
			
				var pslice = that.collection.filter(function(package) {
					var ind = lthis.collection.indexOf(package)
					return ( ( ind >= lthis.currentindex ) && ( ind <= ( lthis.currentindex + 20) ) );
				});
				console.log(pslice);
				var pslicecollection = new Backbone.Collection(pslice);
				console.log(pslicecollection);
				pslicecollection.each(function(package) {
					
					var li = document.createElement('li');
					li.setAttribute('class','package-item');
					
					var name = document.createTextNode(package.get('name'));
					li.appendChild(name);
					
					var repo = document.createTextNode(package.get('repo'));
					li.appendChild(repo);
					lthis.packageCache.appendChild(li);
				});

				that.$('#package-list').html(that.packageCache.cloneNode(true));
				that.$('#number-all-packages').text(that.collection.length);
				that.$('#next-button').click(function() {
					console.log('Next');
					if ( ( lthis.currentindex +20 ) >= lthis.collection.length) return false;;
					lthis.currentindex = lthis.currentindex + 20;
					
					lthis.render();
				});			
				that.$('#previous-button').click(function() {
					console.log('Previous');
					lthis.currentindex = lthis.currentindex - 20;
					if (lthis.currentindex < 0) lthis.currentindex = 0;
					lthis.render();			
				});
				that.$('#current-index').text(that.currentindex);

    	});
			return this;
		},
		fetch: function() {
			console.log('Getting packages from server');
			var lthis = this;
			$.ajax({
				type: 'POST',
				cache: false,
				url : '/api/pacman',
				data: { apicmd: "list_packages" },
				dataType : 'json',
				success: function (json) { 
					var response = json;
					if (response.success == true) {
						lthis.collection.reset(response.packages);

						//this.render();
					}
				}
			});
		}
**/		
	});

	Package.PackageLineview = Backbone.Marionette.ItemView.extend({
		tagName: 'li',
//    className: "one-third column statusbox",
    template: "#package-line"		
	});

  Package.PackageCompView = Backbone.Marionette.CompositeView.extend({
  	itemView: Package.PackageLineview,
		itemViewContainer: '#item',
    template: "#packages",
    tagName: "ul"
  });

	PlugUI.vent.on("packages:show", function(){
		console.log("showing packages");
		Package.showPackages();
	});

	Package.showPackages = function(){

    var packages = new Package.Packages();
    var package = new Package.Package();

    packages.fetch( {data: { filter : "installed" }, 
  									 success: function() {  									 
  									 	 package = new Package.Package(packages.get(0));
									     var packageView = new Package.PackageCompView({
									     	 model: package,
									     	 collection: packages
									     });  									 	
									     PlugUI.layout.main.show(packageView);


									 	    // add trigger, so that navbar is shown ;-)
									     PlugUI.vent.trigger("navbar:show", "packages-icon");

  									 }});
 	};		

  Package.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      "packages": "showPackages"
    }
  });  

	PlugUI.addInitializer(function(options){
    Package.router = new Package.Router({
      controller: PlugUI.Package
    });

    PlugUI.vent.trigger("routing:started");

    // add entry to navbar
    var entry = new PlugUI.Navigation.Entry();
    entry.set("image", "/public/images/app/navbar/packages.png");
    entry.set("name", "Package");
    entry.set("route", "/#packages");
    entry.set("eventId", "packages");
    entry.set("htmlId", "packages-icon");
    entry.set("seqNum", 2);
    console.log("adding entry to adminbar: " + entry.get("name"));
    PlugUI.Navigation.addEntry(entry);		

	})
})