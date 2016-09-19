(function (root, create) {
  if(typeof module === "object" && module.exports) {
    module.exports = create();
  } else {
    root.ClassUtil = create();
  }
}(this, function() {
    return {
        has: function hasClass(el, cl) {
            return el.className.match(new RegExp("(^| )" + cl + "($| )")) !== null;
        },

        add: function addClass(el, cl) {
            if (!this.has(el, cl)) {
                el.className = el.className + " " + cl;
            }
        },

        remove: function removeClass(el, cl) {
            if (this.has(el, cl)) {
                el.className = el.className.replace(new RegExp("((^| )" + cl + "($| ))"), "");
            }
        }
    };
}));
