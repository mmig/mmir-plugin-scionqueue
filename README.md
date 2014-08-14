mmir-plugin-scionqueue
======================

Cordova plugin for "native" SCION-queue implementation:

the queue allows to raise / generate new events from within the SCION event loop.

By default, SCION allows new events only after the current event has been completely processed.
With this plugin, instead of throwing an error, new events are queued, if another event is currently processed.

NOTE: for this to work, the ```gen()``` function must be modified to use the plugin
      (e.g. see usage in ```/mmirf/manager/dialog/engineConfig.js```)
