#import <Cordova/CDVPlugin.h>

@interface NearbeePlugin : CDVPlugin

//The hooks for plugin commands
- (void)initialize:(CDVInvokedUrlCommand *)command;
- (void)enableBackgroundNotifications:(CDVInvokedUrlCommand *)command;
- (void)stopScanning:(CDVInvokedUrlCommand *)command;
- (void)startScanning:(CDVInvokedUrlCommand *)command;
- (void)clearNotificationCache:(CDVInvokedUrlCommand *)command;
- (void)launchUrl:(CDVInvokedUrlCommand *)command;
- (void)nearbeeNotifications:(CDVInvokedUrlCommand *)command;

@end