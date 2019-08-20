ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore insulation.keystore .\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk insulation
Remove-Item –path .\platforms\android\app\build\outputs\apk\release\tbi-insulation.apk –recurse 
zipalign -v 4 .\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk .\platforms\android\app\build\outputs\apk\release\tbi-insulation.apk

