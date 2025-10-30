package fr.inria.epoc.zip;

import java.io.File;
import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;

@CapacitorPlugin(name = "Zip")
public class ZipPlugin extends Plugin {

    private static final String TAG = "ZipPlugin";

    @PluginMethod
    public void zip(PluginCall call) {
        String source = call.getString("source");
        String destination = call.getString("destination");
        try {
            new ZipFile(destination).addFolder(new File(source));
            call.resolve(new JSObject().put("success", true));
        } catch (ZipException e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void unzip(PluginCall call) {
        String source = call.getString("source");
        String destination = call.getString("destination");

        if (source == null || destination == null) {
            call.reject("Source or destination path is missing");
            return;
        }

        // Supprimer le préfixe 'file://' si présent
        if (source.startsWith("file://")) {
            source = source.substring(7);
        }
        if (destination.startsWith("file://")) {
            destination = destination.substring(7);
        }

        Log.d(TAG, "Unzipping from: " + source);
        Log.d(TAG, "Unzipping to: " + destination);

        try {
            // Vérifier si le fichier source existe
            File sourceFile = new File(source);
            if (!sourceFile.exists()) {
                call.reject("Source file does not exist at path: " + source);
                return;
            }

            // Créer le répertoire de destination s'il n'existe pas
            File destinationDir = new File(destination);
            if (!destinationDir.exists()) {
                boolean dirCreated = destinationDir.mkdirs();
                if (!dirCreated) {
                    call.reject("Failed to create destination directory: " + destination);
                    return;
                }
            }

            // Extraire le fichier ZIP
            ZipFile zipFile = new ZipFile(source);
            zipFile.extractAll(destination);

            call.resolve(new JSObject().put("success", true));
        } catch (ZipException e) {
            Log.e(TAG, "Unzip failed: " + e.getMessage());
            call.reject("Unzip failed: " + e.getMessage());
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error: " + e.getMessage());
            call.reject("Unexpected error: " + e.getMessage());
        }
    }
}
