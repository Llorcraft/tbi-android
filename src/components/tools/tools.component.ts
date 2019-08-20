import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Flashlight } from '@ionic-native/flashlight';
import { MessageService } from '../../services';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'tools',
  templateUrl: `tools.component.html`,
  encapsulation: ViewEncapsulation.None
})
export class ToolsComponent implements OnInit {
  public flashlight_on: boolean;
  public calc_path: string = '';
  private external_app: any = (window as any).startApp;

  constructor(
    public flashlight: Flashlight, public message: MessageService, public platform: Platform) {

  }

  ngOnInit(): void {
    try {
      this.flashlight_on = this.flashlight.isSwitchedOn();
      (<any>window).plugins.packagemanager.show(true, (apps) => {
        let calc = apps.find((a => !!a.match(/calc/g))).split('/');
        this.calc_path = calc[calc.length - 1].split(';')[1];
      });
    } catch (ex) {
      console.log(ex.message);
    }
  }

  toggle_light() {
    if (!this.flashlight.isSwitchedOn()) {
      this.flashlight.switchOn();
      this.flashlight_on = true;
    } else {
      this.flashlight.switchOff();
      this.flashlight_on = false;
    }
  }

  open_calculator() {
    this.external_app.set({ "application": this.calc_path }).start();
  }

}
