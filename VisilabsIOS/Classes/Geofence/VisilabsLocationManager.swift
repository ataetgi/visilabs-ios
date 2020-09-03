//
//  VisilabsLocationManager.swift
//  VisilabsIOS
//
//  Created by Egemen on 11.08.2020.
//

import Foundation
import CoreLocation

class VisilabsLocationManager : NSObject {
    
    public static let sharedManager = VisilabsLocationManager()

    private var locationManager: CLLocationManager?
    private var requestLocationAuthorizationCallback: ((CLAuthorizationStatus) -> Void)?
    
    
    var currentGeoLocationValue: CLLocationCoordinate2D?
    var sentGeoLocationValue: CLLocationCoordinate2D? //TODO: ne işe yarayacak bu?
    var sentGeoLocationTime: TimeInterval? //for calculate time delta to prevent too often location update notification send.
    var locationServiceEnabled = false
    
    override init(){
        super.init()
    }
    
    deinit {
        locationManager?.delegate = nil
        NotificationCenter.default.removeObserver(self)// TODO: buna gerek var mı tekrar kontrol et.
    }
    
    func stopMonitorRegions(){
        if let regions = self.locationManager?.monitoredRegions {
            for region in regions {
                if region.identifier.contains("visilabs", options: String.CompareOptions.caseInsensitive){
                    self.locationManager?.stopMonitoring(for: region)
                    VisilabsLogger.info("stopped monitoring region: \(region.identifier)")
                }
            }
        }
    }
    
    //notDetermined, restricted, denied, authorizedAlways, authorizedWhenInUse
    var locationServiceStateStatus: CLAuthorizationStatus {
        return CLLocationManager.authorizationStatus()
    }
    
    var locationServicesEnabledForDevice: Bool {
        return CLLocationManager.locationServicesEnabled()
    }
    
    func startMonitorRegion(region: CLRegion) {
        if CLLocationManager.isMonitoringAvailable(for: type(of: region)) {
            locationManager?.startMonitoring(for: region)
        }
    }
    
    func createLocationManager() {
        self.locationManager = CLLocationManager()
        self.locationManager?.delegate = self
        #if !TARGET_IPHONE_SIMULATOR
            if self.locationManager?.responds(to: #selector(setter: CLLocationManager.pausesLocationUpdatesAutomatically)) ?? false {
                self.locationManager?.pausesLocationUpdatesAutomatically = false
            }
        #endif
        self.requestLocationAuthorization()
        //TODO:bunu yayınlarken tekrar 100e çek
        self.locationManager?.desiredAccuracy = kCLLocationAccuracyHundredMeters // kCLLocationAccuracyBest
        self.locationManager?.distanceFilter = CLLocationDistance(10)
        self.currentGeoLocationValue = CLLocationCoordinate2DMake(0, 0)
        self.sentGeoLocationValue = CLLocationCoordinate2DMake(0, 0)
        self.sentGeoLocationTime = 0
        
        
        //Significant Location Change Monitoring is only available when using cell tower.
        //https://stackoverflow.com/questions/5885293/hows-does-significant-location-change-work
        if CLLocationManager.significantLocationChangeMonitoringAvailable() {
            VisilabsLogger.info("Start significant location update.")
            locationManager?.startMonitoringSignificantLocationChanges()
            locationServiceEnabled = true
        }
        
    }
    
    public func requestLocationAuthorization() {
        let currentStatus = CLLocationManager.authorizationStatus()

        guard currentStatus == .notDetermined else { return }

        if #available(iOS 13.4, *) {
            self.requestLocationAuthorizationCallback = { status in
                if status == .authorizedWhenInUse {
                    self.locationManager?.requestAlwaysAuthorization()
                }
            }
            self.locationManager?.requestWhenInUseAuthorization()
        } else {
            self.locationManager?.requestAlwaysAuthorization()
        }
    }
}

extension VisilabsLocationManager: CLLocationManagerDelegate {
    
    // MARK: - CLLocationManagerDelegate implementation
    
    //TODO: buna bak tekrardan
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        self.requestLocationAuthorizationCallback?(status)
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]){
        if !locationServiceEnabled {
            return
        } else if (locations.count > 0){
            self.currentGeoLocationValue = locations[0].coordinate
            VisilabsLogger.info("CLLocationManager didUpdateLocations: lat:\(locations[0].coordinate.latitude) lon:\(locations[0].coordinate.longitude)")
            VisilabsGeofence.sharedManager?.getGeofenceList(lastKnownLatitude: self.currentGeoLocationValue?.latitude, lastKnownLongitude: self.currentGeoLocationValue?.longitude)
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        VisilabsLogger.error("CLLocationManager didFailWithError : \(error.localizedDescription)")
    }
    
    func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
        let elements = region.identifier.components(separatedBy: "_")
        if elements.count == 4 , elements[0] == "visilabs" {
            let actionId = elements[1]
            let geofenceId = elements[2]
            let targetEvent = elements[3]
            if targetEvent == VisilabsConstants.ON_ENTER {
                //TODO: burada isEnter false geçmişim neden?
                VisilabsGeofence.sharedManager?.sendPushNotification(actionId: actionId, geofenceId: geofenceId, isDwell: false, isEnter: false)
            } else if targetEvent == VisilabsConstants.DWELL {
                VisilabsGeofence.sharedManager?.sendPushNotification(actionId: actionId, geofenceId: geofenceId, isDwell: true, isEnter: true)
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
        let elements = region.identifier.components(separatedBy: "_")
        if elements.count == 4 , elements[0] == "visilabs" {
            let actionId = elements[1]
            let geofenceId = elements[2]
            let targetEvent = elements[3]
            if targetEvent == VisilabsConstants.ON_EXIT {
                VisilabsGeofence.sharedManager?.sendPushNotification(actionId: actionId, geofenceId: geofenceId, isDwell: false, isEnter: false)
            } else if targetEvent == VisilabsConstants.DWELL {
                VisilabsGeofence.sharedManager?.sendPushNotification(actionId: actionId, geofenceId: geofenceId, isDwell: true, isEnter: false)
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didStartMonitoringFor region: CLRegion) {
        VisilabsLogger.info("CLLocationManager didStartMonitoringFor: region identifier:\(region.identifier)")
        self.locationManager?.requestState(for: region)
    }
    
    func locationManager(_ manager: CLLocationManager, monitoringDidFailFor region: CLRegion?, withError error: Error) {
    
    }
    
    func locationManager(_ manager: CLLocationManager, didDetermineState state: CLRegionState, for region: CLRegion) {
    
    }
}
