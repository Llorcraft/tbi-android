import { ReportCategory } from './../../models/report-category';
import { Project } from './../../models';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class ProjectReportsPage {
  private interval = null;
  public project: Project
  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    allowEdit: true
  }
  base64Image: string = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera) {

    this.project = navParams.get("project");
  }

  public goto_component(component: ReportCategory):void{
    // this.navCtrl.push(ComponentTypePage, {
    //   component: component,
    //   caller: this
    // });
  }

  back(){
    //this.appCtrl.getRootNav().setRoot(HomeTabsPage, {}, {animate: true, direction: 'forward'});
  }
  // on_touch_start(component: ReportCategory){
  //   this.interval = setTimeout(()=>component.show_long_desc = !component.show_long_desc, 1500)
  // }
  on_touch_end(){
    clearTimeout(this.interval);
  }
  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
}
