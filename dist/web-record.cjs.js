'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rrweb = require('rrweb');
var axios = _interopDefault(require('axios'));
require('lz-string');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }

  return value;
}

var _delay = new WeakMap();

var _protectId = new WeakMap();

var WebRecord = /*#__PURE__*/function () {
  function WebRecord() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebRecord);

    _defineProperty(this, "eventsMatrix", void 0);

    _delay.set(this, {
      writable: true,
      value: 10
    });

    _protectId.set(this, {
      writable: true,
      value: []
    });

    _defineProperty(this, "eventId", 0);

    if (option.id === undefined) {
      throw new Error('id of record is necessary');
    }

    this.init(option);
  }

  _createClass(WebRecord, [{
    key: "init",
    value: function init(option) {
      var _option$delay = option.delay,
          delay = _option$delay === void 0 ? 10 : _option$delay;

      _classPrivateFieldSet(this, _delay, delay);

      this.eventsMatrix = [{
        id: 0,
        events: []
      }];

      var _that = this;

      rrweb.record({
        emit: function emit(event, isCheckout) {
          if (isCheckout) {
            // console.log('is check');
            // console.log(pack(_that.eventsMatrix[_that.eventsMatrix.length - 1]));
            // console.log(JSON.stringify(_that.eventsMatrix[_that.eventsMatrix.length - 1]));
            _that.eventsMatrix.push({
              id: ++_that.eventId,
              events: []
            });

            _that.clear();
          } // window.events.push(event);


          _that.eventsMatrix[_that.eventsMatrix.length - 1].events.push(event);
        },
        checkoutEveryNms: 10 * 1000 // 每10秒重新制作快照

      });
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.eventsMatrix.length > 4) {
        this.eventsMatrix.shift();
      }
    }
  }, {
    key: "report",
    value: function report() {
      var _this = this;

      // const curEvent = this.eventsMatrix[this.eventsMatrix.length - 1];
      // console.log(curEvent);
      // this.#protectId.push(curEvent.id);
      // const eventData = curEvent.events;
      // const string = JSON.stringify(eventData);
      // const lzString = LZString.compress(string);
      // const file = new File([string], 'test.txt');
      // const param = new FormData();
      // param.append('file',file);
      // param.append('name',123);
      console.log('trigger report');
      setTimeout(function () {
        console.log(_classPrivateFieldGet(_this, _delay));

        var postData = _this.eventsMatrix.slice(-2).map(function (item) {
          return item.events;
        }).reduce(function (a, b) {
          return a.concat(b);
        });

        var string = rrweb.pack(postData);
        console.log(string);
        var file = new File([string], 'test.txt');
        var param = new FormData();
        param.append('file', file);
        param.append('name', 123);
        console.log('report'); // do report

        axios({
          url: 'http://172.24.101.146:3000/upLoad',
          method: 'post',
          headers: {
            'content-Type': 'multipart/form-data'
          },
          data: param
        });
      }, _classPrivateFieldGet(this, _delay));
    }
  }]);

  return WebRecord;
}();

module.exports = WebRecord;
