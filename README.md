#A Cordova plugin for NearBee SDK.

###Steps to run Example app on Android-

1. Clone the repo.
2. Setup Cordova environment in your machine.  
    https://cordova.apache.org/docs/en/latest/guide/cli/index.html

3.  Run command  
    `cordova platforms add android`.  
4.  Go to  
    `platforms > android > project.properties`  
    make target as `target=android-28`  
    then go to  
    `platforms > android > app > src > main`  
    Add your API key and Orgnization ID to the AndroidManifest.xml as follows  

```xml

        <application>  
            ...   
            ...  
            <meta-data  
                android:name="co.nearbee.api_key"  
                android:value="MY_DEV_TOKEN" />  
  
            <meta-data  
                android:name="co.nearbee.organization_id"  
                android:value="123" />  
            ...  
        </application> 
        
```
5. To run the project use  
    `cordova run android`  
6. Keep device's bluetooth on.  

###Steps to run Example app on ios-

1. Clone the repo.
2. Setup Cordova environment in your machine.  
    https://cordova.apache.org/#getstarted  

3.  Run command  
    `cordova platforms add ios@5.0.0`   
4.  Go to  
    `platforms > ios > NearbeePluginTest`  

    Add your API key and Orgnization ID to the Info.plist as follows  

```xml

        <key>co.nearbee.api_key</key>  
        <string>MY_DEV_TOKEN<string>  
        <key>co.nearbee.organization_id</key>  
        <string>123</string>  
        
```

    Add the NSLocationAlwaysUsageDescription, NSLocationAlwaysAndWhenInUsageDescription, NSBluetoothPeripheralUsageDescription to Info.plist  

```xml
    
        <key>NSLocationAlwaysUsageDescription</key>  
        <string>To scan for beacons and show the offers around you</string>  
        <key>NSLocationAlwaysUsageDescription</key>  
        <string>To scan for beacons and show the offers around you</string>  
        <key>NSLocationAlwaysUsageDescription</key>  
        <string>To scan for beacons and show the offers around you</string>  
        
```

5. To run the project use  
    `cordova build ios`  
    Open .xcodeproj and run the app.  

### Usage

*In www/js/index.js -  

###### Initialize

````javascript
    window.plugins.nearbeePlugin.initialize(function() {
            console.log('initialized!');
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
````

###### Enable background notifications

````javascript
    window.plugins.nearbeePlugin.enableBackgroundNotifications(true, function() {
            console.log('Enabled notifications!');
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
````

###### Start scanning

````javascript
     window.plugins.nearbeePlugin.startScanning(function() {
            console.log('started Scanning!');
        }, function(err) {
            console.log('Uh oh... ' + err);
        });
````

###### Receive nearbee notifications

````javascript
     window.plugins.nearbeePlugin.nearbeeNotifications(function(notificationObject) {
            console.log(JSON.parse(notificationObject));
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
````

###### Stop Scanning

````javascript
     window.plugins.nearbeePlugin.stopScanning(function() {
            console.log('Stopped scanning.');
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
````

###### Clearing notification cache

````javascript
     window.plugins.nearbeePlugin.clearNotificationCache(function() {
            console.log('Cleared Notifications Cache.');
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
````

###### Launch URL

````javascript
     window.plugins.nearbeePlugin.launchUrl(function(url) {
            console.log(url);
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
````



