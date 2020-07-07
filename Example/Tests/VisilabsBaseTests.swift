//
//  VisilabsBaseTests.swift
//  VisilabsIOS_Tests
//
//  Created by Egemen on 7.07.2020.
//  Copyright © 2020 CocoaPods. All rights reserved.
//

import XCTest
import VisilabsIOS

class VisilabsBaseTests: XCTestCase {
    
    var visilabs: VisilabsInstance!
    
    override func setUp(){
        print("Visilabs test setup starting")
        super.setUp()
        
        //TODO: buraya stub'lar gelecek.
        
        
        visilabs = Visilabs.createAPI(organizationId: "", siteId: "", loggerUrl: "", dataSource: "", realTimeUrl: "", channel: "", requestTimeoutInSeconds: 0, targetUrl: "", actionUrl: "", geofenceUrl: "", geofenceEnabled: false, maxGeofenceCount: 0, restUrl: "", encryptedDataSource: "")
        
        print("Visilabs test setup finished")
        
        
    }
    
    override func tearDown() {
        
        super.tearDown()
    }
    
    
}
