var class2type = {};
['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'].forEach(function(name) {
  class2type["[object " + name + "]"] = name.toLowerCase();
})

let MESSAGE_TIMEOUT = null;
var $ = {
    type: function(obj) {
      return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
    },

    isWindow: function(obj) {
      return obj != null && obj === obj.window;
    },

    isArray: (Array.isArray ||
		function(object) {
			return object instanceof Array;
    }),
    
    isObject: function(obj) {
      return $.type(obj) === "object";
    },

    isPlainObject: function(obj) {
      return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    },

    extend: function() { //from jquery2
      var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
  
      if (typeof target === "boolean") {
        deep = target;
  
        target = arguments[i] || {};
        i++;
      }
  
      if (typeof target !== "object" && !$.isFunction(target)) {
        target = {};
      }
  
      if (i === length) {
        target = this;
        i--;
      }
  
      for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
  
            if (target === copy) {
              continue;
            }
  
            if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && $.isArray(src) ? src : [];
  
              } else {
                clone = src && $.isPlainObject(src) ? src : {};
              }
  
              target[name] = $.extend(deep, clone, copy);
  
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
  
      return target;
    },

    message: function(msg) {
      if( MESSAGE_TIMEOUT ) return;
      msg = typeof msg == 'object' ? msg.content : msg || '';
      this.$Message.warning(msg);
      MESSAGE_TIMEOUT = setTimeout(function() {
        MESSAGE_TIMEOUT = null;
      }, 1500);
    }
}

export default $;