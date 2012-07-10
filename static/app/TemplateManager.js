/**
 * TemplateManager taken from http://lostechies.com/derickbailey/2012/02/09/asynchronously-load-html-templates-for-backbone-views/
 */
TemplateManager = {
  templates: {},

  get: function(id, callback){
    var template = this.templates[id];

    if (template) {
      callback(template);

    } else {

      var that = this;
      $.get("/templates/" + id + ".html", function(template)){
        var $tmpl = $(template);
        that.templates[id] = $tmpl;
        callback($tmpl);
      }

    }

  }

}

