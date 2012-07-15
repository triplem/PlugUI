PlugUI.module("Layout", function(Layout, PlugUI, Backbone, Marionette, $, _){

  // The application layout
  var Layout = Backbone.Marionette.Layout.extend({
    template: "#layout",

    // These are my visual regions: the "navigation" or
    // left hand list of categories, and the "main"
    // content area where the email list or contact list
    // is displayed.
    regions: {
      navigation: "#adminbar",
      main: "#main"
    }
  });

  // Initialize the application layout and when the layout has
  // been rendered and displayed, then start the rest of the
  // application
  PlugUI.addInitializer(function(){
    // Render the layout and get it on the screen, first
    PlugUI.layout = new Layout();

    PlugUI.layout.on("show", function(){
      PlugUI.vent.trigger("layout:rendered");
    });

    PlugUI.contentRegion.show(PlugUI.layout);
  });

  return Layout;
});