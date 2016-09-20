(function (root, create) {
  if(typeof module === "object" && module.exports) {
    module.exports = create();
  } else {
    root.ClassUtil = create();
  }
}(this, function() {
    return {
        has: function has(el, cl) {
            return el.className.match(new RegExp("(^| )" + cl + "($| )")) !== null;
        },

        add: function add(el, cl) {
            if (!this.has(el, cl)) {
                el.className = el.className + " " + cl;
            }
        },

        remove: function remove(el, cl) {
            if (this.has(el, cl)) {
                el.className = el.className.replace(new RegExp("((^| )" + cl + "($| ))"), "");
            }
        },

        replace: function replace(el, o, n) {
            this.remove(el, o);
            this.add(el, n);
        }
    };
}));
