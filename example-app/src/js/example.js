import { Zip } from 'capacitor-zip';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    Zip.echo({ value: inputValue })
}
