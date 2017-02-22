module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tools = __webpack_require__(2);
	var expressApp = __webpack_require__(51);
	
	module.exports = tools.createExpressServer(function (req, config, storageContext) {
	  console.log('Starting User Import/Export Extension - Version:', config('CLIENT_VERSION'));
	  return expressApp(config);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.ArgumentError = __webpack_require__(38);
	module.exports.HookTokenError = __webpack_require__(39);
	module.exports.ManagementApiError = __webpack_require__(40);
	module.exports.NotFoundError = __webpack_require__(41);
	module.exports.ValidationError = __webpack_require__(42);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Webtask = __webpack_require__(25);
	
	const errors = __webpack_require__(1);
	const storage = __webpack_require__(47);
	
	const tools = module.exports = { };
	
	/*
	 * Errors exposed by the library.
	 */
	tools.ArgumentError = errors.ArgumentError;
	tools.HookTokenError = errors.HookTokenError;
	tools.ManagementApiError = errors.ManagementApiError;
	tools.NotFoundError = errors.NotFoundError;
	tools.ValidationError = errors.ValidationError;
	
	/*
	 * Helper for the Management Api.
	 */
	tools.managementApi = __webpack_require__(36);
	
	/*
	 * Storage helpers.
	 */
	tools.FileStorageContext = storage.FileStorageContext;
	tools.WebtaskStorageContext = storage.WebtaskStorageContext;
	
	/*
	 * Helpers that expose CRUD capablities to storage.
	 */
	tools.BlobRecordProvider = __webpack_require__(44);
	
	/*
	 * Helper that providers a configuration object containing one or more settings.
	 */
	tools.config = __webpack_require__(37);
	tools.configProvider = __webpack_require__(11);
	
	/*
	 * Bootstrap function to run initialize a server (connect, express, ...).
	 */
	tools.createServer = __webpack_require__(45).createServer;
	
	/*
	 * Validate a token for webtask hooks.
	 */
	tools.validateHookToken = __webpack_require__(43);
	
	/*
	 * Bootstrap function to run initialize an Express server.
	 */
	tools.createExpressServer = function createExpressServer(cb) {
	  return Webtask.fromExpress(tools.createServer(cb));
	};
	
	/*
	 * Bootstrap function to run initialize a Hapi server.
	 */
	tools.createHapiServer = function createHapiServer(cb) {
	  return Webtask.fromHapi(tools.createServer(cb));
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.JwksClient = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _debug = __webpack_require__(7);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _request = __webpack_require__(23);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _ArgumentError = __webpack_require__(13);
	
	var _ArgumentError2 = _interopRequireDefault(_ArgumentError);
	
	var _JwksError = __webpack_require__(14);
	
	var _JwksError2 = _interopRequireDefault(_JwksError);
	
	var _SigningKeyNotFoundError = __webpack_require__(16);
	
	var _SigningKeyNotFoundError2 = _interopRequireDefault(_SigningKeyNotFoundError);
	
	var _utils = __webpack_require__(58);
	
	var _wrappers = __webpack_require__(60);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var JwksClient = exports.JwksClient = function () {
	  function JwksClient(options) {
	    var _this = this;
	
	    _classCallCheck(this, JwksClient);
	
	    this.getSigningKey = function (kid, cb) {
	      _this.logger('Fetching signing key for \'' + kid + '\'');
	
	      _this.getSigningKeys(function (err, keys) {
	        if (err) {
	          return cb(err);
	        }
	
	        var key = keys.find(function (k) {
	          return k.kid === kid;
	        });
	        if (key) {
	          return cb(null, key);
	        } else {
	          _this.logger('Unable to find a signing key that matches \'' + kid + '\'');
	          return cb(new _SigningKeyNotFoundError2.default('Unable to find a signing key that matches \'' + kid + '\''));
	        }
	      });
	    };
	
	    this.options = _extends({ rateLimit: false, cache: false, strictSsl: true }, options);
	    this.logger = (0, _debug2.default)('jwks');
	
	    // Initialize wrappers.
	    if (this.options.rateLimit) {
	      this.getSigningKey = (0, _wrappers.rateLimitSigningKey)(this, options);
	    }
	    if (this.options.cache) {
	      this.getSigningKey = (0, _wrappers.cacheSigningKey)(this, options);
	    }
	  }
	
	  _createClass(JwksClient, [{
	    key: 'getKeys',
	    value: function getKeys(cb) {
	      var _this2 = this;
	
	      this.logger('Fetching keys from \'' + this.options.jwksUri + '\'');
	      (0, _request2.default)({ json: true, uri: this.options.jwksUri, strictSSL: this.options.strictSsl }, function (err, res) {
	        if (err || res.statusCode < 200 || res.statusCode >= 300) {
	          _this2.logger('Failure:', res && res.body || err);
	          if (res) {
	            return cb(new _JwksError2.default(res.body && (res.body.message || res.body) || res.statusMessage || 'Http Error ' + res.statusCode));
	          }
	          return cb(err);
	        }
	
	        _this2.logger('Keys:', res.body.keys);
	        return cb(null, res.body.keys);
	      });
	    }
	  }, {
	    key: 'getSigningKeys',
	    value: function getSigningKeys(cb) {
	      var _this3 = this;
	
	      this.getKeys(function (err, keys) {
	        if (err) {
	          return cb(err);
	        }
	
	        if (!keys || !keys.length) {
	          return cb(new _JwksError2.default('The JWKS endpoint did not contain any keys'));
	        }
	
	        var signingKeys = keys.filter(function (key) {
	          return key.use === 'sig' && key.kty === 'RSA' && key.kid && (key.x5c && key.x5c.length || key.n && key.e);
	        }).map(function (key) {
	          if (key.x5c && key.x5c.length) {
	            return { kid: key.kid, nbf: key.nbf, publicKey: (0, _utils.certToPEM)(key.x5c[0]) };
	          } else {
	            return { kid: key.kid, nbf: key.nbf, rsaPublicKey: (0, _utils.rsaPublicKeyToPEM)(key.n, key.e) };
	          }
	        });
	
	        if (!signingKeys.length) {
	          return cb(new _JwksError2.default('The JWKS endpoint did not contain any signing keys'));
	        }
	
	        _this3.logger('Signing Keys:', signingKeys);
	        return cb(null, signingKeys);
	      });
	    }
	  }]);
	
	  return JwksClient;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SigningKeyNotFoundError = exports.JwksRateLimitError = exports.JwksError = exports.ArgumentError = undefined;
	
	var _ArgumentError2 = __webpack_require__(13);
	
	var _ArgumentError3 = _interopRequireDefault(_ArgumentError2);
	
	var _JwksError2 = __webpack_require__(14);
	
	var _JwksError3 = _interopRequireDefault(_JwksError2);
	
	var _JwksRateLimitError2 = __webpack_require__(15);
	
	var _JwksRateLimitError3 = _interopRequireDefault(_JwksRateLimitError2);
	
	var _SigningKeyNotFoundError2 = __webpack_require__(16);
	
	var _SigningKeyNotFoundError3 = _interopRequireDefault(_SigningKeyNotFoundError2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.ArgumentError = _ArgumentError3.default;
	exports.JwksError = _JwksError3.default;
	exports.JwksRateLimitError = _JwksRateLimitError3.default;
	exports.SigningKeyNotFoundError = _SigningKeyNotFoundError3.default;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const server = __webpack_require__(34);
	const urlHelpers = __webpack_require__(35);
	const middlewares = __webpack_require__(29);
	
	/*
	 * Bootstrap function to run initialize an Express server.
	 */
	module.exports.createServer = server.createServer;
	
	/*
	 * Helpers to figure out the full url and the base path based on the request
	 */
	module.exports.urlHelpers = urlHelpers;
	
	/*
	 * Useful middlewares
	 */
	module.exports.middlewares = middlewares;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(3);
	const ArgumentError = __webpack_require__(1).ArgumentError;
	
	module.exports.fromWebtaskContext = function(webtaskContext) {
	  if (webtaskContext === null || webtaskContext === undefined) {
	    throw new ArgumentError('Must provide a webtask context');
	  }
	
	  const settings = _.assign({ }, ({"NODE_ENV":"production","CLIENT_VERSION":"1.8.0"}), webtaskContext.params, webtaskContext.secrets, {
	    NODE_ENV: 'production',
	    HOSTING_ENV: 'webtask'
	  });
	
	  return function getSettings(key) {
	    return settings[key];
	  };
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(2).config();

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	function ArgumentError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ArgumentError';
	  this.message = message;
	}
	
	ArgumentError.prototype = Object.create(Error.prototype);
	ArgumentError.prototype.constructor = ArgumentError;
	module.exports = ArgumentError;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	function JwksError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'JwksError';
	  this.message = message;
	}
	
	JwksError.prototype = Object.create(Error.prototype);
	JwksError.prototype.constructor = JwksError;
	module.exports = JwksError;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	function JwksRateLimitError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'JwksRateLimitError';
	  this.message = message;
	}
	
	JwksRateLimitError.prototype = Object.create(Error.prototype);
	JwksRateLimitError.prototype.constructor = JwksRateLimitError;
	module.exports = JwksRateLimitError;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	function SigningKeyNotFoundError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'SigningKeyNotFoundError';
	  this.message = message;
	}
	
	SigningKeyNotFoundError.prototype = Object.create(Error.prototype);
	SigningKeyNotFoundError.prototype.constructor = SigningKeyNotFoundError;
	module.exports = SigningKeyNotFoundError;

/***/ },
/* 17 */
/***/ function(module, exports) {

	
	/**
	 * A hierarchical token bucket for rate limiting. See
	 * http://en.wikipedia.org/wiki/Token_bucket for more information.
	 * @author John Hurliman <jhurliman@cull.tv>
	 *
	 * @param {Number} bucketSize Maximum number of tokens to hold in the bucket.
	 *  Also known as the burst rate.
	 * @param {Number} tokensPerInterval Number of tokens to drip into the bucket
	 *  over the course of one interval.
	 * @param {String|Number} interval The interval length in milliseconds, or as
	 *  one of the following strings: 'second', 'minute', 'hour', day'.
	 * @param {TokenBucket} parentBucket Optional. A token bucket that will act as
	 *  the parent of this bucket.
	 */
	var TokenBucket = function(bucketSize, tokensPerInterval, interval, parentBucket) {
	  this.bucketSize = bucketSize;
	  this.tokensPerInterval = tokensPerInterval;
	
	  if (typeof interval === 'string') {
	    switch (interval) {
	      case 'sec': case 'second':
	        this.interval = 1000; break;
	      case 'min': case 'minute':
	        this.interval = 1000 * 60; break;
	      case 'hr': case 'hour':
	        this.interval = 1000 * 60 * 60; break;
	      case 'day':
	        this.interval = 1000 * 60 * 60 * 24; break;
	    }
	  } else {
	    this.interval = interval;
	  }
	
	  this.parentBucket = parentBucket;
	  this.content = 0;
	  this.lastDrip = +new Date();
	};
	
	TokenBucket.prototype = {
	  bucketSize: 1,
	  tokensPerInterval: 1,
	  interval: 1000,
	  parentBucket: null,
	  content: 0,
	  lastDrip: 0,
	
	  /**
	   * Remove the requested number of tokens and fire the given callback. If the
	   * bucket (and any parent buckets) contains enough tokens this will happen
	   * immediately. Otherwise, the removal and callback will happen when enough
	   * tokens become available.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Function} callback(err, remainingTokens)
	   * @returns {Boolean} True if the callback was fired immediately, otherwise
	   *  false.
	   */
	  removeTokens: function(count, callback) {
	    var self = this;
	
	    // Is this an infinite size bucket?
	    if (!this.bucketSize) {
	      process.nextTick(callback.bind(null, null, count, Number.POSITIVE_INFINITY));
	      return true;
	    }
	
	    // Make sure the bucket can hold the requested number of tokens
	    if (count > this.bucketSize) {
	      process.nextTick(callback.bind(null, 'Requested tokens ' + count + ' exceeds bucket size ' +
	        this.bucketSize, null));
	      return false;
	    }
	
	    // Drip new tokens into this bucket
	    this.drip();
	
	    // If we don't have enough tokens in this bucket, come back later
	    if (count > this.content)
	      return comeBackLater();
	
	    if (this.parentBucket) {
	      // Remove the requested from the parent bucket first
	      return this.parentBucket.removeTokens(count, function(err, remainingTokens) {
	        if (err) return callback(err, null);
	
	        // Check that we still have enough tokens in this bucket
	        if (count > self.content)
	          return comeBackLater();
	
	        // Tokens were removed from the parent bucket, now remove them from
	        // this bucket and fire the callback. Note that we look at the current
	        // bucket and parent bucket's remaining tokens and return the smaller
	        // of the two values
	        self.content -= count;
	        callback(null, Math.min(remainingTokens, self.content));
	      });
	    } else {
	      // Remove the requested tokens from this bucket and fire the callback
	      this.content -= count;
	      process.nextTick(callback.bind(null, null, this.content));
	      return true;
	    }
	
	    function comeBackLater() {
	      // How long do we need to wait to make up the difference in tokens?
	      var waitInterval = Math.ceil(
	        (count - self.content) * (self.interval / self.tokensPerInterval));
	      setTimeout(function() { self.removeTokens(count, callback); }, waitInterval);
	      return false;
	    }
	  },
	
	  /**
	   * Attempt to remove the requested number of tokens and return immediately.
	   * If the bucket (and any parent buckets) contains enough tokens this will
	   * return true, otherwise false is returned.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Boolean} True if the tokens were successfully removed, otherwise
	   *  false.
	   */
	  tryRemoveTokens: function(count) {
	    // Is this an infinite size bucket?
	    if (!this.bucketSize)
	      return true;
	
	    // Make sure the bucket can hold the requested number of tokens
	    if (count > this.bucketSize)
	      return false;
	
	    // Drip new tokens into this bucket
	    this.drip();
	
	    // If we don't have enough tokens in this bucket, return false
	    if (count > this.content)
	      return false;
	
	    // Try to remove the requested tokens from the parent bucket
	    if (this.parentBucket && !this.parent.tryRemoveTokens(count))
	      return false;
	
	    // Remove the requested tokens from this bucket and return
	    this.content -= count;
	    return true;
	  },
	
	  /**
	   * Add any new tokens to the bucket since the last drip.
	   * @returns {Boolean} True if new tokens were added, otherwise false.
	   */
	  drip: function() {
	    if (!this.tokensPerInterval) {
	      this.content = this.bucketSize;
	      return;
	    }
	
	    var now = +new Date();
	    var deltaMS = Math.max(now - this.lastDrip, 0);
	    this.lastDrip = now;
	
	    var dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
	    this.content = Math.min(this.content + dripAmount, this.bucketSize);
	  }
	};
	
	module.exports = TokenBucket;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	const LRU        = __webpack_require__(21);
	const _          = __webpack_require__(3);
	const lru_params = [ 'max', 'maxAge', 'length', 'dispose', 'stale' ];
	const deepFreeze = __webpack_require__(64);
	
	module.exports = function (options) {
	  const cache      = new LRU(_.pick(options, lru_params));
	  const load       = options.load;
	  const hash       = options.hash;
	  const bypass     = options.bypass;
	  const itemMaxAge = options.itemMaxAge;
	  const freeze      = options.freeze;
	  const loading    = new Map();
	
	  if (options.disable) {
	      _.extend(load, { del }, options);
	    return load;
	  }
	
	  function del() {
	    const key = hash.apply(this, arguments);
	    cache.del(key);
	  }
	
	  const result = function () {
	    const args       = _.toArray(arguments);
	    const parameters = args.slice(0, -1);
	    const callback   = args.slice(-1).pop();
	    const self       = this;
	
	    var key;
	
	    if (bypass && bypass.apply(self, parameters)) {
	      return load.apply(self, args);
	    }
	
	    if (parameters.length === 0 && !hash) {
	      //the load function only receives callback.
	      key = '_';
	    } else {
	      key = hash.apply(self, parameters);
	    }
	
	    var fromCache = cache.get(key);
	
	    if (fromCache) {
	      return callback.apply(null, [null].concat(fromCache));
	    }
	
	    if (!loading.get(key)) {
	      loading.set(key, []);
	
	      load.apply(self, parameters.concat(function (err) {
	        const args = Array.from(arguments);
	
	        //we store the result only if the load didn't fail.
	        if (!err) {
	          const result = args.slice(1);
	          if (freeze) {
	            args.forEach(deepFreeze);
	          }
	          if (itemMaxAge) {
	            cache.set(key, result, itemMaxAge.apply(self, parameters.concat(result)));
	          } else {
	            cache.set(key, result);
	          }
	        }
	
	        //immediately call every other callback waiting
	        loading.get(key).forEach(function (callback) {
	          callback.apply(null, args);
	        });
	
	        loading.delete(key);
	        /////////
	
	        callback.apply(null, args);
	      }));
	    } else {
	      loading.get(key).push(callback);
	    }
	  };
	
	  result.keys = cache.keys.bind(cache);
	
	  _.extend(result, { del }, options);
	
	  return result;
	};
	
	
	module.exports.sync = function (options) {
	  const cache = new LRU(_.pick(options, lru_params));
	  const load = options.load;
	  const hash = options.hash;
	  const disable = options.disable;
	  const bypass = options.bypass;
	  const self = this;
	  const itemMaxAge = options.itemMaxAge;
	
	  if (disable) {
	    return load;
	  }
	
	  const result = function () {
	    var args = _.toArray(arguments);
	
	    if (bypass && bypass.apply(self, arguments)) {
	      return load.apply(self, arguments);
	    }
	
	    var key = hash.apply(self, args);
	
	    var fromCache = cache.get(key);
	
	    if (fromCache) {
	      return fromCache;
	    }
	
	    const result = load.apply(self, args);
	    if (itemMaxAge) {
	      cache.set(key, result, itemMaxAge.apply(self, args.concat([ result ])));
	    } else {
	      cache.set(key, result);
	    }
	
	    return result;
	  };
	
	  result.keys = cache.keys.bind(cache);
	
	  return result;
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("express-jwt");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("lru-cache");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("ms");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("superagent");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("webtask-tools");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var LRU     = __webpack_require__(21);
	var request = __webpack_require__(23);
	var _       = __webpack_require__(3);
	
	var secretsCacheOptions = {
	  // 5 M unicode points => ~10 MB
	  max: 1024 * 1024 * 5,
	  length: function (s) { return s.length; },
	  maxAge: 1000 * 60 * 5
	};
	
	var secretsCache = LRU(secretsCacheOptions);
	
	function certToPEM (cert) {
	  cert = cert.match(/.{1,64}/g).join('\n');
	  cert = "-----BEGIN CERTIFICATE-----\n" + cert;
	  cert = cert + "\n-----END CERTIFICATE-----\n";
	  return cert;
	}
	
	module.exports = function (opt) {
	  opt           = opt || {};
	  opt.strictSSL = typeof opt.strictSSL === 'undefined' ? true : opt.strictSSL;
	
	  return function secretCallback (req, header, payload, cb){
	    var cacheKey = payload.iss + '|' + payload.aud ;
	    var cachedSecret = secretsCache.get(cacheKey);
	
	    if (cachedSecret) {
	      return cb(null, cachedSecret);
	    }
	
	    switch (header.alg) {
	      case 'RS256': // asymmetric keys
	        var url = payload.iss + '.well-known/jwks.json';
	
	        request.get(url, { json: true, strictSSL: opt.strictSSL }, function (err, resp, jwks) {
	          if (err) {
	            return cb(err);
	          }
	          if (resp.statusCode !== 200) {
	            return cb(new Error('Failed to obtain JWKS from ' + payload.iss));
	          }
	
	          // TODO: Make this more resilient to JWKS and tokens that don't indicate a kid.
	          var key = _.find(jwks.keys, function(key) {
	            return key.kid == header.kid;
	          });
	
	          if (!key) {
	            return cb(new Error('Failed to obtain signing key used by ' + payload.iss));
	          }
	          // TODO: Make this more resilient to keys that don't include x5c
	          var publicKey = certToPEM(key.x5c[0]);
	          secretsCache.set(cacheKey, publicKey);
	          return cb(null, publicKey);
	        });
	        break;
	      default:
	        return cb(new Error('Unsupported JWT algorithm: ' + header.alg));
	    }
	  };
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	const jwt = __webpack_require__(20);
	const jwksRsa = __webpack_require__(55);
	const UnauthorizedError = __webpack_require__(2).UnauthorizedError;
	
	module.exports = function(domain, audience) {
	  return jwt({
	    secret: jwksRsa.expressJwtSecret({
	      cache: true,
	      rateLimit: true,
	      jwksRequestsPerMinute: 5,
	      jwksUri: 'https://' + domain + '/.well-known/jwks.json',
	      handleSigningKeyError: function(err, cb) {
	        if (err instanceof jwksRsa.SigningKeyNotFoundError) {
	          return cb(new UnauthorizedError('A token was provided with an invalid kid'));
	        }
	
	        return cb(err);
	      }
	    }),
	
	    // Validate the audience and the issuer.
	    audience: audience,
	    issuer: 'https://' + domain + '/',
	    algorithms: [ 'RS256' ]
	  });
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(errorLogger) {
	  return function(err, req, res, next) {
	    if (errorLogger) {
	      errorLogger(err);
	    }
	
	    if (err && err.status) {
	      res.status(err.status);
	      return res.json({
	        error: err.code || err.name,
	        message: err.message || err.name
	      });
	    }
	
	    res.status(err.status || 500);
	    if (true) {
	      return res.json({
	        error: 'InternalServerError',
	        message: err.message || err.name
	      });
	    }
	
	    return res.json({
	      error: 'InternalServerError',
	      message: err.message || err.name,
	      details: {
	        message: err.message,
	        status: err.status,
	        stack: err.stack
	      }
	    });
	  };
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.authenticateUser = __webpack_require__(27);
	module.exports.requireUser = __webpack_require__(31);
	module.exports.errorHandler = __webpack_require__(28);
	module.exports.managementApiClient = __webpack_require__(30);
	module.exports.validateHookToken = __webpack_require__(32);
	module.exports.webtaskConfig = __webpack_require__(33);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	const tools = __webpack_require__(2);
	
	module.exports = function(options) {
	  return function(req, res, next) {
	    const request = req;
	    tools.managementApi.getClient(options)
	      .then(function(auth0) {
	        request.auth0 = auth0;
	        return next();
	      })
	      .catch(function(err) {
	        next(err);
	      });
	  };
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	const UnauthorizedError = __webpack_require__(2).UnauthorizedError;
	
	module.exports = function(req, res, next) {
	  if (!req.user) {
	    return next(new UnauthorizedError('Authentication required for this endpoint.'));
	  }
	
	  return next();
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	const tools = __webpack_require__(2);
	
	module.exports = function(domain, webtaskUrl, extensionSecret) {
	  if (domain === null || domain === undefined) {
	    throw new tools.ArgumentError('Must provide the domain');
	  }
	
	  if (typeof domain !== 'string' || domain.length === 0) {
	    throw new tools.ArgumentError('The provided domain is invalid: ' + domain);
	  }
	
	  if (webtaskUrl === null || webtaskUrl === undefined) {
	    throw new tools.ArgumentError('Must provide the webtaskUrl');
	  }
	
	  if (typeof webtaskUrl !== 'string' || webtaskUrl.length === 0) {
	    throw new tools.ArgumentError('The provided webtaskUrl is invalid: ' + webtaskUrl);
	  }
	
	  if (extensionSecret === null || extensionSecret === undefined) {
	    throw new tools.ArgumentError('Must provide the extensionSecret');
	  }
	
	  if (typeof extensionSecret !== 'string' || extensionSecret.length === 0) {
	    throw new tools.ArgumentError('The provided extensionSecret is invalid: ' + extensionSecret);
	  }
	
	  return function(hookPath) {
	    if (hookPath === null || hookPath === undefined) {
	      throw new tools.ArgumentError('Must provide the hookPath');
	    }
	
	    if (typeof hookPath !== 'string' || hookPath.length === 0) {
	      throw new tools.ArgumentError('The provided hookPath is invalid: ' + hookPath);
	    }
	
	    return function(req, res, next) {
	      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
	        const token = req.headers.authorization.split(' ')[1];
	
	        try {
	          if (tools.validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, token)) {
	            return next();
	          }
	        } catch (e) {
	          return next(e);
	        }
	      }
	
	      return next(new tools.HookTokenError('Hook token missing for the call to: ' + hookPath));
	    };
	  };
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	const tools = __webpack_require__(2);
	
	module.exports = function(config) {
	  return function(req, res, next) {
	    if (req.webtaskContext) {
	      config.setProvider(tools.configProvider.fromWebtaskContext(req.webtaskContext));
	    }
	
	    return next();
	  };
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	const tools = __webpack_require__(2);
	const Webtask = __webpack_require__(25);
	
	module.exports.createServer = function(cb) {
	  return Webtask.fromExpress(tools.createServer(cb));
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	const url = __webpack_require__(9);
	
	const getBasePath = function(originalUrl, path) {
	  var basePath = url.parse(originalUrl).pathname || '';
	  basePath = basePath.replace(path, '')
	    .replace(/^\/|\/$/g, '');
	  if (!basePath.startsWith('/')) {
	    basePath = '/' + basePath;
	  }
	  if (!basePath.endsWith('/')) {
	    basePath += '/';
	  }
	  return basePath;
	};
	
	module.exports.getBasePath = function(req) {
	  return getBasePath(req.originalUrl || '', req.path);
	};
	
	module.exports.getBaseUrl = function(req) {
	  const originalUrl = url.parse(req.originalUrl || '').pathname || '';
	  return url.format({
	    protocol:  false ? 'http' : 'https',
	    host: req.get('host'),
	    pathname: originalUrl.replace(req.path, '')
	  });
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	const ms = __webpack_require__(22);
	const jwt = __webpack_require__(8);
	const auth0 = __webpack_require__(65);
	const Promise = __webpack_require__(6);
	const memoizer = __webpack_require__(18);
	const request = __webpack_require__(24);
	
	const ArgumentError = __webpack_require__(1).ArgumentError;
	const ManagementApiError = __webpack_require__(1).ManagementApiError;
	
	const getAccessToken = function(domain, clientId, clientSecret) {
	  return new Promise(function(resolve, reject) {
	    request
	      .post('https://' + domain + '/oauth/token')
	      .send({
	        audience: 'https://' + domain + '/api/v2/',
	        client_id: clientId,
	        client_secret: clientSecret,
	        grant_type: 'client_credentials'
	      })
	      .set('Accept', 'application/json')
	      .end(function(err, res) {
	        if (err && err.status === 401) {
	          return reject(new ManagementApiError('unauthorized', 'Invalid credentials for ' + clientId, err.status));
	        } else if (err && res && res.body && res.body.error) {
	          return reject(new ManagementApiError(res.body.error, res.body.error_description || res.body.error, err.status));
	        } else if (err) {
	          return reject(err);
	        }
	
	        if (!res.ok || !res.body.access_token) {
	          return reject(new ManagementApiError('unknown_error', 'Unknown error from Management Api or no access token was provided: ' + (res.text || res.status)));
	        }
	
	        return resolve(res.body.access_token);
	      });
	  });
	};
	
	const getAccessTokenCached = Promise.promisify(
	  memoizer({
	    load: function(domain, clientId, clientSecret, callback) {
	      getAccessToken(domain, clientId, clientSecret)
	        .then(function(accessToken) {
	          return callback(null, accessToken);
	        })
	        .catch(function(err) {
	          return callback(err);
	        });
	    },
	    hash: function(domain, clientId, clientSecret) {
	      return domain + '-' + clientId + '-' + clientSecret;
	    },
	    itemMaxAge: function(domain, clientId, clientSecret, accessToken) {
	      try {
	        const decodedToken = jwt.decode(accessToken);
	        const expiresIn = new Date(0);
	        expiresIn.setUTCSeconds(decodedToken.exp);
	        const now = new Date().valueOf();
	        return (expiresIn.valueOf() - now) - 10000;
	      } catch (e) {
	        return 1000;
	      }
	    },
	    max: 100,
	    maxAge: ms('1h')
	  }
	));
	
	module.exports.getAccessToken = getAccessToken;
	module.exports.getAccessTokenCached = getAccessTokenCached;
	module.exports.getClient = function(options) {
	  if (options === null || options === undefined) {
	    throw new ArgumentError('An options object must be provided');
	  }
	
	  if (options.domain === null || options.domain === undefined) {
	    throw new ArgumentError('An options object must contain the domain');
	  }
	
	  if (typeof options.domain !== 'string' || options.domain.length === 0) {
	    throw new ArgumentError('The provided domain is invalid: ' + options.domain);
	  }
	
	  if (options.accessToken) {
	    if (typeof options.accessToken !== 'string' || options.accessToken.length === 0) {
	      throw new ArgumentError('The provided accessToken is invalid');
	    }
	
	    return Promise.resolve(new auth0.ManagementClient({ domain: options.domain, token: options.accessToken }));
	  }
	
	  if (options.clientId === null || options.clientId === undefined) {
	    throw new ArgumentError('An options object must contain the clientId');
	  }
	
	  if (typeof options.clientId !== 'string' || options.clientId.length === 0) {
	    throw new ArgumentError('The provided clientId is invalid: ' + options.clientId);
	  }
	
	  if (options.clientSecret === null || options.clientSecret === undefined) {
	    throw new ArgumentError('An options object must contain the clientSecret');
	  }
	
	  if (typeof options.clientSecret !== 'string' || options.clientSecret.length === 0) {
	    throw new ArgumentError('The provided clientSecret is invalid');
	  }
	
	  return getAccessTokenCached(options.domain, options.clientId, options.clientSecret)
	    .then(function(token) {
	      return new auth0.ManagementClient({ domain: options.domain, token: token });
	    });
	};


/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = function() {
	  var currentProvider = null;
	
	  const config = function(key) {
	    if (!currentProvider) {
	      throw new Error('A configuration provider has not been set');
	    }
	
	    return currentProvider(key);
	  };
	
	  config.setProvider = function(providerFunction) {
	    currentProvider = providerFunction;
	  };
	
	  return config;
	};


/***/ },
/* 38 */
/***/ function(module, exports) {

	function ArgumentError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ArgumentError';
	  this.message = message;
	  this.status = 400;
	}
	
	ArgumentError.prototype = Object.create(Error.prototype);
	ArgumentError.prototype.constructor = ArgumentError;
	module.exports = ArgumentError;


/***/ },
/* 39 */
/***/ function(module, exports) {

	function HookTokenError(message, innerError) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'HookTokenError';
	  this.message = message;
	  this.status = 401;
	  this.innerError = innerError;
	}
	
	HookTokenError.prototype = Object.create(Error.prototype);
	HookTokenError.prototype.constructor = HookTokenError;
	module.exports = HookTokenError;


/***/ },
/* 40 */
/***/ function(module, exports) {

	function ManagementApiError(code, message, status) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ManagementApiError';
	  this.code = code;
	  this.message = message;
	  this.status = status || 400;
	}
	
	ManagementApiError.prototype = Object.create(Error.prototype);
	ManagementApiError.prototype.constructor = ManagementApiError;
	module.exports = ManagementApiError;


/***/ },
/* 41 */
/***/ function(module, exports) {

	function NotFoundError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'NotFoundError';
	  this.message = message;
	  this.status = 404;
	}
	
	NotFoundError.prototype = Object.create(Error.prototype);
	NotFoundError.prototype.constructor = NotFoundError;
	module.exports = NotFoundError;


/***/ },
/* 42 */
/***/ function(module, exports) {

	function ValidationError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ValidationError';
	  this.message = message;
	  this.status = 400;
	}
	
	ValidationError.prototype = Object.create(Error.prototype);
	ValidationError.prototype.constructor = ValidationError;
	module.exports = ValidationError;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	const jwt = __webpack_require__(8);
	const HookTokenError = __webpack_require__(1).HookTokenError;
	
	module.exports = function validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, hookToken) {
	  if (!hookToken) {
	    throw new HookTokenError('Hook token missing');
	  }
	
	  try {
	    jwt.verify(hookToken, extensionSecret, {
	      audience: webtaskUrl + hookPath,
	      issuer: 'https://' + domain
	    });
	    return true;
	  } catch (e) {
	    throw new HookTokenError('Invalid hook token', e);
	  }
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(3);
	const uuid = __webpack_require__(71);
	const ArgumentError = __webpack_require__(1).ArgumentError;
	const NotFoundError = __webpack_require__(1).NotFoundError;
	const ValidationError = __webpack_require__(1).ValidationError;
	
	const getDataForCollection = function(storageContext, collectionName) {
	  return storageContext.read(collectionName)
	    .then(function(data) {
	      data[collectionName] = data[collectionName] || [];
	      return data;
	    });
	};
	
	/**
	 * Create a new BlobRecordProvider.
	 * @param {Object} storageContext The storage context.
	 * @constructor
	 */
	function BlobRecordProvider(storageContext) {
	  if (storageContext === null || storageContext === undefined) {
	    throw new ArgumentError('Must provide a storage context');
	  }
	
	  this.storageContext = storageContext;
	}
	
	/**
	 * Get all records for a collection.
	 * @param {string} collectionName The name of the collection.
	 * @return {Array} The records.
	 */
	BlobRecordProvider.prototype.getAll = function(collectionName) {
	  return getDataForCollection(this.storageContext, collectionName)
	    .then(function(data) {
	      return data[collectionName];
	    });
	};
	
	/**
	 * Get a single record from a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {string} identifier The identifier of the record.
	 * @return {Object} The record.
	 */
	BlobRecordProvider.prototype.get = function(collectionName, identifier) {
	  return this.getAll(collectionName)
	    .then(function(records) {
	      const record = _.find(records, function(r) { return r._id === identifier });
	      if (!record) {
	        return Promise.reject(
	          new NotFoundError('The record ' + identifier + ' in ' + collectionName + ' does not exist.')
	        );
	      }
	
	      return record;
	    });
	};
	
	/**
	 * Create a record in a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {Object} record The record.
	 * @return {Object} The record.
	 */
	BlobRecordProvider.prototype.create = function(collectionName, record) {
	  const storageContext = this.storageContext;
	  return getDataForCollection(storageContext, collectionName)
	    .then(function(data) {
	      if (!record._id) {
	        record._id = uuid.v4();
	      }
	
	      const index = _.findIndex(data[collectionName], function(r) { return r._id === record._id; });
	      if (index > -1) {
	        return Promise.reject(
	          new ValidationError('The record ' + record._id + ' in ' + collectionName + ' already exists.')
	        );
	      }
	
	      // Add to dataset.
	      data[collectionName].push(record);
	
	      // Save.
	      return storageContext.write(data)
	        .then(function() {
	          return record;
	        });
	    });
	};
	
	/**
	 * Update a record in a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {string} identifier The identifier of the record to update.
	 * @param {Object} record The record.
	 * @param {boolean} upsert Flag allowing to upsert if the record does not exist.
	 * @return {Object} The record.
	 */
	BlobRecordProvider.prototype.update = function(collectionName, identifier, record, upsert) {
	  const storageContext = this.storageContext;
	  return getDataForCollection(storageContext, collectionName)
	    .then(function(data) {
	      const index = _.findIndex(data[collectionName], function(r) { return r._id === identifier; });
	      if (index < 0 && !upsert) {
	        throw new NotFoundError('The record ' + identifier + ' in ' + collectionName + ' does not exist.');
	      }
	
	      // Update record.
	      const updatedRecord = _.extend({ _id: identifier }, index < 0 ? { } : data[collectionName][index], record);
	      if (index < 0) {
	        data[collectionName].push(updatedRecord);
	      } else {
	        data[collectionName][index] = updatedRecord;
	      }
	
	      // Save.
	      return storageContext.write(data)
	        .then(function() {
	          return updatedRecord;
	        });
	    });
	};
	
	/**
	 * Delete a record in a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {string} identifier The identifier of the record to update.
	 */
	BlobRecordProvider.prototype.delete = function(collectionName, identifier) {
	  const storageContext = this.storageContext;
	  return getDataForCollection(storageContext, collectionName)
	    .then(function(data) {
	      const index = _.findIndex(data[collectionName], function(r) { return r._id === identifier; });
	      if (index < 0) {
	        return false;
	      }
	
	      // Remove the record.
	      data[collectionName].splice(index, 1);
	
	      // Save.
	      return storageContext.write(data)
	        .then(function() {
	          return true;
	        });
	    });
	};
	
	/**
	 * Module exports.
	 * @type {function}
	 */
	module.exports = BlobRecordProvider;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	const configProvider = __webpack_require__(11);
	
	module.exports.createServer = function(cb) {
	  var server = null;
	
	  return function requestHandler(req, res) {
	    if (!server) {
	      const config = configProvider.fromWebtaskContext(req.webtaskContext);
	      server = cb(req, config, req.webtaskContext.storage);
	    }
	
	    return server(req, res);
	  };
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(3);
	const fs = __webpack_require__(69);
	const Promise = __webpack_require__(6);
	
	const ArgumentError = __webpack_require__(1).ArgumentError;
	
	/**
	 * Create a new FileStorageContext.
	 * @param {string} path The full path to the file.
	 * @param {Object} options The options object.
	 * @param {boolean} options.mergeWrites Merge the data from the local file with the new payload when writing a file.
	 *     (defaults to `true` if options is not defined).
	 * @param {Object} options.defaultData The default data to use when the file does not exist or is empty.
	 * @constructor
	 */
	function FileStorageContext(path, options) {
	  if (path === null || path === undefined) {
	    throw new ArgumentError('Must provide the path to the file');
	  }
	
	  if (typeof path !== 'string' || path.length === 0) {
	    throw new ArgumentError('The provided path is invalid: ' + path);
	  }
	
	  options = options || { mergeWrites: true };
	
	  this.path = path;
	  this.mergeWrites = options.mergeWrites;
	  this.defaultData = options.defaultData || {};
	}
	
	/**
	 * Read payload from the file.
	 * @return {object} The object parsed from the file.
	 */
	FileStorageContext.prototype.read = function() {
	  const ctx = this;
	  return new Promise(function readFileStorageContext(resolve, reject) {
	    fs.readFile(ctx.path, 'utf8', function(err, data) {
	      if (err) {
	        if (err.code === 'ENOENT') {
	          return resolve(ctx.defaultData);
	        }
	
	        return reject(err);
	      }
	      try {
	        if (data && data.length) {
	          return resolve(JSON.parse(data));
	        }
	
	        return resolve(ctx.defaultData);
	      } catch (e) {
	        return reject(e);
	      }
	    });
	  });
	};
	
	/**
	 * Write payload to the file.
	 * @param {object} payload The object to write.
	 */
	FileStorageContext.prototype.write = function(payload) {
	  const ctx = this;
	  var writePromise = Promise.resolve(payload);
	
	  if (ctx.mergeWrites) {
	    writePromise = writePromise.then(function(data) {
	      return ctx.read()
	        .then(function(originalData) {
	          return _.extend({ }, originalData, data);
	        });
	    });
	  }
	
	  return writePromise.then(function(data) {
	    return new Promise(function(resolve, reject) {
	      try {
	        return fs.writeFile(ctx.path, JSON.stringify(data, null, 2), 'utf8', function(err) {
	          if (err) {
	            return reject(err);
	          }
	
	          return resolve();
	        });
	      } catch (e) {
	        return reject(e);
	      }
	    });
	  });
	};
	
	/**
	 * Module exports.
	 * @type {function}
	 */
	module.exports = FileStorageContext;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.FileStorageContext = __webpack_require__(46);
	module.exports.WebtaskStorageContext = __webpack_require__(48);


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	const Promise = __webpack_require__(6);
	
	const ArgumentError = __webpack_require__(1).ArgumentError;
	
	/**
	 * Create a new WebtaskStorageContext.
	 * @param {Object} storage The Webtask storage object.
	 * @param {Object} options The options object.
	 * @param {int} options.force Disregard the possibility of a conflict.
	 * @param {Object} options.defaultData The default data to use when the file does not exist or is empty.
	 * @constructor
	 */
	function WebtaskStorageContext(storage, options) {
	  if (storage === null || storage === undefined) {
	    throw new ArgumentError('Must provide the Webtask storage object');
	  }
	
	  options = options || { force: 1 };
	
	  this.storage = storage;
	  this.options = options;
	  this.defaultData = options.defaultData || {};
	}
	
	/**
	 * Read payload from Webtask storage.
	 * @return {object} The object parsed from Webtask storage.
	 */
	WebtaskStorageContext.prototype.read = function() {
	  const ctx = this;
	  return new Promise(function readWebtaskStorageContext(resolve, reject) {
	    ctx.storage.get(function(err, data) {
	      if (err) {
	        return reject(err);
	      }
	
	      return resolve(data || ctx.defaultData);
	    });
	  });
	};
	
	/**
	 * Write data to Webtask storage.
	 * @param {object} data The object to write.
	 */
	WebtaskStorageContext.prototype.write = function(data) {
	  const ctx = this;
	  return new Promise(function(resolve, reject) {
	    ctx.storage.set(data, ctx.options, function(err) {
	      if (err) {
	        return reject(err);
	      }
	
	      return resolve();
	    });
	  });
	};
	
	/**
	 * Module exports.
	 * @type {function}
	 */
	module.exports = WebtaskStorageContext;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var express       = __webpack_require__(19);
	var jade          = __webpack_require__(70);
	var expressJwt    = __webpack_require__(20);
	var url           = __webpack_require__(9);
	var rsaValidation = __webpack_require__(26);
	var bodyParser    = __webpack_require__(66);
	var jwt           = __webpack_require__(8);
	var request       = __webpack_require__(24);
	
	var getClass = {}.toString;
	function isFunction(object) {
	  return object && getClass.call(object) == '[object Function]';
	}
	
	function fetchUserInfo (rootTenantAuthority) {
	  return function (req, res, next) {
	    request
	      .get(rootTenantAuthority + '/userinfo')
	      .set('Authorization', 'Bearer ' + req.body.access_token)
	      .end(function(err, userInfo){
	        if (err) {
	          res.redirect(res.locals.baseUrl);
	          return;
	        }
	
	        req.userInfo = userInfo.body;
	
	        next();
	      });
	  };
	}
	
	function generateApiToken (secretParam, expiresIn) {
	  return function (req, res, next) {
	    var secret = secretParam;
	    if (isFunction(secretParam)) {
	      secret = secretParam(req);
	    }
	
	    req.apiToken = jwt.sign(req.userInfo, secret, {
	      algorithm: 'HS256',
	      issuer: res.locals.baseUrl,
	      expiresIn: expiresIn
	    });
	
	    delete req.userinfo;
	    next();
	  };
	}
	
	function getUnAuthorizedTemplate (req, res) {
	  var template = [
	      'html',
	      '  head',
	      '    script.',
	      '      window.location.href = \'#{returnTo}\';',
	      '  body'
	    ].join('\n');
	  var content = jade.compile(template)({
	    returnTo: req.query && req.query.returnTo? req.query.returnTo : res.locals.baseUrl
	  });
	
	  return content;
	}
	
	module.exports = function (opt) {
	  var ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
	  var router              = express.Router();
	  var noop                = function (req, res, next) { next(); };
	  var callbackMiddlewares = [noop];
	
	  opt                     = opt || {};
	  opt.clientName          = opt.clientName || 'Auth0 Extension';
	  opt.clientId            = opt.clientId;
	  opt.exp                 = opt.exp || ONE_DAY_IN_MILLISECONDS;
	  opt.experimental        = opt.experimental || false;
	  // If we defaults to true all the routes will require authentication
	  opt.credentialsRequired = typeof opt.credentialsRequired === 'undefined' ? false : opt.credentialsRequired;
	  opt.scopes              = opt.scopes + ' openid profile';
	  opt.responseType        = opt.responseType || 'token';
	  opt.tokenExpiresIn      = opt.tokenExpiresIn || '10h';
	  opt.rootTenantAuthority = opt.rootTenantAuthority || 'https://auth0.auth0.com';
	  opt.authenticatedCallback = opt.authenticatedCallback || function(req, res, accessToken, next) {
	    next();
	  };
	
	  if (opt.apiToken && !opt.apiToken.secret) {
	    console.log('You are using a "development secret" for API token generation. Please setup your secret on "apiToken.secret".');
	    opt.apiToken.secret = __webpack_require__(67).randomBytes(32).toString('hex');
	  }
	
	  if (opt.apiToken && opt.apiToken.secret) {
	    callbackMiddlewares = [fetchUserInfo(opt.rootTenantAuthority), opt.apiToken.payload || noop, generateApiToken(opt.apiToken.secret, opt.tokenExpiresIn)];
	  }
	
	  router.use(function (req, res, next) {
	    var protocol = 'https';
	    var pathname = url.parse(req.originalUrl).pathname
	                      .replace(req.path, '');
	
	    if (false) {
	      protocol = req.protocol;
	      opt.clientId = opt.clientId || 'N3PAwyqXomhNu6IWivtsa3drBfFjmWJL';
	    }
	
	    res.locals.baseUrl = url.format({
	      protocol: protocol,
	      host:     req.get('host'),
	      pathname: pathname
	    });
	
	    next();
	  });
	
	  router.use(bodyParser.urlencoded({ extended: false }));
	
	  router.use(expressJwt({
	    secret:     rsaValidation(),
	    algorithms: ['RS256'],
	    credentialsRequired: opt.credentialsRequired
	  }).unless({path: ['/login', '/callback']}));
	
	  router.get('/login', function (req, res) {
	    var redirectUri = res.locals.baseUrl + '/callback';
	    if (req.query.returnTo){
	      redirectUri += '?returnTo=' + encodeURIComponent(req.query.returnTo);
	    }
	    var audience;
	    if (typeof opt.audience === 'string') {
	      audience = '&audience=' + encodeURIComponent(opt.audience);
	    }
	    else if (typeof opt.audience === 'function') {
	      var a = opt.audience(req);
	      if (typeof a === 'string') {
	        audience = '&audience=' + encodeURIComponent(a);
	      }
	    }
	    var authorizationUrl = [
	      opt.rootTenantAuthority + (opt.experimental ? '/authorize' : '/i/oauth2/authorize'),
	      '?client_id=' + (opt.clientId || res.locals.baseUrl),
	      '&response_type=' + opt.responseType,
	      '&response_mode=form_post',
	      '&scope=' + encodeURIComponent(opt.scopes),
	      '&expiration=' + opt.exp,
	      '&redirect_uri=' + redirectUri,
	      audience
	    ].join('');
	
	    res.redirect(authorizationUrl);
	  });
	
	  router.get('/logout', function (req, res) {
	    var template = [
	      'html',
	      '  head',
	      '    script.',
	      '      sessionStorage.removeItem(\'token\')',
	      '      sessionStorage.removeItem(\'apiToken\')',
	      '      window.location.href = \'' + opt.rootTenantAuthority + '/v2/logout?returnTo=#{baseUrl}&client_id=#{baseUrl}\';',
	      '  body'
	    ].join('\n');
	    var content = jade.compile(template)({
	      baseUrl: res.locals.baseUrl
	    });
	
	    res.header("Content-Type", 'text/html');
	    res.status(200).send(content);
	  });
	
	  router.post('/callback', callbackMiddlewares, function (req, res) {
	    var token  = req.body.access_token
	    var dtoken = jwt.decode(token, { complete: true }) || {};
	
	    // Getting secret
	    rsaValidation()(req, dtoken.header, dtoken.payload, function (err, secret) {
	      if (err) {
	        return res.status(200).send(getUnAuthorizedTemplate(res, res));
	      }
	
	      // Verifying access_token
	      try {
	        var decoded = jwt.verify(token, secret, { algorithms: ['RS256'] });
	        var aud     = decoded.aud;
	        var audience;
	
	        if (typeof opt.audience === 'string') {
	          audience = opt.audience;
	        }
	        else if (typeof opt.audience === 'function') {
	          var a = opt.audience(req);
	          if (typeof a === 'string') {
	            audience = a;
	          }
	        }
	
	        // Checking audience
	        if (aud === audience || aud.indexOf(audience) === -1) {
	          res.header("Content-Type", 'text/html');
	          return res.status(200).send(getUnAuthorizedTemplate(req, res));
	        }
	      } catch (e) {
	        return res.status(200).send(getUnAuthorizedTemplate(res, res));
	      }
	
	      opt.authenticatedCallback(req, res, req.body.access_token, function(err) {
	        if (err) {
	          return res.sendStatus(500);
	        }
	
	        var template = [
	          'html',
	          '  head',
	          '    script.',
	          '      sessionStorage.setItem(\'token\', \'' + req.body.access_token + '\');',
	          callbackMiddlewares.length === 1 ? '' : '      sessionStorage.setItem(\'apiToken\', \'' + req.apiToken + '\');',
	          '      window.location.href = \'#{returnTo}\';',
	          '  body'
	        ].join('\n');
	        var content = jade.compile(template)({
	          returnTo: req.query.returnTo? req.query.returnTo : res.locals.baseUrl
	        });
	
	        res.header("Content-Type", 'text/html');
	        res.status(200).send(content);
	      });
	    });
	  });
	
	  router.get('/.well-known/oauth2-client-configuration', function (req, res) {
	    res.header("Content-Type", 'application/json');
	    res.status(200).send({
	      redirect_uris: [res.locals.baseUrl + '/callback'],
	      client_name:   opt.clientName,
	      post_logout_redirect_uris: [res.locals.baseUrl]
	    });
	  });
	
	  return router;
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ejs = __webpack_require__(68);
	var cfg = __webpack_require__(12);
	var urlHelpers = __webpack_require__(10).urlHelpers;
	
	module.exports = function () {
	  var template = '\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n      <title>User Import / Export Dashboard</title>\n      <meta charset="UTF-8" />\n      <meta http-equiv="X-UA-Compatible" content="IE=Edge" />\n      <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n      <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/2.0.1/lib/logos/img/favicon.png">\n      <meta name="viewport" content="width=device-width, initial-scale=1">\n      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">\n      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.973/css/index.min.css">\n      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/3.8.4/index.css">\n      <% if (assets.version) { %>\n        <link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-user-import-export/assets/auth0-user-import-export.ui.<%= assets.version %>.css">\n      <% } %>\n    </head>\n    <body>\n      <div id="app"></div>\n      <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>\n      <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.min.js"></script>\n      <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.973/components/ZeroClipboard/ZeroClipboard.js"></script>\n      <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.973/js/bundle.js"></script>\n      <% if (assets.app) { %><script type="text/javascript" src="<%= assets.app %>"></script><% } %>\n      <% if (assets.version) { %>\n      <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-user-import-export/assets/auth0-user-import-export.ui.vendors.<%= assets.version %>.js"></script>\n      <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-user-import-export/assets/auth0-user-import-export.ui.<%= assets.version %>.js"></script>\n      <% } %>\n    </body>\n    </html>\n  ';
	
	  return function (req, res) {
	    var config = {
	      HOSTING_ENV: cfg('HOSTING_ENV'),
	      CLIENT_VERSION: cfg('CLIENT_VERSION') || '???',
	      AUTH0_DOMAIN: cfg('AUTH0_DOMAIN'),
	      BASE_URL: urlHelpers.getBaseUrl(req),
	      BASE_PATH: urlHelpers.getBasePath(req)
	    };
	
	    if (config.BASE_PATH.indexOf('/') !== 0) {
	      config.BASE_PATH = '/' + config.BASE_PATH;
	    }
	
	    // Render from CDN.
	    var clientVersion = cfg('CLIENT_VERSION');
	    if (clientVersion) {
	      return res.send(ejs.render(template, {
	        config: config,
	        assets: {
	          version: clientVersion
	        }
	      }));
	    }
	
	    return res.send(ejs.render(template, {
	      config: config,
	      assets: {
	        app: 'http://localhost:3001/app/bundle.js'
	      }
	    }));
	  };
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var express = __webpack_require__(19);
	var tools = __webpack_require__(10);
	
	var logger = __webpack_require__(52);
	var config = __webpack_require__(12);
	var metadata = __webpack_require__(54);
	var htmlRoute = __webpack_require__(50);
	var dashboardAdmins = __webpack_require__(53);
	
	module.exports = function (configProvider) {
	  config.setProvider(configProvider);
	
	  var app = express();
	  app.use('/meta', function (req, res) {
	    res.status(200).send(metadata);
	  });
	  app.use(dashboardAdmins(config('AUTH0_DOMAIN'), 'User Import / Export Extension', config('AUTH0_RTA')));
	  app.get('*', htmlRoute());
	
	  // Generic error handler.
	  app.use(tools.middlewares.errorHandler(logger.error.bind(logger)));
	  return app;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var winston = __webpack_require__(72);
	
	winston.emitErrs = true;
	
	var logger = new winston.Logger({
	  transports: [new winston.transports.Console({
	    timestamp: true,
	    level: 'debug',
	    handleExceptions: true,
	    json: false,
	    colorize: true
	  })],
	  exitOnError: false
	});
	
	module.exports = logger;
	module.exports.stream = {
	  write: function write(message) {
	    logger.info(message.replace(/\n$/, ''));
	  }
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var url = __webpack_require__(9);
	var auth0 = __webpack_require__(49);
	
	module.exports = function (domain, title, rta) {
	  if (!domain) throw new Error('Domain is required');
	  if (!title) throw new Error('title is required');
	
	  var options = {
	    credentialsRequired: false,
	    scopes: 'create:users read:users read:connections',
	    clientName: title,
	    audience: function audience() {
	      return 'https://' + domain + '/api/v2/';
	    },
	    rootTenantAuthority: rta
	  };
	
	  var middleware = auth0(options);
	  return function (req, res, next) {
	    var protocol = 'https';
	    var pathname = url.parse(req.originalUrl).pathname.replace(req.path, '');
	    var baseUrl = url.format({
	      protocol: protocol,
	      host: req.get('host'),
	      pathname: pathname
	    });
	
	    options.clientId = baseUrl;
	    return middleware(req, res, next);
	  };
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = {
		"title": "User Import / Export with Error Logs",
		"name": "auth0-user-import-export-error-logs",
		"version": "1.8.0",
		"author": "saltuk",
		"useHashName": false,
		"description": "This extension allows you to import/export users from/to your account.",
		"type": "application",
		"logoUrl": "https://cdn.rawgit.com/auth0/auth0-user-import-export-extension/master/assets/logo.svg",
		"initialUrlPath": "/login",
		"docsUrl": "https://auth0.com/docs/extensions/user-import-export",
		"repository": "https://github.com/auth0/auth0-user-import-export-extension",
		"keywords": [
			"auth0",
			"extension"
		],
		"auth0": {
			"scopes": "create:users read:users read:connections"
		}
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _JwksClient = __webpack_require__(4);
	
	var _errors = __webpack_require__(5);
	
	var errors = _interopRequireWildcard(_errors);
	
	var _hapi = __webpack_require__(57);
	
	var _express = __webpack_require__(56);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	module.exports = function (options) {
	  return new _JwksClient.JwksClient(options);
	};
	
	module.exports.ArgumentError = errors.ArgumentError;
	module.exports.JwksError = errors.JwksError;
	module.exports.JwksRateLimitError = errors.JwksRateLimitError;
	module.exports.SigningKeyNotFoundError = errors.SigningKeyNotFoundError;
	
	module.exports.expressJwtSecret = _express.expressJwtSecret;
	module.exports.hapiJwt2Key = _hapi.hapiJwt2Key;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _errors = __webpack_require__(5);
	
	var _JwksClient = __webpack_require__(4);
	
	var handleSigningKeyError = function handleSigningKeyError(err, cb) {
	  // If we didn't find a match, can't provide a key.
	  if (err && err.name === 'SigningKeyNotFoundError') {
	    return cb(null);
	  }
	
	  // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
	  if (err) {
	    return cb(err);
	  }
	};
	
	module.exports.expressJwtSecret = function (options) {
	  if (options === null || options === undefined) {
	    throw new _errors.ArgumentError('An options object must be provided when initializing expressJwtSecret');
	  }
	
	  var client = new _JwksClient.JwksClient(options);
	  var onError = options.handleSigningKeyError || handleSigningKeyError;
	
	  return function secretProvider(req, header, payload, cb) {
	    // Only RS256 is supported.
	    if (!header || header.alg !== 'RS256') {
	      return cb(null, null);
	    }
	
	    client.getSigningKey(header.kid, function (err, key) {
	      if (err) {
	        return onError(err, function (newError) {
	          return cb(newError, null);
	        });
	      }
	
	      // Provide the key.
	      return cb(null, key.publicKey || key.rsaPublicKey);
	    });
	  };
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _errors = __webpack_require__(5);
	
	var _JwksClient = __webpack_require__(4);
	
	var handleSigningKeyError = function handleSigningKeyError(err, cb) {
	  // If we didn't find a match, can't provide a key.
	  if (err && err.name === 'SigningKeyNotFoundError') {
	    return cb(null, null, null);
	  }
	
	  // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
	  if (err) {
	    return cb(err, null, null);
	  }
	};
	
	module.exports.hapiJwt2Key = function (options) {
	  if (options === null || options === undefined) {
	    throw new _errors.ArgumentError('An options object must be provided when initializing expressJwtSecret');
	  }
	
	  var client = new _JwksClient.JwksClient(options);
	  var onError = options.handleSigningKeyError || handleSigningKeyError;
	
	  return function secretProvider(decoded, cb) {
	    // We cannot find a signing certificate if there is no header (no kid).
	    if (!decoded || !decoded.header) {
	      return cb(null, null, null);
	    }
	
	    // Only RS256 is supported.
	    if (decoded.header.alg !== 'RS256') {
	      return cb(null, null, null);
	    }
	
	    client.getSigningKey(decoded.header.kid, function (err, key) {
	      if (err) {
	        return onError(err, function (newError) {
	          return cb(newError, null, null);
	        });
	      }
	
	      // Provide the key.
	      return cb(null, key.publicKey || key.rsaPublicKey, key);
	    });
	  };
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.certToPEM = certToPEM;
	exports.rsaPublicKeyToPEM = rsaPublicKeyToPEM;
	function certToPEM(cert) {
	  cert = cert.match(/.{1,64}/g).join('\n');
	  cert = '-----BEGIN CERTIFICATE-----\n' + cert + '\n-----END CERTIFICATE-----\n';
	  return cert;
	};
	
	function prepadSigned(hexStr) {
	  var msb = hexStr[0];
	  if (msb < '0' || msb > '7') {
	    return '00' + hexStr;
	  }
	  return hexStr;
	}
	
	function toHex(number) {
	  var nstr = number.toString(16);
	  if (nstr.length % 2) {
	    return '0' + nstr;
	  }
	  return nstr;
	}
	
	function encodeLengthHex(n) {
	  if (n <= 127) {
	    return toHex(n);
	  }
	  var nHex = toHex(n);
	  var lengthOfLengthByte = 128 + nHex.length / 2;
	  return toHex(lengthOfLengthByte) + nHex;
	}
	
	/*
	 * Source: http://stackoverflow.com/questions/18835132/xml-to-pem-in-node-js
	 */
	function rsaPublicKeyToPEM(modulusB64, exponentB64) {
	  var modulus = new Buffer(modulusB64, 'base64');
	  var exponent = new Buffer(exponentB64, 'base64');
	  var modulusHex = prepadSigned(modulus.toString('hex'));
	  var exponentHex = prepadSigned(exponent.toString('hex'));
	  var modlen = modulusHex.length / 2;
	  var explen = exponentHex.length / 2;
	
	  var encodedModlen = encodeLengthHex(modlen);
	  var encodedExplen = encodeLengthHex(explen);
	  var encodedPubkey = '30' + encodeLengthHex(modlen + explen + encodedModlen.length / 2 + encodedExplen.length / 2 + 2) + '02' + encodedModlen + modulusHex + '02' + encodedExplen + exponentHex;
	
	  var der = new Buffer(encodedPubkey, 'hex').toString('base64');
	
	  var pem = '-----BEGIN RSA PUBLIC KEY-----\n';
	  pem += '' + der.match(/.{1,64}/g).join('\n');
	  pem += '\n-----END RSA PUBLIC KEY-----\n';
	  return pem;
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (client) {
	  var _ref = arguments.length <= 1 || arguments[1] === undefined ? options : arguments[1];
	
	  var _ref$cacheMaxEntries = _ref.cacheMaxEntries;
	  var cacheMaxEntries = _ref$cacheMaxEntries === undefined ? 5 : _ref$cacheMaxEntries;
	  var _ref$cacheMaxAge = _ref.cacheMaxAge;
	  var cacheMaxAge = _ref$cacheMaxAge === undefined ? (0, _ms2.default)('10h') : _ref$cacheMaxAge;
	
	  var logger = (0, _debug2.default)('jwks');
	  var getSigningKey = client.getSigningKey;
	
	  logger('Configured caching of singing keys. Max: ' + cacheMaxEntries + ' / Age: ' + cacheMaxAge);
	  return (0, _lruMemoizer2.default)({
	    load: function load(kid, callback) {
	      getSigningKey(kid, function (err, key) {
	        if (err) {
	          return callback(err);
	        }
	
	        logger('Caching signing key for \'' + kid + '\':', key);
	        return callback(null, key);
	      });
	    },
	    hash: function hash(kid) {
	      return kid;
	    },
	    maxAge: cacheMaxAge,
	    max: cacheMaxEntries
	  });
	};
	
	var _ms = __webpack_require__(22);
	
	var _ms2 = _interopRequireDefault(_ms);
	
	var _debug = __webpack_require__(7);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _lruMemoizer = __webpack_require__(18);
	
	var _lruMemoizer2 = _interopRequireDefault(_lruMemoizer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.rateLimitSigningKey = exports.cacheSigningKey = undefined;
	
	var _cache = __webpack_require__(59);
	
	var _cache2 = _interopRequireDefault(_cache);
	
	var _rateLimit = __webpack_require__(61);
	
	var _rateLimit2 = _interopRequireDefault(_rateLimit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.cacheSigningKey = _cache2.default;
	exports.rateLimitSigningKey = _rateLimit2.default;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (client) {
	  var _ref = arguments.length <= 1 || arguments[1] === undefined ? options : arguments[1];
	
	  var _ref$jwksRequestsPerM = _ref.jwksRequestsPerMinute;
	  var jwksRequestsPerMinute = _ref$jwksRequestsPerM === undefined ? 10 : _ref$jwksRequestsPerM;
	
	  var logger = (0, _debug2.default)('jwks');
	  var getSigningKey = client.getSigningKey;
	
	  var limiter = new _limiter.RateLimiter(jwksRequestsPerMinute, 'minute', true);
	  logger('Configured rate limiting to JWKS endpoint at ' + jwksRequestsPerMinute + '/minute');
	
	  return function (kid, cb) {
	    limiter.removeTokens(1, function (err, remaining) {
	      if (err) {
	        return cb(err);
	      }
	
	      logger('Requests to the JWKS endpoint available for the next minute:', remaining);
	      if (remaining < 0) {
	        logger('Too many requests to the JWKS endpoint');
	        return cb(new _JwksRateLimitError2.default('Too many requests to the JWKS endpoint'));
	      } else {
	        return getSigningKey(kid, cb);
	      }
	    });
	  };
	};
	
	var _debug = __webpack_require__(7);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _limiter = __webpack_require__(62);
	
	var _JwksRateLimitError = __webpack_require__(15);
	
	var _JwksRateLimitError2 = _interopRequireDefault(_JwksRateLimitError);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	
	exports.RateLimiter = __webpack_require__(63);
	exports.TokenBucket = __webpack_require__(17);


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var TokenBucket = __webpack_require__(17);
	
	/**
	 * A generic rate limiter. Underneath the hood, this uses a token bucket plus
	 * an additional check to limit how many tokens we can remove each interval.
	 * @author John Hurliman <jhurliman@jhurliman.org>
	 *
	 * @param {Number} tokensPerInterval Maximum number of tokens that can be
	 *  removed at any given moment and over the course of one interval.
	 * @param {String|Number} interval The interval length in milliseconds, or as
	 *  one of the following strings: 'second', 'minute', 'hour', day'.
	 * @param {Boolean} fireImmediately Optional. Whether or not the callback
	 *  will fire immediately when rate limiting is in effect (default is false).
	 */
	var RateLimiter = function(tokensPerInterval, interval, fireImmediately) {
	  this.tokenBucket = new TokenBucket(tokensPerInterval, tokensPerInterval,
	    interval, null);
	
	  // Fill the token bucket to start
	  this.tokenBucket.content = tokensPerInterval;
	
	  this.curIntervalStart = +new Date();
	  this.tokensThisInterval = 0;
	  this.fireImmediately = fireImmediately;
	};
	
	RateLimiter.prototype = {
	  tokenBucket: null,
	  curIntervalStart: 0,
	  tokensThisInterval: 0,
	  fireImmediately: false,
	
	  /**
	   * Remove the requested number of tokens and fire the given callback. If the
	   * rate limiter contains enough tokens and we haven't spent too many tokens
	   * in this interval already, this will happen immediately. Otherwise, the
	   * removal and callback will happen when enough tokens become available.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Function} callback(err, remainingTokens)
	   * @returns {Boolean} True if the callback was fired immediately, otherwise
	   *  false.
	   */
	  removeTokens: function(count, callback) {
	    // Make sure the request isn't for more than we can handle
	    if (count > this.tokenBucket.bucketSize) {
	      process.nextTick(callback.bind(null, 'Requested tokens ' + count +
	        ' exceeds maximum tokens per interval ' + this.tokenBucket.bucketSize,
	        null));
	      return false;
	    }
	
	    var self = this;
	    var now = Date.now();
	
	    // Advance the current interval and reset the current interval token count
	    // if needed
	    if (now - this.curIntervalStart >= this.tokenBucket.interval) {
	      this.curIntervalStart = now;
	      this.tokensThisInterval = 0;
	    }
	
	    // If we don't have enough tokens left in this interval, wait until the
	    // next interval
	    if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) {
	      if (this.fireImmediately) {
	        process.nextTick(callback.bind(null, null, -1));
	      } else {
	        var waitInterval = Math.ceil(
	          this.curIntervalStart + this.tokenBucket.interval - now);
	
	        setTimeout(function() {
	          self.tokenBucket.removeTokens(count, afterTokensRemoved);
	        }, waitInterval);
	      }
	      return false;
	    }
	
	    // Remove the requested number of tokens from the token bucket
	    return this.tokenBucket.removeTokens(count, afterTokensRemoved);
	
	    function afterTokensRemoved(err, tokensRemaining) {
	      if (err) return callback(err, null);
	
	      self.tokensThisInterval += count;
	      callback(null, tokensRemaining);
	    }
	  },
	
	  /**
	   * Attempt to remove the requested number of tokens and return immediately.
	   * If the bucket (and any parent buckets) contains enough tokens and we
	   * haven't spent too many tokens in this interval already, this will return
	   * true. Otherwise, false is returned.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Boolean} True if the tokens were successfully removed, otherwise
	   *  false.
	   */
	  tryRemoveTokens: function(count) {
	    // Make sure the request isn't for more than we can handle
	    if (count > this.tokenBucket.bucketSize)
	      return false;
	
	    var now = Date.now();
	
	    // Advance the current interval and reset the current interval token count
	    // if needed
	    if (now - this.curIntervalStart >= this.tokenBucket.interval) {
	      this.curIntervalStart = now;
	      this.tokensThisInterval = 0;
	    }
	
	    // If we don't have enough tokens left in this interval, return false
	    if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval)
	      return false;
	
	    // Try to remove the requested number of tokens from the token bucket
	    return this.tokenBucket.tryRemoveTokens(count);
	  },
	
	  /**
	   * Returns the number of tokens remaining in the TokenBucket.
	   * @returns {Number} The number of tokens remaining.
	   */
	  getTokensRemaining: function () {
	    this.tokenBucket.drip();
	    return this.tokenBucket.content;
	  }
	};
	
	module.exports = RateLimiter;


/***/ },
/* 64 */
/***/ function(module, exports) {

	// From https://raw.githubusercontent.com/nikoskalogridis/deep-freeze/fb921b32064dce1645197be2bf975fe0385450b0/index.js
	// which is sadly, no longer maintained
	
	module.exports = function deepFreeze (o) {
	  if (o) {
	    Object.freeze(o);
	
	    Object.getOwnPropertyNames(o).forEach(function (prop) {
	      if (o.hasOwnProperty(prop)
	        && o[prop] !== null
	        && (typeof o[prop] === 'object' || typeof o[prop] === 'function')
	        && (o[prop].constructor !== Buffer)
	        && !Object.isFrozen(o[prop])) {
	          deepFreeze(o[prop]);
	        }
	    });
	
	  }
	  return o;
	};


/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = require("auth0@2.1.0");

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = require("ejs");

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = require("jade");

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = require("node-uuid");

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = require("winston");

/***/ }
/******/ ]);