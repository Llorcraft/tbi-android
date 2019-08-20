import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';
import { ProjectService } from '../../services';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  accept = false;
  get notAccept(): boolean {
    return !this.accept;
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public service: ProjectService,
    protected keyboard: Keyboard) {
  }
}
