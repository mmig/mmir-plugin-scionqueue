
/**
 * Cordova plugin that exposes the WebKit's native queue handling interface
 * (see android.webkit.queueManager).
 */

var exec = require('cordova/exec');

var QueuePlugin = function(){};

// creates a new Queue
QueuePlugin.prototype.newQueue = function(id, successCallback, failureCallback){
//	console.log('creating queue with id: '+id);
	return exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "QueuePlugin", "newQueue", [id]);
};

//to be called when scion is not working anymore
QueuePlugin.prototype.readyForJob = function(id, successCallback, failureCallback){
	return exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "QueuePlugin", "readyForJob", [id]);
};

//writes a new job in the waiting queue
QueuePlugin.prototype.newJob = function(id, job, successCallback, failureCallback){
	return exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "QueuePlugin", "newJob", [id,job]);
};

/**
 * Factory for CordovaPlugin-based implementation of raise function.
 *
 * Provide creator-functions:
 * <code>createWorker(_engineInstance, genFunc) : WebWorker</code>
 * <code>createRaise(_engineInstance) : Function</code>
 *
 * @see mmir.state.StateEngineFactory
 */
QueuePlugin.prototype.queueFactory = /** @lends  mmir.state.StateEngineFactory.StateEngineQueuePluginImpl# */ {

	/** @memberOf  mmir.state.StateEngineFactory.StateEngineQueuePluginImpl# */
	name: 'queuepluginGen',
	/** @function */
	createWorker: (function initWorkerFactory() {

		//"global" ID-list for all queues (i.e. ID-list for all engines)
		var callBackList = [];

		return function workerFactory(_instance, gen){

			var id = callBackList.length;
			var execQueue = window.cordova.plugins.queuePlugin;

			function successCallBackHandler(args){
				if (args.length===2){
//  					console.debug('QueuePlugin: success '+ JSON.stringify(args[0]) + ', '+JSON.stringify(args[1]));//DEBUG
					callBackList[args[0]](args[1]);
				}
			}

			function failureFallbackHandler(_err){

				_instance._logger.error('failed to initialize SCION extension for ANDROID env');
				_instance.worker = (function(gen){
					return {
						raiseCordova: function fallback(event, eventData){
							setTimeout(function(){
								gen.call(_instance, event, eventData);
							}, 10);
						}
					};
				})();//END: fallback
			}

			callBackList.push(function(data){
				var inst = _instance;
				if(inst._logger.isv()) inst._logger.debug('raising:'+ data.event);
				var generatedState = gen.call(inst, data.event, data.eventData);
				if(inst._logger.isv()) inst._logger.debug('QueuePlugin: processed event '+id+' for '+ data.event+' -> new state: '+JSON.stringify(generatedState)+ ' at ' + inst.url);
				execQueue.readyForJob(id, successCallBackHandler, failureFallbackHandler);

				inst.onraise();
			});

			execQueue.newQueue(id, function(_args){
					if(_instance._logger.isv()) _instance._logger.debug('QueuePlugin: entry '+id+' created.' + ' at ' + _instance.url);
				}, failureFallbackHandler
			);

			return {
				_engineInstance: _instance,
				raiseCordova: function (event, eventData){
					if(this._engineInstance._logger.isv()) this._engineInstance._logger.debug('QueuePlugin: new Job: '+ id + ' at ' + this._engineInstance.url);
					execQueue.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureFallbackHandler);
				}
			};

		};//END: workerFactory(_instance, gen)

	})(),//END: initWorkerFactory()

	/** @function */
	createRaise: function(_instance){
		return function(event, eventData) {

			if (eventData) _instance._logger.log('new Job:' + event);

			_instance.worker.raiseCordova(event, eventData);
		};
	}

};


//NOTE this is a singleton (stateless) plugin
module.exports = new QueuePlugin();
