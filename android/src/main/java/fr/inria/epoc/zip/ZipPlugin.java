package fr.inria.epoc.zip;

import com.getcapacitor.Logger;

public class ZipPlugin {

    public String echo(String value) {
        Logger.info("Echo", value);
        return value;
    }
}
