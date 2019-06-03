var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // cordova.plugins.backgroundMode.enable();
        document.addEventListener('deviceready', () => {
            if(device.platform=='Android')
            {
                cordova.plugins.diagnostic.requestRuntimePermissions(function(statuses){
                    for (var permission in statuses){
                        switch(statuses[permission]){
                            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                                console.log("Permission granted to use "+permission);
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                                console.log("Permission to use "+permission+" has not been requested yet");
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED:
                                console.log("Permission denied to use "+permission+" - ask again?");
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                                console.log("Permission permanently denied to use "+permission+" - guess we won't be using it then!");
                                break;
                        }
                    }
                }, function(error){
                    console.error("The following error occurred: "+error);
                },[
                    cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION,
                    cordova.plugins.diagnostic.permission.ACCESS_COARSE_LOCATION
                ]);
            }
            else {
                cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
                    switch(status){
                        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                            console.log("Permission not requested");
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.DENIED:
                            console.log("Permission denied");
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                            console.log("Permission granted always");
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                            console.log("Permission granted only when in use");
                            break;
                    }
                }, function(error){
                    console.error(error);
                }, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
                console.log(device.platform);
               
                    cordova.plugins.diagnostic.requestRemoteNotificationsAuthorization({
                        successCallback: function(){
                            console.log("Successfully requested remote notifications authorization");
                        },
                        errorCallback: function(err){
                           console.error("Error requesting remote notifications authorization: " + err);
                        },
                        types: [
                            cordova.plugins.diagnostic.remoteNotificationType.ALERT,
                            cordova.plugins.diagnostic.remoteNotificationType.SOUND,
                            cordova.plugins.diagnostic.remoteNotificationType.BADGE
                        ],
                        omitRegistration: false
                    });
            }          
        });

        window.plugins.nearbeePlugin.initialize(function() {
            console.log('initialized!');
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
        plugins.nearbeePlugin.enableBackgroundNotifications(true, function() {
            console.log('Enabled notifications!');
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
        window.plugins.nearbeePlugin.startScanning(function(obj) {
            console.log('started Scanning!');
        }, function(err) {
            console.log('Uh oh... ' + err);
        });
        window.plugins.nearbeePlugin.nearbeeNotifications((obj)=>{
            document.getElementById("mydiv").innerHTML = `<div />`
            var notificationArray = [];
            var notificationObject = JSON.parse(obj);
            var notificationArray = notificationObject.nearBeeNotifications;
            console.log(notificationArray);
            for(i=0;i<notificationArray.length;i++)
            {
                var cart = document.createElement("div");
                cart.innerHTML = `
                     <div class="notificationStyle" id="launchurl`+i+`" onclick="openUrl('`+notificationArray[i].url+`')">
                         <div class="imageContainer">
                             <img src=`+notificationArray[i].icon+` />
                         </div>
                         <div class="descriptionContainer">
                             <p>`+notificationArray[i].title+` <br /> <font size="2" color="#696565">`+notificationArray[i].description+`</font> <br /> <font size="1" color="red">`+notificationArray[i].url+`</font></p>
                         </div>
                     </div>
                     <hr class="lineStyle" />
                `
                document.getElementById("mydiv").appendChild(cart);
            }
        }, err=>{
            console.log('Uh oh... ' + err);
        })
        PullToRefresh.init({
            mainElement: 'body',
            onRefresh: function(){
                console.log('refreshed');
                window.location.reload(); 
            }
        });
    }
};
 
app.initialize();