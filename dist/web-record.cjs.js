'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rrweb = require('rrweb');
var axios = _interopDefault(require('axios'));
var LZString = _interopDefault(require('lz-string'));

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

var _eventId = new WeakMap();

var record = /*#__PURE__*/function () {
  function record() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, record);

    _defineProperty(this, "eventsMatrix", void 0);

    _delay.set(this, {
      writable: true,
      value: 10
    });

    _protectId.set(this, {
      writable: true,
      value: []
    });

    _eventId.set(this, {
      writable: true,
      value: 0
    });

    if (option.id === undefined) {
      throw new Error('id of record is necessary');
    }

    this.init(option);
  }

  _createClass(record, [{
    key: "init",
    value: function init(option) {
      var _this = this;

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
            _that.eventsMatrix.push({
              id: _classPrivateFieldSet(this, _eventId, +_classPrivateFieldGet(this, _eventId) + 1),
              events: []
            });
          } // window.events.push(event);


          _that.eventsMatrix[_that.eventsMatrix.length - 1].events.push(event);
        },
        checkoutEveryNms: 10 * 1000 // 每10秒重新制作快照

      }); // mock trigger report

      setTimeout(function () {
        _this.report();
      }, 2000);
    }
  }, {
    key: "clear",
    value: function clear() {}
  }, {
    key: "report",
    value: function report() {
      var curEvent = this.eventsMatrix[this.eventsMatrix.length - 1];
      console.log(curEvent);

      _classPrivateFieldGet(this, _protectId).push(curEvent.id);

      var eventData = curEvent.events;
      var string = JSON.stringify(eventData);
      var lzString = LZString.compress(string);
      var file = new File([string], 'test.txt');
      console.log(string);
      var param = new FormData();
      param.append('file', file);
      param.append('name', 123);
      setTimeout(function () {
        // do report
        axios({
          url: 'http://localhost:3000/upLoad',
          method: 'post',
          headers: {
            'content-Type': 'multipart/form-data'
          },
          data: param
        });
      }, _classPrivateFieldGet(this, _delay));
    }
  }]);

  return record;
}();

module.exports = record;
