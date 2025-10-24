import Foundation
import Capacitor
import SSZipArchive

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(ZipPlugin)
public class ZipPlugin: CAPPlugin {
    @objc func zip(_ call: CAPPluginCall) {
        guard let source = call.getString("source"),
              let destination = call.getString("destination") else {
            call.reject("Missing source or destination")
            return
        }
        DispatchQueue.global().async {
            let success = SSZipArchive.createZipFile(atPath: destination, withContentsOfDirectory: source)
            call.resolve(["success": success])
        }
    }

    @objc func unzip(_ call: CAPPluginCall) {
        guard let source = call.getString("source"),
              let destination = call.getString("destination") else {
            call.reject("Missing source or destination")
            return
        }
        DispatchQueue.global().async {
            let success = SSZipArchive.unzipFile(atPath: source, toDestination: destination)
            call.resolve(["success": success])
        }
    }
}
