import Foundation
import Capacitor
import SSZipArchive

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(ZipPlugin)
public class ZipPlugin: CAPPlugin, CAPBridgedPlugin {
    public var identifier: String = "ZipPlugin"

    public var jsName: String = "Zip"

    public var pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "zip", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "unzip", returnType: CAPPluginReturnPromise)
    ]

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
            call.reject("Source or destination path is missing")
            return
        }

        // Remove 'file://' prefix if present
        let cleanedSource = source.hasPrefix("file://") ?
            String(source.dropFirst(7)) :
            source

        let cleanedDestination = destination.hasPrefix("file://") ?
            String(destination.dropFirst(7)) :
        destination

        // Log the cleaned path
        print("Unzipping from: \(cleanedSource)")
        print("Unzipping to: \(cleanedDestination)")

        // Check if source file exists
        let fileManager = FileManager.default
        if !fileManager.fileExists(atPath: cleanedSource) {
            call.reject("Source file does not exist at path: \(cleanedSource)")
            return
        }

        // Unzip with error handling
        let success = SSZipArchive.unzipFile(
            atPath: cleanedSource,
            toDestination: cleanedDestination,
            progressHandler: { (entry, zipInfo, entryNumber, total) in
                print("Unzipping: \(entry) (\(entryNumber)/\(total))")
            },
            completionHandler: { (path, succeeded, error) in
                if succeeded {
                    print("Unzipped successfully to \(path)")
                    call.resolve(["success": true])
                } else {
                    let errorMessage = error?.localizedDescription ?? "Unknown error during unzipping"
                    print("Unzip failed: \(errorMessage)")
                    call.reject("Unzip failed: \(errorMessage)")
                }
            }
        )

        // Fallback if completionHandler is not called
        if !success {
            call.reject("Unzip failed: SSZipArchive returned false (check logs for details)")
        }
    }
}
