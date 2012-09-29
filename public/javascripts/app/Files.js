PlugUI.module("File", function(File, PlugUI, Backbone, Marionette, $, _) {

	File.File = Backbone.Model.extend({
		defaults: {
			fullpath: null,
			extension: null,
			directory: null,
			isFolder: false,
			name: null,
			size: null,
			type: null
    },
		initialize: function(){
			console.log('creating new file');		
    }
	});

	File.Head = Backbone.Model.extend({

	});
  
	File.Files = Backbone.Collection.extend({
		model: File.File,
  	url: "/api/files",

		comparator: function(file) {
			return file.get("name").toLowerCase();
		},
		parse: function(data) {
			helper = data.files.length;
			return data.files;
		}
	});

	File.FileLineview = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		className: 'line',
//    className: "one-third column statusbox",
    template: "#files-line"		
	});	

	File.FilesView = Backbone.Marionette.CompositeView.extend({
  	itemView: File.FileLineview,
		itemViewContainer: '#filelist',
    tagName: "displayarea",
		template: '#files',

    templateHelpers: function () {
    	var item = this.collection.at(0);
      return {
			  currentDirectory: item.get('directory')
      }
    },

    
/**			
			console.log('new files view');
			_.bindAll(this, 'render');
			this.template = _.template($('#files-template').html());
			this.directory = '';

			//this.uploadView = UploadView({ el: this.$('#dropbox') });
			this.collection = new Files();
			
			this.collection.bind('reset', this.render);
			
			this.dropbox = new UploadView({ });
			
				
						
			dispatcher.on("didAuthenticate", function(msg) {
				console.log('authenticated, getting new file tree');
				window.App.filesView.getTree('',false);
			});
		},
		getTree: function(newdir,previous) {
			var lthis = this;
			console.log('getting tree with: ' + newdir);
			var directory_array = this.directory.split("/");
			if (previous == true) {
				directory_array.pop();
			}
			else {
				directory_array.push(newdir);
			}
			
			this.directory = directory_array.join("/");
			if (this.directory == '/') this.directory = '';		
			showloader();
			$.ajax({
				type: 'POST',
				cache: false,
				url : '/api/files',
				data: { apicmd: "directory_list", path: this.directory },
				dataType : 'json',
				success: function (json) { 
					var response = json;
					if (response.success == true) {
						window.App.filesView.directory = lthis.directory;
						window.App.filesView.collection.reset(response.files);
						
					}
					hideloader();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					hideloader();
				} 
			});
		},		
		render: function() {
			console.log('rendering files view');
			var collection = this.collection;
			
			$(this.el).html(this.template({}));

			
			var $rightpanel = this.$('#rightpanel');
			
			$rightpanel.html(this.dropbox.render().el);
			
			var $filelist = this.$('#filelist');
			
			var headerline = document.createElement("tr");
			headerline.setAttribute('class', 'line');
			headerline.setAttribute('id', 'fileheader');
		   
			var icon = document.createElement("td");
			icon.setAttribute('class', 'icon');
			
			var image = document.createElement('div');
			image.setAttribute('id', 'loader');
			image.setAttribute('style','display:none;');
			
			icon.appendChild(image);
			headerline.appendChild(icon);
			
			var name = document.createElement("td");
			name.setAttribute('class', 'name');
			name.setAttribute('id', 'currentpath');
			name.setAttribute('valign', 'middle');
			$(name).text("/media" + this.directory);
			headerline.appendChild(name);
			
			
			var tools = document.createElement("td");
			tools.setAttribute('class', 'file-toolbar');
			tools.setAttribute('valign', 'middle');
							
			headerline.appendChild(tools);
			
			$filelist.append(headerline);
			
			var parentdirline = document.createElement("tr");
			parentdirline.setAttribute('class', 'line');
		   
			var icon = document.createElement("td");
			icon.setAttribute('class', 'icon parentdir');
			parentdirline.appendChild(icon);
			
			
			
					
			var name = document.createElement("td");
			name.setAttribute('class', 'name');
			name.setAttribute('valign', 'middle');
			
			
			var parentlink = document.createElement('span');
			var parenttext = document.createTextNode("Parent Directory");
			
			parentlink.onclick = function() { 
				window.App.filesView.getTree('',true);
				return false 
			};
			
			parentlink.appendChild(parenttext);
			name.appendChild(parentlink);

			parentdirline.appendChild(name);
					
					
					
			//append the parent directory link to the list		
			$filelist.append(parentdirline);
			
			collection.each(function(file) {
				var view = new FileItemView({
					model: file,
					collection: collection
				});

				$filelist.append($(view.render().el));
			});
			return this;
		}
**/		
	});

	PlugUI.vent.on("files:show", function(){
		console.log("showing files");
		File.showFiles();
	});

	File.showFiles = function(){
    // add trigger, so that navbar is shown ;-)
    PlugUI.vent.trigger("navbar:show", "files-icon");

    var files = new File.Files();
    var file = new File.File();

    files.fetch( { success: function() {  									 
  									 	 file = new File.File(files.get(0));
									     var fileView = new File.FilesView({
									     	 model: file,
									     	 collection: files
									     });  									     									 	
									     PlugUI.layout.main.show(fileView);
  									 }});
 	};		

  File.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      "files": "showFiles"
    }
  });  

	File.addInitializer(function(options){
    File.router = new File.Router({
      controller: File
    });

    PlugUI.vent.trigger("routing:started");

    // add entry to navbar
    var entry = new PlugUI.Navigation.Entry();
    entry.set("image", "/public/images/app/navbar/files.png");
    entry.set("name", "File");
    entry.set("route", "/#files");
    entry.set("eventId", "files");
    entry.set("htmlId", "files-icon");
    entry.set("seqNum", 2);
    console.log("adding entry to adminbar: " + entry.get("name"));
    PlugUI.Navigation.addEntry(entry);		

	})
	


})