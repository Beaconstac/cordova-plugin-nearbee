package com.mobstac.cordova.plugin;

import android.util.Log;

import co.nearbee.NearBee;
import co.nearbee.models.NearBeacon;
import co.nearbee.NearBeeException;
import co.nearbee.NearBeaconListener;
import co.nearbee.models.ProximityAttachment;
import co.nearbee.models.BeaconAttachment;
import co.nearbee.utils.Util;

import java.util.ArrayList;

// Cordova-required packages
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class NearbeePlugin extends CordovaPlugin implements NearBeaconListener {

    private static final String INITIALIZE = "initialize";
    private static final String STOP_SCANNING = "stopScanning";
    private static final String START_SCANNING = "startScanning";
    private static final String NEARBEE_NOTIFICATIONS = "nearbeeNotifications";
    private static final String CLEAR_NOTIFICATION_CACHE = "clearNotificationCache";
    private static final String LAUNCH_URL = "launchUrl";
    private static final String ENABLE_BACKGROUND_NOTIFICATIONS = "enableBackgroundNotifications";

    public static final String EVENT_NOTIFICATION = "nearBeeNotifications";
    public static final String  CORDOVA_NEARBEE = "CorodovaNearbee";

    private NearBee nearBee;
    private CallbackContext callbackContext;

    @Override
    public boolean execute(String action, JSONArray args,
    final CallbackContext callbackContext) {
        switch(action) {
            case INITIALIZE:
                initialize();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                return true;
            case ENABLE_BACKGROUND_NOTIFICATIONS:
                boolean enabled;
                try {
                        enabled = args.getBoolean(0);
                        enableBackgroundNotifications(enabled);
                        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                        return true;
                    } 
                catch (JSONException e) {
                        callbackContext.error( "Enabling Notifications Failed :" + e.getMessage());
                        return false;
                }
            case STOP_SCANNING:
                stopScanning();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                return true;
            case START_SCANNING:
                startScanning();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                return true;
            case NEARBEE_NOTIFICATIONS:
                this.callbackContext = callbackContext;
                nearbeeNotifications();
                return true;
            case CLEAR_NOTIFICATION_CACHE:
                clearNotificationCache();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                return true;
            case LAUNCH_URL:
                String Url;
                try {
                        Url = args.getString(0);
                        launchUrl(Url);
                        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                        return true;
                    } 
                catch (JSONException e) {
                        callbackContext.error("Launch URL failed :" + e.getMessage());
                        return false;
                    }
        }
        callbackContext.error("\"" + action + "\" is not a recognized action.");
        return false;
    }

    public void initialize(){
        if (nearBee == null) {
            nearBee = new NearBee.Builder(cordova.getContext())
                .setBackgroundNotificationsEnabled(false)
                .build();
            Log.d(CORDOVA_NEARBEE, "Init");
        }
    }

    public void enableBackgroundNotifications(boolean enabled){
        initialize();
        nearBee.enableBackgroundNotifications(enabled);
    }

    public void stopScanning(){
        initialize();
        nearBee.stopScanning();
        Log.d(CORDOVA_NEARBEE, "Stopped Scanning");
    }

    public void startScanning(){
        initialize();
        nearBee.startScanning(this);
        Log.d(CORDOVA_NEARBEE, "Started Scanning");
    }
    public void nearbeeNotifications(){
        Log.d(CORDOVA_NEARBEE, "Nearbee Notifications");
    }

    public void clearNotificationCache(){
        initialize();
        nearBee.clearNotificationCache();
        Log.d(CORDOVA_NEARBEE, "Cleared Notification Cache");
    }
    
    public void launchUrl(String url){
        initialize();
        Util.startChromeTabs(cordova.getActivity(), url, true);
        Log.d(CORDOVA_NEARBEE, "Launching URL");
    }

    @Override
    public void onUpdate(ArrayList<NearBeacon> beaconsInRange) {
        JSONArray jsonArray = new JSONArray();
        try {
            for (NearBeacon beacon : beaconsInRange) {
                JSONObject beaconJson = new JSONObject();
                BeaconAttachment attachment = beacon.getBestAvailableAttachment(cordova.getActivity());
                beaconJson.put("eddystoneUID", beacon.getEddystoneUID());
                beaconJson.put("title", attachment.getTitle());
                beaconJson.put("description", attachment.getDescription());
                beaconJson.put("icon", attachment.getIconURL());
                beaconJson.put("url", attachment.getUrl());
                if (attachment.getClass().isAssignableFrom(ProximityAttachment.class)) {
                    ProximityAttachment pa = (ProximityAttachment) attachment;
                    beaconJson.put("bannerType", pa.getBannerType());
                    beaconJson.put("bannerImageUrl", pa.getBannerImageURL());
                } else {
                    beaconJson.put("bannerType", JSONObject.NULL);
                    beaconJson.put("bannerImageUrl", JSONObject.NULL);
                }
                jsonArray.put(beaconJson);
            }
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(EVENT_NOTIFICATION,jsonArray);
            Log.d(CORDOVA_NEARBEE, "BeaconObject:  "+ jsonObject.toString());
            PluginResult resultB = new PluginResult(PluginResult.Status.OK, jsonObject.toString());
            resultB.setKeepCallback(true);
            this.callbackContext.sendPluginResult(resultB);
        } catch (JSONException e) {
            this.callbackContext.error("Beacon onUpdate :" + e.getMessage());
            Log.e(CORDOVA_NEARBEE, "Beacon onUpdate :"+ e.getMessage());
        }
    }

    @Override
    public void onBeaconLost(ArrayList<NearBeacon> lost) {
        //
    }

    @Override
    public void onBeaconFound(ArrayList<NearBeacon> found) {
        //
    }

    @Override
    public void onError(NearBeeException exception) {
        Log.e(CORDOVA_NEARBEE, "Beacon onError :"+exception.getMessage());
    }
}