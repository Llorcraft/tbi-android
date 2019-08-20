REM ionic cordova build android --release --aot --minifyjs --optimizejs --minifycss
REM ionic cordova build android
REM ionic cordova build android --minifyjs --optimizejs --minifycss
ionic cordova build android --prod --release

REM https://techionichybride.blogspot.com/2017/10/how-create-signed-apk-for-android-in.html
REM set PATH="C:\Program Files\Java\jdk1.8.0_181\bin"
REM keytool -genkeypair -v -keystore insulation.keystore -alias insulation -keyalg RSA -keysize 2048 -validity 10000
REM jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore insulation.keystore .\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk insulation
REM set PATH="C:\Users\luis.estrada.LAPTOP-NLQESFGA\AppData\Local\Android\Sdk\build-tools\28.0.1"
REM zipalign -v 4 .\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk .\platforms\android\app\build\outputs\apk\release\tbi-insulation.apk

REM Contraseña almacen de claves: tbi-insulation
REM Tipcheck Engineer, EIIF, EIIF, , , ,