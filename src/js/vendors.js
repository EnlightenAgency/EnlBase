!function ($) {
    "use strict";
    var FOUNDATION_VERSION = '6.2.2';
    // Global Foundation object
    // This is attached to the window, or used as a module for AMD/Browserify
    var Foundation = {
        version: FOUNDATION_VERSION,
        /**
         * Stores initialized plugins.
         */
        _plugins: {},
        /**
         * Stores generated unique ids for plugin instances
         */
        _uuids: [],
        /**
         * Returns a boolean for RTL support
         */
        rtl: function () {
            return $('html').attr('dir') === 'rtl';
        },
        /**
         * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
         * @param {Object} plugin - The constructor of the plugin.
         */
        plugin: function (plugin, name) {
            // Object key to use when adding to global Foundation object
            // Examples: Foundation.Reveal, Foundation.OffCanvas
            var className = (name || functionName(plugin));
            // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
            // Examples: data-reveal, data-off-canvas
            var attrName = hyphenate(className);
            // Add to the Foundation object and the plugins list (for reflowing)
            this._plugins[attrName] = this[className] = plugin;
        },
        /**
         * @function
         * Populates the _uuids array with pointers to each individual plugin instance.
         * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
         * Also fires the initialization event for each plugin, consolidating repetitive code.
         * @param {Object} plugin - an instance of a plugin, usually `this` in context.
         * @param {String} name - the name of the plugin, passed as a camelCased string.
         * @fires Plugin#init
         */
        registerPlugin: function (plugin, name) {
            var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
            plugin.uuid = this.GetYoDigits(6, pluginName);
            if (!plugin.$element.attr("data-" + pluginName)) {
                plugin.$element.attr("data-" + pluginName, plugin.uuid);
            }
            if (!plugin.$element.data('zfPlugin')) {
                plugin.$element.data('zfPlugin', plugin);
            }
            /**
             * Fires when the plugin has initialized.
             * @event Plugin#init
             */
            plugin.$element.trigger("init.zf." + pluginName);
            this._uuids.push(plugin.uuid);
            return;
        },
        /**
         * @function
         * Removes the plugins uuid from the _uuids array.
         * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
         * Also fires the destroyed event for the plugin, consolidating repetitive code.
         * @param {Object} plugin - an instance of a plugin, usually `this` in context.
         * @fires Plugin#destroyed
         */
        unregisterPlugin: function (plugin) {
            var pluginName = hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));
            this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
            plugin.$element.removeAttr("data-" + pluginName).removeData('zfPlugin')
                .trigger("destroyed.zf." + pluginName);
            for (var prop in plugin) {
                plugin[prop] = null; //clean up script to prep for garbage collection.
            }
            return;
        },
        /**
         * @function
         * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
         * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
         * @default If no argument is passed, reflow all currently active plugins.
         */
        reInit: function (plugins) {
            var isJQ = plugins instanceof $;
            try {
                if (isJQ) {
                    plugins.each(function () {
                        $(this).data('zfPlugin')._init();
                    });
                }
                else {
                    var type = typeof plugins, _this = this, fns = {
                        'object': function (plgs) {
                            plgs.forEach(function (p) {
                                p = hyphenate(p);
                                $('[data-' + p + ']').foundation('_init');
                            });
                        },
                        'string': function () {
                            plugins = hyphenate(plugins);
                            $('[data-' + plugins + ']').foundation('_init');
                        },
                        'undefined': function () {
                            this['object'](Object.keys(_this._plugins));
                        }
                    };
                    fns[type](plugins);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                return plugins;
            }
        },
        /**
         * returns a random base-36 uid with namespacing
         * @function
         * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
         * @param {String} namespace - name of plugin to be incorporated in uid, optional.
         * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
         * @returns {String} - unique id
         */
        GetYoDigits: function (length, namespace) {
            length = length || 6;
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1) + (namespace ? "-" + namespace : '');
        },
        /**
         * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
         * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
         * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
         */
        reflow: function (elem, plugins) {
            // If plugins is undefined, just grab everything
            if (typeof plugins === 'undefined') {
                plugins = Object.keys(this._plugins);
            }
            else if (typeof plugins === 'string') {
                plugins = [plugins];
            }
            var _this = this;
            // Iterate through each plugin
            $.each(plugins, function (i, name) {
                // Get the current plugin
                var plugin = _this._plugins[name];
                // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
                var $elem = $(elem).find('[data-' + name + ']').addBack('[data-' + name + ']');
                // For each plugin found, initialize it
                $elem.each(function () {
                    var $el = $(this), opts = {};
                    // Don't double-dip on plugins
                    if ($el.data('zfPlugin')) {
                        console.warn("Tried to initialize " + name + " on an element that already has a Foundation plugin.");
                        return;
                    }
                    if ($el.attr('data-options')) {
                        var thing = $el.attr('data-options').split(';').forEach(function (e, i) {
                            var opt = e.split(':').map(function (el) { return el.trim(); });
                            if (opt[0])
                                opts[opt[0]] = parseValue(opt[1]);
                        });
                    }
                    try {
                        $el.data('zfPlugin', new plugin($(this), opts));
                    }
                    catch (er) {
                        console.error(er);
                    }
                    finally {
                        return;
                    }
                });
            });
        },
        getFnName: functionName,
        transitionend: function ($elem) {
            var transitions = {
                'transition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'otransitionend'
            };
            var elem = document.createElement('div'), end;
            for (var t in transitions) {
                if (typeof elem.style[t] !== 'undefined') {
                    end = transitions[t];
                }
            }
            if (end) {
                return end;
            }
            else {
                end = setTimeout(function () {
                    $elem.triggerHandler('transitionend', [$elem]);
                }, 1);
                return 'transitionend';
            }
        }
    };
    Foundation.util = {
        /**
         * Function for applying a debounce effect to a function call.
         * @function
         * @param {Function} func - Function to be called at end of timeout.
         * @param {Number} delay - Time in ms to delay the call of `func`.
         * @returns function
         */
        throttle: function (func, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                if (timer === null) {
                    timer = setTimeout(function () {
                        func.apply(context, args);
                        timer = null;
                    }, delay);
                }
            };
        }
    };
    // TODO: consider not making this a jQuery function
    // TODO: need way to reflow vs. re-initialize
    /**
     * The Foundation jQuery method.
     * @param {String|Array} method - An action to perform on the current jQuery object.
     */
    var foundation = function (method) {
        var type = typeof method, $meta = $('meta.foundation-mq'), $noJS = $('.no-js');
        if (!$meta.length) {
            $('<meta class="foundation-mq">').appendTo(document.head);
        }
        if ($noJS.length) {
            $noJS.removeClass('no-js');
        }
        if (type === 'undefined') {
            Foundation.MediaQuery._init();
            Foundation.reflow(this);
        }
        else if (type === 'string') {
            var args = Array.prototype.slice.call(arguments, 1); //collect all the arguments, if necessary
            var plugClass = this.data('zfPlugin'); //determine the class of plugin
            if (plugClass !== undefined && plugClass[method] !== undefined) {
                if (this.length === 1) {
                    plugClass[method].apply(plugClass, args);
                }
                else {
                    this.each(function (i, el) {
                        plugClass[method].apply($(el).data('zfPlugin'), args);
                    });
                }
            }
            else {
                throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
            }
        }
        else {
            throw new TypeError("We're sorry, " + type + " is not a valid parameter. You must use a string representing the method you wish to invoke.");
        }
        return this;
    };
    window.Foundation = Foundation;
    $.fn.foundation = foundation;
    // Polyfill for requestAnimationFrame
    (function () {
        if (!Date.now || !window.Date.now)
            window.Date.now = Date.now = function () { return new Date().getTime(); };
        var vendors = ['webkit', 'moz'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            var vp = vendors[i];
            window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame']
                || window[vp + 'CancelRequestAnimationFrame']);
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)
            || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = function (callback) {
                var now = Date.now();
                var nextTime = Math.max(lastTime + 16, now);
                return setTimeout(function () { callback(lastTime = nextTime); }, nextTime - now);
            };
            window.cancelAnimationFrame = clearTimeout;
        }
        /**
         * Polyfill for performance.now, required by rAF
         */
        if (!window.performance || !window.performance.now) {
            window.performance = {
                start: Date.now(),
                now: function () { return Date.now() - this.start; }
            };
        }
    })();
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }
            var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () { }, fBound = function () {
                return fToBind.apply(this instanceof fNOP
                    ? this
                    : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            if (this.prototype) {
                // native functions don't have a prototype
                fNOP.prototype = this.prototype;
            }
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
    // Polyfill to get the name of a function in IE9
    function functionName(fn) {
        if (Function.prototype.name === undefined) {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((fn).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        }
        else if (fn.prototype === undefined) {
            return fn.constructor.name;
        }
        else {
            return fn.prototype.constructor.name;
        }
    }
    function parseValue(str) {
        if (/true/.test(str))
            return true;
        else if (/false/.test(str))
            return false;
        else if (!isNaN(str * 1))
            return parseFloat(str);
        return str;
    }
    // Convert PascalCase to kebab-case
    // Thank you: http://stackoverflow.com/a/8955580
    function hyphenate(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
}(jQuery);
;
'use strict';
!function ($) {
    // Default set of media queries
    var defaultQueries = {
        'default': 'only screen',
        landscape: 'only screen and (orientation: landscape)',
        portrait: 'only screen and (orientation: portrait)',
        retina: 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
            'only screen and (min--moz-device-pixel-ratio: 2),' +
            'only screen and (-o-min-device-pixel-ratio: 2/1),' +
            'only screen and (min-device-pixel-ratio: 2),' +
            'only screen and (min-resolution: 192dpi),' +
            'only screen and (min-resolution: 2dppx)'
    };
    var MediaQuery = {
        queries: [],
        current: '',
        /**
         * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
         * @function
         * @private
         */
        _init: function () {
            var self = this;
            var extractedStyles = $('.foundation-mq').css('font-family');
            var namedQueries;
            namedQueries = parseStyleToObject(extractedStyles);
            for (var key in namedQueries) {
                if (namedQueries.hasOwnProperty(key)) {
                    self.queries.push({
                        name: key,
                        value: "only screen and (min-width: " + namedQueries[key] + ")"
                    });
                }
            }
            this.current = this._getCurrentSize();
            this._watcher();
        },
        /**
         * Checks if the screen is at least as wide as a breakpoint.
         * @function
         * @param {String} size - Name of the breakpoint to check.
         * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
         */
        atLeast: function (size) {
            var query = this.get(size);
            if (query) {
                return window.matchMedia(query).matches;
            }
            return false;
        },
        /**
         * Gets the media query of a breakpoint.
         * @function
         * @param {String} size - Name of the breakpoint to get.
         * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
         */
        get: function (size) {
            for (var i in this.queries) {
                if (this.queries.hasOwnProperty(i)) {
                    var query = this.queries[i];
                    if (size === query.name)
                        return query.value;
                }
            }
            return null;
        },
        /**
         * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
         * @function
         * @private
         * @returns {String} Name of the current breakpoint.
         */
        _getCurrentSize: function () {
            var matched;
            for (var i = 0; i < this.queries.length; i++) {
                var query = this.queries[i];
                if (window.matchMedia(query.value).matches) {
                    matched = query;
                }
            }
            if (typeof matched === 'object') {
                return matched.name;
            }
            else {
                return matched;
            }
        },
        /**
         * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
         * @function
         * @private
         */
        _watcher: function () {
            var _this = this;
            $(window).on('resize.zf.mediaquery', function () {
                var newSize = _this._getCurrentSize(), currentSize = _this.current;
                if (newSize !== currentSize) {
                    // Change the current media query
                    _this.current = newSize;
                    // Broadcast the media query change on the window
                    $(window).trigger('changed.zf.mediaquery', [newSize, currentSize]);
                }
            });
        }
    };
    Foundation.MediaQuery = MediaQuery;
    // matchMedia() polyfill - Test a CSS media type/query in JS.
    // Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
    window.matchMedia || (window.matchMedia = function () {
        'use strict';
        // For browsers that support matchMedium api such as IE 9 and webkit
        var styleMedia = (window.styleMedia || window.media);
        // For those that don't support matchMedium
        if (!styleMedia) {
            var style = document.createElement('style'), script = document.getElementsByTagName('script')[0], info = null;
            style.type = 'text/css';
            style.id = 'matchmediajs-test';
            script.parentNode.insertBefore(style, script);
            // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
            info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;
            styleMedia = {
                matchMedium: function (media) {
                    var text = "@media " + media + "{ #matchmediajs-test { width: 1px; } }";
                    // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                    if (style.styleSheet) {
                        style.styleSheet.cssText = text;
                    }
                    else {
                        style.textContent = text;
                    }
                    // Test if media query is true or false
                    return info.width === '1px';
                }
            };
        }
        return function (media) {
            return {
                matches: styleMedia.matchMedium(media || 'all'),
                media: media || 'all'
            };
        };
    }());
    // Thank you: https://github.com/sindresorhus/query-string
    function parseStyleToObject(str) {
        var styleObject = {};
        if (typeof str !== 'string') {
            return styleObject;
        }
        str = str.trim().slice(1, -1); // browsers re-quote string style values
        if (!str) {
            return styleObject;
        }
        styleObject = str.split('&').reduce(function (ret, param) {
            var parts = param.replace(/\+/g, ' ').split('=');
            var key = parts[0];
            var val = parts[1];
            key = decodeURIComponent(key);
            // missing `=` should be `null`:
            // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
            val = val === undefined ? null : decodeURIComponent(val);
            if (!ret.hasOwnProperty(key)) {
                ret[key] = val;
            }
            else if (Array.isArray(ret[key])) {
                ret[key].push(val);
            }
            else {
                ret[key] = [ret[key], val];
            }
            return ret;
        }, {});
        return styleObject;
    }
    Foundation.MediaQuery = MediaQuery;
}(jQuery);
;
'use strict';
!function ($) {
    function Timer(elem, options, cb) {
        var _this = this, duration = options.duration, //options is an object for easily adding features later.
        nameSpace = Object.keys(elem.data())[0] || 'timer', remain = -1, start, timer;
        this.isPaused = false;
        this.restart = function () {
            remain = -1;
            clearTimeout(timer);
            this.start();
        };
        this.start = function () {
            this.isPaused = false;
            // if(!elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
            clearTimeout(timer);
            remain = remain <= 0 ? duration : remain;
            elem.data('paused', false);
            start = Date.now();
            timer = setTimeout(function () {
                if (options.infinite) {
                    _this.restart(); //rerun the timer.
                }
                cb();
            }, remain);
            elem.trigger("timerstart.zf." + nameSpace);
        };
        this.pause = function () {
            this.isPaused = true;
            //if(elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
            clearTimeout(timer);
            elem.data('paused', true);
            var end = Date.now();
            remain = remain - (end - start);
            elem.trigger("timerpaused.zf." + nameSpace);
        };
    }
    /**
     * Runs a callback function when images are fully loaded.
     * @param {Object} images - Image(s) to check if loaded.
     * @param {Func} callback - Function to execute when image is fully loaded.
     */
    function onImagesLoaded(images, callback) {
        var self = this, unloaded = images.length;
        if (unloaded === 0) {
            callback();
        }
        images.each(function () {
            if (this.complete) {
                singleImageLoaded();
            }
            else if (typeof this.naturalWidth !== 'undefined' && this.naturalWidth > 0) {
                singleImageLoaded();
            }
            else {
                $(this).one('load', function () {
                    singleImageLoaded();
                });
            }
        });
        function singleImageLoaded() {
            unloaded--;
            if (unloaded === 0) {
                callback();
            }
        }
    }
    Foundation.Timer = Timer;
    Foundation.onImagesLoaded = onImagesLoaded;
}(jQuery);
;
'use strict';
!function ($) {
    /**
     * Interchange module.
     * @module foundation.interchange
     * @requires foundation.util.mediaQuery
     * @requires foundation.util.timerAndImageLoader
     */
    var Interchange = (function () {
        /**
         * Creates a new instance of Interchange.
         * @class
         * @fires Interchange#init
         * @param {Object} element - jQuery object to add the trigger to.
         * @param {Object} options - Overrides to the default plugin settings.
         */
        function Interchange(element, options) {
            this.$element = element;
            this.options = $.extend({}, Interchange.defaults, options);
            this.rules = [];
            this.currentPath = '';
            this._init();
            this._events();
            Foundation.registerPlugin(this, 'Interchange');
        }
        /**
         * Initializes the Interchange plugin and calls functions to get interchange functioning on load.
         * @function
         * @private
         */
        Interchange.prototype._init = function () {
            this._addBreakpoints();
            this._generateRules();
            this._reflow();
        };
        /**
         * Initializes events for Interchange.
         * @function
         * @private
         */
        Interchange.prototype._events = function () {
            $(window).on('resize.zf.interchange', Foundation.util.throttle(this._reflow.bind(this), 50));
        };
        /**
         * Calls necessary functions to update Interchange upon DOM change
         * @function
         * @private
         */
        Interchange.prototype._reflow = function () {
            var match;
            // Iterate through each rule, but only save the last match
            for (var i in this.rules) {
                if (this.rules.hasOwnProperty(i)) {
                    var rule = this.rules[i];
                    if (window.matchMedia(rule.query).matches) {
                        match = rule;
                    }
                }
            }
            if (match) {
                this.replace(match.path);
            }
        };
        /**
         * Gets the Foundation breakpoints and adds them to the Interchange.SPECIAL_QUERIES object.
         * @function
         * @private
         */
        Interchange.prototype._addBreakpoints = function () {
            for (var i in Foundation.MediaQuery.queries) {
                if (Foundation.MediaQuery.queries.hasOwnProperty(i)) {
                    var query = Foundation.MediaQuery.queries[i];
                    Interchange.SPECIAL_QUERIES[query.name] = query.value;
                }
            }
        };
        /**
         * Checks the Interchange element for the provided media query + content pairings
         * @function
         * @private
         * @param {Object} element - jQuery object that is an Interchange instance
         * @returns {Array} scenarios - Array of objects that have 'mq' and 'path' keys with corresponding keys
         */
        Interchange.prototype._generateRules = function (element) {
            var rulesList = [];
            var rules;
            if (this.options.rules) {
                rules = this.options.rules;
            }
            else {
                rules = this.$element.data('interchange').match(/\[.*?\]/g);
            }
            for (var i in rules) {
                if (rules.hasOwnProperty(i)) {
                    var rule = rules[i].slice(1, -1).split(', ');
                    var path = rule.slice(0, -1).join('');
                    var query = rule[rule.length - 1];
                    if (Interchange.SPECIAL_QUERIES[query]) {
                        query = Interchange.SPECIAL_QUERIES[query];
                    }
                    rulesList.push({
                        path: path,
                        query: query
                    });
                }
            }
            this.rules = rulesList;
        };
        /**
         * Update the `src` property of an image, or change the HTML of a container, to the specified path.
         * @function
         * @param {String} path - Path to the image or HTML partial.
         * @fires Interchange#replaced
         */
        Interchange.prototype.replace = function (path) {
            if (this.currentPath === path)
                return;
            var _this = this, trigger = 'replaced.zf.interchange';
            // Replacing images
            if (this.$element[0].nodeName === 'IMG') {
                this.$element.attr('src', path).load(function () {
                    _this.currentPath = path;
                })
                    .trigger(trigger);
            }
            else if (path.match(/\.(gif|jpg|jpeg|png|svg|tiff)([?#].*)?/i)) {
                this.$element.css({ 'background-image': 'url(' + path + ')' })
                    .trigger(trigger);
            }
            else {
                $.get(path, function (response) {
                    _this.$element.html(response)
                        .trigger(trigger);
                    $(response).foundation();
                    _this.currentPath = path;
                });
            }
            /**
             * Fires when content in an Interchange element is done being loaded.
             * @event Interchange#replaced
             */
            // this.$element.trigger('replaced.zf.interchange');
        };
        /**
         * Destroys an instance of interchange.
         * @function
         */
        Interchange.prototype.destroy = function () {
            //TODO this.
        };
        return Interchange;
    }());
    /**
     * Default settings for plugin
     */
    Interchange.defaults = {
        /**
         * Rules to be applied to Interchange elements. Set with the `data-interchange` array notation.
         * @option
         */
        rules: null
    };
    Interchange.SPECIAL_QUERIES = {
        'landscape': 'screen and (orientation: landscape)',
        'portrait': 'screen and (orientation: portrait)',
        'retina': 'only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)'
    };
    // Window exports
    Foundation.plugin(Interchange, 'Interchange');
}(jQuery);
