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
    <string>MY_DEV_TOKEN</string>
    <key>co.nearbee.organization_id</key>
    <string>MY_ORGANIZATION_ID</string>

```   

## Configuring the project

    cordova plugin add cordova-plugin-nearbee

## Usage

 **NOTE**: Every method returns success and error callbacks.

### Initialize SDK.  

```javascript
    window.plugins.nearbeePlugin.initialize();
```

### Enable background notifications

 If set to true the NearBee SDK will send beacon notifications in the background, when the app is not running.  

```javascript
    window.plugins.nearbeePlugin.enableBackgroundNotifications(true);
```

### Start scanning

 This will start the scan for the beacons.    

```javascript
     window.plugins.nearbeePlugin.startScanning();
```

### Receive nearbee notifications

 To display a UI with list of beacons, the following needs to be done:  

```javascript
     window.plugins.nearbeePlugin.nearbeeNotifications(function(notificationObject) {
            console.log(JSON.parse(notificationObject));
          }, function(err) {
            console.log('Uh oh... ' + err);
        });
```

### Stop Scanning

 This will stop the scan for the beacons.  

```javascript
     window.plugins.nearbeePlugin.stopScanning();
```

### Clearing notification cache

This will clear the cached server responses and will force NearBee to fetch fresh data from the server.  

```javascript
     window.plugins.nearbeePlugin.clearNotificationCache();
```

### Overriding notification click behaviour


#### Android

1. Extend the NotificationUtil class in your `your_app_dir/platforms/android/app/src/main/java/com/your_app`

```java
public class MyNotificationManager extends NotificationManager {

    public MyNotificationManager(Context context) {
        super(context);
    }

    @Override
    public Intent getAppIntent(Context context) {
        // This intent is for handling grouped notification click
        return new Intent(context, MainActivity.class);
    }

    @Override
    public Intent getBeaconIntent(Context context, NearBeacon nearBeacon) {
        // This intent is for handling individual notification click
        // Pass the intent of the activity that you want to be opened on click
        if (nearBeacon.getBusiness() != null) {
            BeaconAttachment attachment = nearBeacon.getBestAvailableAttachment(context);
            if (attachment != null) {
                final Intent intent = new Intent(context, MainActivity.class);
                // pass the url from the beacon, so that it can be opened from your activity
                intent.putExtra("url", attachment.getUrl());
                return intent;
            }
        }
        return null;
    }

}

```

2. Create a `meta-data` field for the class `MyNotificationUtil` in the `Android.mainfest` file.

```xml

    <application>
        ...
        <meta-data
        	android:name="co.nearbee.notification_util"
    		android:value=".MyNotificationUtil" />
        ...
    </application>

```

3. Handle the intent data in your Activity's onCreate

```java
public class MainActivity extends CordovaActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);


        // Handle the intent here
        if (getIntent().getStringExtra("url") != null) {
            String url = getIntent().getStringExtra("url");
            // Do something with the url here
         }
    }
}
```

#### iOS

Add the below lines of code to `AppDelegate.m`

```Objective-C
#import <NearBee/NearBee-Swift.h>

- (void)userNotificationCenter:(UNUserNotificationCenter *)center 
didReceiveNotificationResponse:(UNNotificationResponse *)response 
withCompletionHandler:(void (^)(void))completionHandler {

    NearBee *nearBee = [NearBee initNearBee];

    BOOL isNearBeeNotification = [nearBee checkAndProcessNearbyNotification:response.notification];
    if (isNearBeeNotification) {
        completionHandler()
    } else {
        // Not a near bee notification, you need to handle
    }
}
```


### Steps to run Example app

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


