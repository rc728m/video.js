/**
 * videojs-event-tracking
 * @version 1.0.1
 * @copyright 2019 spodlecki <s.podlecki@gmail.com>
 * @license MIT
 */
var bufferCount = 0;
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global.videojsEventTracking = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

videojs = 'default' in videojs ? videojs['default'] : videojs;

var version = "1.0.1";
 
var BufferTracking = function BufferTracking(config) {
  var _this = this;

  var timer = null;
  var scrubbing = false;
  var bufferPosition = false;
  var bufferStart = false;
  var bufferEnd = false;
  bufferCount = 0;
  var readyState = false;

  var reset = function reset() {
    if (timer) {
      clearTimeout(timer);
    }
    scrubbing = false;
    bufferPosition = false;
    bufferStart = false;
    bufferEnd = false;
    bufferCount = 0;
    readyState = false;
  };

  var onPause = function onPause() {
    bufferStart = false;

    if (_this.scrubbing() && !(config.bufferingConfig && config.bufferingConfig.includeScrub)) {
      scrubbing = true;
      timer = setTimeout(function () {
        scrubbing = false;
      }, 200);
    }
  };

  var onPlayerWaiting = function onPlayerWaiting() {
    if (bufferStart === false && scrubbing === false && _this.currentTime() > 0) {
      bufferStart = new Date();
      bufferPosition = +_this.currentTime().toFixed(0);
      readyState = +_this.readyState();
    }
  };

  var onTimeupdate = function onTimeupdate() {
    var curTime = +_this.currentTime().toFixed(0);

    if (bufferStart && curTime !== bufferPosition) {
      bufferEnd = new Date();

      var secondsToLoad = (bufferEnd - bufferStart) / 1000;

      bufferStart = false;
      bufferPosition = false;
      bufferCount++;
      document.getElementById('bufferedCount').innerHTML = bufferCount;
      document.getElementById('lastBufferedDuration').innerHTML = secondsToLoad;

      _this.trigger('tracking:buffered', {
        currentTime: +curTime,
        readyState: +readyState,
        secondsToLoad: +secondsToLoad.toFixed(3),
        bufferCount: +bufferCount
      });

    }
  };

  this.on('dispose', reset);
  this.on('loadstart', reset);
  this.on('ended', reset);
  this.on('pause', onPause);
  this.on('waiting', onPlayerWaiting);
  this.on('timeupdate', onTimeupdate);
};
 
 

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = videojs.registerPlugin || videojs.plugin;
var getPlugin = videojs.getPlugin || videojs.plugin;

 
var eventTracking = function eventTracking(options) {
  BufferTracking.apply(this, arguments);
};

// Register the plugin with video.js, avoid double registration
if (typeof getPlugin('eventTracking') === 'undefined') {
  registerPlugin('eventTracking', eventTracking);
}

// Include the version number.
eventTracking.VERSION = version;

return eventTracking;

})));
