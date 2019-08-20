import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class MessageService {
  constructor(private alertCtrl: AlertController) { }

  alert(title: string, message: string) {
    return new Promise<boolean>(resolve => {
      let confirm = this.alertCtrl.create({
        //title: title,
        message: message,
        buttons: [
          {
            text: 'Ok',
            handler: () => resolve(true)
          }
        ]
      });
      confirm.present();
    });
  }
}