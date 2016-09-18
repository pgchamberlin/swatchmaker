(function (root, create) {
  if(typeof module === "object" && module.exports) {
    module.exports = create();
  } else {
    root.ClassUtil = create();
  }
}(this, function() {
    return {
        hasClass: function hasClass(el, cl) {
            return el.className.match(new RegExp("(^| )" + cl + "($| )")) !== null;
        },

        addClass: function addClass(el, cl) {
            if (!ClassUtil.hasClass(el, cl)) {
                el.className = el.className + " " + cl;
            }
        },

        removeClass: function removeClass(el, cl) {
            if (ClassUtil.hasClass(el, cl)) {
                el.className = el.className.replace(new RegExp("((^| )" + cl + "($| ))"), "");
            }
        }
    };
}));
