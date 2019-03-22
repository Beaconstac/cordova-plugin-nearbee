# A Cordova plugin for NearBee SDK.

## Pre-requisites  

- Set up [Cordova](https://cordova.apache.org/docs/en/latest/guide/cli/index.html)  
  
- An active Bluetooth connection.    

- Get the Developer token and Organization ID from [here](https://dashboard.beaconstac.com/#/login).  

- Make sure to use any Cordova plugin to keep the app running in background.  
  
### Android  
  
- Android target version should be `28`.    
  
- Coarse Location permission.  

- Replace MY_DEV_TOKEN and MY_ORGANIZATION_ID in the AndroidManifest.xml file with proper values.  
       
```xml

    <application>
        ...
        <meta-data
            android:name="co.nearbee.api_key"
            android:value="MY_DEV_TOKEN" />

        <meta-data
            android:name="co.nearbee.organization_id"
            android:value="MY_ORGANIZATION_ID" />
        ...
    </application>

```       
### iOS  
  
- Cordova iOS platform version should be `5.0.0`.    
  
- Pod iOS platform version should be `10.0`.  

- Notification and location permissions.  

- Replace MY_DEV_TOKEN and MY_ORGANIZATION_ID in the Info.plist file with proper values    

```xml

    <key>co.nearbee.api_key</key>
    <string>MY_DEV_TOKEN<string>
    <key>co.nearbee.organization_id</key>
    <string>MY_ORGANIZATION_ID</string>

```   

## Configuring the project

    cordova plugin add cordova-plugin-nearbee

## Usage

 **NOTE**: Every method returns success and error callbacks.

### Initialize SDK.  

````javascript
    window.plugins.nearbeePlugin.initialize();
````

### Enable background notifications

 If set to true the NearBee SDK will send beacon notifications in the background, when the app is not running.  

````javascript
    window.plugins.nearbeePlugin.enableBackgroundNotifications(true);
````

### Start scanning

 This will start the scan for the beacons.    

````javascript
     window.plugins.nearbeePlugin.startScanning();
````

### Receive nearbee notifications

 To display a UI with list of beacons, the following needs to be done:  

````javascript
     window.plugins.nearbeePlugin.nearbeeNotifications(function(notificationObject) {
            console.log(JSON.parse(notificationObject));
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
````

### Stop Scanning

 This will stop the scan for the beacons.  

````javascript
     window.plugins.nearbeePlugin.stopScanning();
````

### Clearing notification cache

This will clear the cached server responses and will force NearBee to fetch fresh data from the server.  

````javascript
     window.plugins.nearbeePlugin.clearNotificationCache();
````

### Steps to run Example app on Android

1. Clone/Download the repo.  

2.  Add required platforms  
  
    Android  
    `cordova platforms add android`
  
    iOS  
    `cordova platforms add ios`
  
3.  Follow Pre-requisites  of the plugin.  

4. To run the project use  
  
    Android   
    `cordova run android`  
  
    iOS  
    `cordova build ios`
  
    Open .xcworkspace and run.  


