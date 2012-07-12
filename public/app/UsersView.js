(function($) {
	window.UsersView = Backbone.View.extend({
		tagName: 'div',
		className: 'one-third column statusbox',
		
		
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = 'user'; //_.template($('#user-template').html());
			this.addform = 'adduser'; //_.template($('#adduser-template').html());
			this.collection = new Users();
			
			this.collection.bind('reset', this.render);
			
			var lthis = this;
			dispatcher.on("didAuthenticate", function(msg) {
				console.log('User view firing authenticated event');
				lthis.fetch();
			});
			dispatcher.on("needsAuthentication", function(msg) {
				console.log('User view firing deauthenticated event');
				lthis.collection.reset();
			});
		},
		saveuser: function() {
			console.log('saveuser');
			var lthis = this;
			var username, password, password2;
    
			if (this.$('#usernamefield').attr('value') !== undefined) {  
				var username	= this.$('#usernamefield').attr('value');

			} 
			else {
				this.$('#usernamefield').focus(); 
				this.$('#adduser-error').html("<strong>Username blank");
				return false;  
			}
			if (this.$('#passwordfield').attr('value') !== undefined) {  
				var password	= this.$('#passwordfield').attr('value');    
			} 	
			else {
				this.$('#passwordfield').focus();  
				this.$('#adduser-error').html("<strong>No password</strong>");
				return false;  
			}


			this.$('#adduser-error').html("<strong>Creating user...</strong>");
			$.ajax({
				type: "POST",
				url: "/api/users",
				dataType : 'json',
				data: { "apicmd": "create",  "username": username, "password": password },
					success: function(json){
					var result = json;
					if (result.success == true) {
				
						lthis.$('#user-error').html("<strong>User created</strong>");
						lthis.$('#user-error').fadeIn('slow');
						$(lthis.popupel).remove();
					}
					else {
						lthis.$('#user-error').html("<strong>Create user failed</strong>");
						lthis.$('#user-error').fadeIn('slow');
					}  
					setTimeout('$("#user-error").fadeOut("slow");$("#adduser-error").html("");', 3000);
					lthis.fetch();
				}
			});
			
		},
		deleteuser: function(username) {
			console.log('deleteuser');
			var lthis = this;
			$.ajax({
				type: 'POST',
				cache: false,
				url : '/api/users',
				data: { apicmd: "delete", username: username },
				dataType : 'json',
				success: function (json) { 
					var response = json;
					if (response.success == true) {
						lthis.fetch();
					}
				}
			});	
		},
		render: function() {
			console.log('User view rendering');
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

				that.collection.each(function(user) {
					if (user.get('shell') != '/bin/false' && user.get('username').length >= 1) {				
						var li = document.createElement('li');
						li.setAttribute('class','user-item');
						
						var textspan = document.createElement('span');
						var text = document.createTextNode(user.get('username'));
						textspan.appendChild(text);
						li.appendChild(textspan);
						
						var deletebutton = document.createElement('button');
						deletebutton.setAttribute('class','userdelete-button');
						var text = document.createTextNode('Delete');
						deletebutton.appendChild(text);
						deletebutton.onclick = function() {
							that.deleteuser(user.get('username'));
							that.fetch();
						};
						li.appendChild(deletebutton);
						
						that.$('#userlist').append(li);
					};
				}); 
    	});
			return this;
		},
		
		fetch: function() {
			console.log('getting users from server');
			var lthis = this;
			$.ajax({
				type: 'POST',
				cache: false,
				url : '/api/users',
				data: { apicmd: "list" },
				dataType : 'json',
				success: function (json) { 
					var response = json;
					if (response.success == true) {
						lthis.collection.reset(response.userlist);
					}
				}
			});
		}
	});
})(jQuery);