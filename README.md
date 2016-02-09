dfki-mmir-plugin-queue
======================

Cordova 5 plugin for a "native" (i.e. platform dependent) implementation for a SCION event-queue:

the queue allows to raise / generate new events from within the SCION event loop.

By default, SCION allows new events only after the current event has been completely processed.
With this plugin, instead of throwing an error, new events are queued, if another event is currently processed.

NOTE: For this to work, SCION's `gen()` function must be modified to use the plugin.
      For an example, see usage in `manager/dialog/engineConfig.js` in the [MMIR library][1]:
      by default `engineConfig.js` uses an implementation based on HTML5 `WebWorkers`
      for implementing the event-queue for SCION; if the environment does not support `WebWorkers`,
      the implementation tries to use this plugin instead.
      
      
##### Usage

Assuming that Cordova 5 is installed, run the following command within a Cordova project
    
    cordova plugin add https://github.com/mmig/mmir-plugin-scionqueue.git
    
(this assumes that the Cordova project was created according to the _Cordova CLI Guide_)

##### Supported Platforms

 * Android

[1]: https://github.com/mmig/mmir-lib
