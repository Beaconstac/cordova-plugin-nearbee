#import <NearBee/NearBee-Swift.h>
#import "NearbeePlugin.h"
#import <Cordova/CDV.h>
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

static NSString *const INITIALIZE = @"Initialized NearBee SDK";
static NSString *const STOP_SCANNING = @"Stopped Scanning";
static NSString *const START_SCANNING = @"Started Scanning";
static NSString *const CLEAR_NOTIFICATION_CACHE = @"Initialized NearBee SDK";
static NSString *const LAUNCH_URL = @"Launched URL";
static NSString *const ENABLE_BACKGROUND_NOTIFICATIONS = @"Enabled Notifications";

@interface NearbeePlugin() <NearBeeDelegate>

@property (strong) NearBee *nearBee;
@property (strong) CLLocationManager *locationManager;
@property (nonatomic, retain) NSMutableArray *beacons;
@property (nonatomic) NSString *cordovaCallbackId;

@end

@implementation NearbeePlugin

- (void)initialize:(CDVInvokedUrlCommand *)command
{
    //nearbee initialization
    self.nearBee = [NearBee initNearBee];
    [self.nearBee enableBackgroundNotification:NO];
    self.beacons = [@[] mutableCopy];
    self.nearBee.delegate = self;
    //sending callback to javascript
    NSString *msg = INITIALIZE;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)enableBackgroundNotifications:(CDVInvokedUrlCommand *)command
{
    bool enable = [command.arguments objectAtIndex:0];
    [self.nearBee enableBackgroundNotification:enable];

    NSString *msg = ENABLE_BACKGROUND_NOTIFICATIONS;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)startScanning:(CDVInvokedUrlCommand *)command
{
    [self.nearBee startScanning];

    NSString *msg = START_SCANNING;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}
- (void)nearbeeNotifications:(CDVInvokedUrlCommand*)command
{
    self.cordovaCallbackId = command.callbackId;
}
- (void)stopScanning:(CDVInvokedUrlCommand *)command
{
    self.beacons = nil;
    [self.nearBee stopScanning];

    NSString *msg = STOP_SCANNING;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
- (void)clearNotificationCache:(CDVInvokedUrlCommand*)command
{
    [self.nearBee clearNotificationCache];

    NSString *msg = CLEAR_NOTIFICATION_CACHE;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
- (void)launchUrl:(CDVInvokedUrlCommand *)command
{
    NSString *url = [command.arguments objectAtIndex:0];
    [self.nearBee displayContentOfEddystoneUrl:url];

    NSString *msg = LAUNCH_URL;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)didFindBeacons:(NSArray<NearBeeBeacon *> *)beacons {
    [self.beacons addObjectsFromArray:beacons];
    [self updateList:self.beacons];
}

- (void)didLoseBeacons:(NSArray<NearBeeBeacon *> *)beacons {
    [self.beacons removeObjectsInArray:beacons];
    [self updateList:self.beacons];
}

- (void)didUpdateBeacons:(NSArray<NearBeeBeacon *> * _Nonnull)beacons {
    [self updateList:self.beacons];
}

- (void)didUpdateState:(enum NearBeeState)state {
    // Show State
}

- (void)updateList:(NSArray<NearBeeBeacon *> * _Nonnull)beacons {
    NSMutableArray *jsonArray = [NSMutableArray new];
    for (NearBeeBeacon *beacon in beacons) {
        NSMutableDictionary *beaconJson = [NSMutableDictionary new];
        beaconJson[@"title"] = [[beacon getBestAvailableAttachment] getTitle];
        beaconJson[@"description"] = [[beacon getBestAvailableAttachment] getDescription];
        beaconJson[@"icon"] = [[beacon getBestAvailableAttachment] getIconURL];
        beaconJson[@"url"] = [[beacon getBestAvailableAttachment] getURL];
        [jsonArray addObject:beaconJson];
    }
    if (jsonArray.count > 0) {
        NSDictionary *json = @{@"nearBeeNotifications":jsonArray};
        NSError *error;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:json
                                                           options:NSJSONWritingPrettyPrinted
                                                             error:&error];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsonString];
        [pluginResult setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.cordovaCallbackId];
    }
}

- (void)didThrowError:(NSError * _Nonnull)error {
    NSDictionary *json = @{@"nearBeeError":[error localizedDescription]};
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:json
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:&error];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:jsonString];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.cordovaCallbackId];
}

@end
