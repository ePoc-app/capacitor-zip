import { ZipPlugin } from 'capacitor-plugin-zip';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    ZipPlugin.echo({ value: inputValue })
}
