package fr.inria.epoc.zip;

import java.io.File;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;

@CapacitorPlugin(name = "Zip")
public class ZipPlugin extends Plugin {

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
        try {
            new ZipFile(source).extractAll(destination);
            call.resolve(new JSObject().put("success", true));
        } catch (ZipException e) {
            call.reject(e.getMessage());
        }
    }
}
