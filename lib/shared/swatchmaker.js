(function (root, factory) {
  if(typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Swatchmaker = factory();
  }
}(this, function() {
  var Swatchmaker = {
    hello: function() {console.log("hello")}
  };
  return Swatchmaker;
}));
