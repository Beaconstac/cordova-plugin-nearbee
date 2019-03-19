function NearbeePlugin() {}

const NEARBEE_PLUGIN = "NearbeePlugin";

// The function that passes work along to native shells
// Message is a string, duration may be 'long' or 'short'
NearbeePlugin.prototype.initialize = function(successCallback, errorCallback) {
    var options = {};
    cordova.exec(successCallback, errorCallback, NEARBEE_PLUGIN, 'initialize', [options]);
}
NearbeePlugin.prototype.enableBackgroundNotifications = function(enabled, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, NEARBEE_PLUGIN, 'enableBackgroundNotifications', [enabled]);
}
NearbeePlugin.prototype.stopScanning = function(successCallback, errorCallback) {
    var options = {};
    cordova.exec(successCallback, errorCallback, NEARBEE_PLUGIN, 'stopScanning', [options]);
}
NearbeePlugin.prototype.startScanning = function(successCallback, errorCallback) {
    var options = {};
    cordova.exec(successCallback, errorCallback, NEARBEE_PLUGIN, 'startScanning', [options]);
}
NearbeePlugin.prototype.clearNotificationCache = function(successCallback, errorCallback) {
    var options = {};
    cordova.exec(successCallback, errorCallback, NEARBEE_PLUGIN, 'clearNotificationCache', [options]);
}
NearbeePlugin.prototype.launchUrl = function(Url,successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, NEARBEE_PLUGIN, 'launchUrl', [Url]);
}
NearbeePlugin.prototype.nearbeeNotifications = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, NEARBEE_PLUGIN, 'nearbeeNotifications', []);
}

// Installation constructor that binds NearbeePlugin to window
NearbeePlugin.install = function() {
    if (!window.plugins) {
      window.plugins = {};
    }
    window.plugins.nearbeePlugin = new NearbeePlugin();
    return window.plugins.nearbeePlugin;
};
cordova.addConstructor(NearbeePlugin.install);