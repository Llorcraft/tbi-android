import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InitPage } from '../pages/init/init';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = InitPage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private orientation: ScreenOrientation
    //private androidPermissions: AndroidPermissions
    ) {
      //this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS, this.androidPermissions.PERMISSION.READ_PHONE_STATE]);
    platform.ready().then(() => {
      //throw 'error'
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.hide();
      splashScreen.hide();

      // this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT)
      // this.orientation.onChange().subscribe(() => {
      //   document.getElementsByTagName('html')[0].className = !!this.orientation.type.match(/landscape/i) ? 'landscape' : '';
      // })

      this.orientation.onChange().subscribe(() => {
        console.log(!!this.orientation.type.match(/landscape/i) ? 'landscape' : 'portrait');
      });
    });
  }
}
