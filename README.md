<p align="center">
  <a target="_blank" rel="noopener noreferrer" href="https://github.com/relateddigital/visilabs-android"><img src="https://github.com/relateddigital/visilabs-android/blob/master/app/visilabs.png" alt="Visilabs Android Library" width="500" style="max-width:100%;"></a>
</p>

[![Build Status](https://travis-ci.org/relateddigital/visilabs-ios.svg)](https://travis-ci.org/relateddigital/visilabs-ios)
[![Version](https://img.shields.io/cocoapods/v/VisilabsIOS.svg?style=flat)](https://cocoapods.org/pods/VisilabsIOS)
[![License](https://img.shields.io/cocoapods/l/VisilabsIOS.svg?style=flat)](https://cocoapods.org/pods/VisilabsIOS)
[![Platform](https://img.shields.io/cocoapods/p/VisilabsIOS.svg?style=flat)](https://cocoapods.org/pods/VisilabsIOS)


# Table of Contents

- [Introduction](#introduction)
- [Example](#Example)
- [Installation](#Installation)
- [Usage](#Usage)
    - [Initializing](#Initializing)
        - [Debugging](#Debugging)
    - [Data Collection](#Data-Collection)
    - [Targeting Actions](#Targeting-Actions)
    - [Recommendation](#Recommendation)


# Introduction

This library is the official Swift SDK of Visilabs for native IOS projects. The library is written with Swift 5 and minimum deployment target is 10.

If you are using a lower version of Swift or minimum deployment target of your project is lower than 10, we recommend using **[Objective-C Library](https://github.com/visilabs/Visilabs-IOS )**.

# Example

To run the example project, clone the repo, and run `pod install` from the Example directory.

# Installation

VisilabsIOS is available through [CocoaPods](https://cocoapods.org). To install it, simply add the following line to your Podfile:

```ruby
pod 'VisilabsIOS'
```

# Usage


## Initializing

Import VisilabsIOS in AppDelegate.swift and call  `createAPI` method within  `application:didFinishLaunchingWithOptions:` method.

The code below is a sample initialization of Visilabs library.

```swift
import VisilabsIOS

func application(_ application: UIApplication, didFinishLaunchingWithOptions 
        launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        Visilabs.createAPI(organizationId: "YOUR_ORGANIZATION_ID", profileId: "YOUR_PROFILE_ID"
        , dataSource: "YOUR_DATASOURCE", inAppNotificationsEnabled: false, channel: "IOS"
        , requestTimeoutInSeconds: 30, geofenceEnabled: false, maxGeofenceCount: 20)
        return true
    }                                        
```


### Debugging



## Data Collection



## Targeting Actions


## Recommendation





















## Requirements

## Installation

VisilabsIOS is available through [CocoaPods](https://cocoapods.org). To install
it, simply add the following line to your Podfile:

```ruby
pod 'VisilabsIOS'
```

Then go to the path of your project file from the terminal and run the ```pod install``` command.

## Initializing
Open ```AppDelegate.swift```<br />

Add Visilabs using the line below <br />

```import VisilabsIOS``` <br />

Depending on your needs you can initialize Visilabs with various number of parameters. 

In simplest form Visilabs IOS SDK could be initialized with 6 mandatory parameters. If you initialize Visilabs IOS SDK this way, only event logging functionalities would be available. The following example shows this type of initialization. 

```swift
Visilabs.createAPI(organizationId: "YOUR_ORGANIZATION_ID", siteId: "YOUR_SITE_ID"
, loggerUrl: "http://lgr.visilabs.net", dataSource: "YOUR_DATASOURCE"
, realTimeUrl: "http://rt.visilabs.net", channel: "IOS")
```

If you want to use recommendation module you need to add **targetUrl** parameter and use **createAPI** method as shown below:

```swift
Visilabs.createAPI(organizationId: "YOUR_ORGANIZATION_ID", siteId: "YOUR_SITE_ID"
, loggerUrl: "http://lgr.visilabs.net", dataSource: "YOUR_DATASOURCE"
, realTimeUrl: "http://rt.visilabs.net", channel: "IOS", targetUrl: "http://s.visilabs.net/json")
```

If you want to use target module and use in-app-messages you need to add **actionUrl** parameter and use **createAPI** method as shown below:

```swift
Visilabs.createAPI(organizationId: "YOUR_ORGANIZATION_ID", siteId: "YOUR_SITE_ID"
, loggerUrl: "http://lgr.visilabs.net", dataSource: "YOUR_DATASOURCE"
, realTimeUrl: "http://rt.visilabs.net", channel: "IOS", actionUrl: "http://s.visilabs.net/actjson")
```

If you want to use geofence module  you need to add **geofenceUrl**, **geofenceEnabled** and **maxGeofenceCoun**t parameter. **maxGeofenceCount** parameter indicates the maximum number of geographic areas which SDK can track. By default IOS is able to track 20 geofences, but if you need to restrict maximum number of geofences you can define a number less than 20 to **maxGeofenceCount** parameter.

```swift
Visilabs.createAPI(organizationId: "YOUR_ORGANIZATION_ID", siteId: "YOUR_SITE_ID"
, loggerUrl: "http://lgr.visilabs.net", dataSource: "YOUR_DATASOURCE"
, realTimeUrl: "http://rt.visilabs.net", channel: "IOS", geofenceUrl: "http://s.visilabs.net/geojson"
, geofenceEnabled: true, maxGeofenceCount: 20)
```

If you are using all of the modules described above you can call **createAPI** method with all parameters mentioned above.

```swift
Visilabs.createAPI(organizationId: "YOUR_ORGANIZATION_ID", siteId: "YOUR_SITE_ID"
, loggerUrl: "http://lgr.visilabs.net", dataSource: "YOUR_DATASOURCE"
, realTimeUrl: "http://rt.visilabs.net", channel: "IOS", targetUrl: "http://s.visilabs.net/json"
, actionUrl: "http://s.visilabs.net/actjson", geofenceUrl: "http://s.visilabs.net/geojson"
, geofenceEnabled: true, maxGeofenceCount: 20)
```

Initialization method  createAPI should be called in the **didFinishLaunchingWithOptions** method of **AppDelegate** class. Required parameters **organizationId**, **siteId** and **dataSource** is obtained by RMC web panel. 

## Debugging

By default console debugging is disabled. To enable debugging you need to set the **loggingEnabled** property of SDK to true after the call of **createAPI**.

```swift
Visilabs.createAPI(organizationId: "YOUR_ORGANIZATION_ID", siteId: "YOUR_SITE_ID"
, loggerUrl: "http://lgr.visilabs.net", dataSource: "YOUR_DATASOURCE"
, realTimeUrl: "http://rt.visilabs.net", channel: "IOS", targetUrl: "http://s.visilabs.net/json"
, actionUrl: "http://s.visilabs.net/actjson", geofenceUrl: "http://s.visilabs.net/geojson"
, geofenceEnabled: true, maxGeofenceCount: 20)
Visilabs.callAPI().loggingEnabled = true
```

## Event Logging

### Sign Up

When an user signs up your application you need to call **signUp** method of SDK. At its simplest you can call **signUp** method by passing the unique identifier of the user to the method.

```swift
Visilabs.callAPI().signUp(exVisitorId: "userId")
```

Moreover, you can pass additional information to the optional parameter **properties**  when user signs up. The following example shows the call of **signUp** method with properties which includes **OM.sys.TokenID** and **OM.sys.AppID** parameters. **OM.sys.TokenID** and **OM.sys.AppID** are required to send push notifications and **OM.sys.AppID** parameter can be obtained by RMC web panel. 
//TODO: burada OM.sys.AppID'nin nasıl alınabileceğini daha detaylı açıkla.

```swift
var properties = [String:String]()
properties["OM.sys.TokenID"] = "Token ID to use for push messages"
properties["OM.sys.AppID"] = "App ID to use for push messages"
Visilabs.callAPI().signUp(exVisitorId: "userId", properties: properties)
```

### Login

Like **signUp** method  **login** method can be called with or without optional parameter properties.

```swift
var properties = [String:String]()
properties["OM.sys.TokenID"] = "Token ID to use for push messages"
properties["OM.sys.AppID"] = "App ID to use for push messages"
Visilabs.callAPI().login(exVisitorId: "userId", properties: properties)
```

### Custom Event

**customEvent** is an universal method to record all events except login and sign up. **customEvent** receives 2 arguments: **pageName** and **properties**.  **pageName** indicates the page of application the user is visiting. **properties** should include additional information about the event. Below there are some common example usages of **customEvent** method.

#### Page View

```swift
Visilabs.callAPI().customEvent("Page Name", properties: [String:String]())
```

#### Product View

```swift
var properties = [String:String]()
properties["OM.pv"] = "Product Code"
properties["OM.pn"] = "Product Name"
properties["OM.ppr"] = "Product Price"
properties["OM.pv.1"] = "Product Brand"
properties["OM.ppr"] = "Product Price"
properties["OM.inv"] = "Number of items in stock"
Visilabs.callAPI().customEvent("Product View", properties: properties)
```

#### Add to Cart

```swift
var properties = [String:String]()
properties["OM.pbid"] = "Basket ID"
properties["OM.pb"] = "Product1 Code;Product2 Code"
properties["OM.pu"] = "Product1 Quantity;Product2 Quantity"
properties["OM.ppr"] = "Product1 Price*Product1 Quantity;Product2 Price*Product2 Quantity"
Visilabs.callAPI().customEvent("Cart", properties: properties)
```

#### Product Purchase

```swift
var properties = [String:String]()
properties["OM.tid"] = "Order ID"
properties["OM.pp"] = "Product1 Code;Product2 Code"
properties["OM.pu"] = "Product1 Quantity;Product2 Quantity"
properties["OM.ppr"] = "Product1 Price*Product1 Quantity;Product2 Price*Product2 Quantity"
Visilabs.callAPI().customEvent("Purchase", properties: properties)
```

#### Product Category Page View

```swift
var properties = [String:String]()
properties["OM.clist"] = "Category Code/Category ID"
Visilabs.callAPI().customEvent("Category View", properties: properties)
```

#### In App Search

```swift
var properties = [String:String]()
properties["OM.oss"] = "Search Keyword"
properties["OM.ossr"] = "Number of Search Results"
Visilabs.callAPI().customEvent("In App Search", properties: properties)
```

#### Banner Click

```swift
var properties = [String:String]()
properties["OM.OSB"] = "Banner Name/Banner Code"
Visilabs.callAPI().customEvent("Banner Click", properties: properties)
```

#### Add To Favourites

```swift
var properties = [String:String]()
properties["OM.pf"] = "Product Code"
properties["OM.pfu"] = "1"
properties["OM.ppr"] = "Product Price"
Visilabs.callAPI().customEvent("Add To Favorites", properties: properties)
```

#### Remove from Favourites

```swift
var properties = [String:String]()
properties["OM.pf"] = "Product Code"
properties["OM.pfu"] = "-1"
properties["OM.ppr"] = "Product Price"
Visilabs.callAPI().customEvent("Add To Favorites", properties: properties)
```

#### Sending Campaign Parameters

```swift
var properties = [String:String]()
properties["utm_source"] = "euromsg"
properties["utm_medium"] = "push"
properties["utm_campaign"] = "euromsg campaign"
Visilabs.callAPI().customEvent("Login Page", properties: properties)
```


#### Push Message Token Registration

```swift
var properties = [String:String]()
properties["OM.sys.TokenID"] = "Token ID to use for push messages"
properties["OM.sys.AppID"] = "App ID to use for push messages"
Visilabs.callAPI().customEvent("RegisterToken", properties: properties)
```




Product recommendations are handled by the **recommend** method of SDK. You have to pass 3 mandatory arguments which are **zoneId**, **productCode** and **completion** to **recommend** method.

**completion** parameter is a closure expression which takes an **VisilabsRecommendationResponse** instance as input and returns nothing. The structure of **VisilabsRecommendationResponse** is shown below:

```swift
public class VisilabsRecommendationResponse {
    public var products: [VisilabsProduct]
    public var error: VisilabsReason?
    
    internal init(products: [VisilabsProduct], error: VisilabsReason? = nil) {
        self.products = products
        self.error = error
    }
}
```
**VisilabsProduct** class has the following properties:

| Property      | Type |
| ----------- | ----------- |
| code      | String       |
| title   | String        |
| img   | String        |
| dest_url   | String        |
| brand   | String        |
| price   | Double        |
| dprice   | Double        |
| cur   | String        |
| dcur   | String        |
| freeshipping   | Bool        |
| samedayshipping   | Bool        |
| rating   | Int        |
| comment   | Int        |
| discount   | Double        |
| attr1   | String        |
| attr2   | String        |
| attr3   | String        |
| attr4   | String        |
| attr5   | String        |



If recommended products exist for given arguments in **completion** method you need to handle the array of products. 

```swift
Visilabs.callAPI().recommend(zoneID: "6", productCode: "pc", filters: filters, properties: properties, completion: { response in
    if let error = response.error{
        
    }else{
        for product in response.products{
            print(product)
        }
    }
})
```







## Author

egemen@visilabs.com, egemengulkilik@gmail.com, umutcan.alparslan@euromsg.com

## License

