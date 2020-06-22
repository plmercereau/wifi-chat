#!/bin/bash
quasar build -m capacitor -T android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore platyplus.keystore dist/capacitor/android/apk/release/app-release-unsigned.apk platyplus
$ANDROID_HOME/build-tools/29.0.3/zipalign -v 4 dist/capacitor/android/apk/release/app-release-unsigned.apk dist/capacitor/android/apk/release/app-release-signed.apk
