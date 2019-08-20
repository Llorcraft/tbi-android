import { Component } from '@angular/core';
import { BaseReportPage, ReportDamaged } from '../../../models/reports';
import { NavController, NavParams, AlertController, Keyboard, Toggle } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { ReportBase } from '../../../models/report-base';
import { MessageService } from '../../../services/messages.service';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-report-damaged',
  templateUrl: 'report-damaged.component.html'
})

export class ReportDamagedPage extends BaseReportPage {

  constructor(protected navCtrl: NavController,
    navParams: NavParams,
    protected service: ReportService,
    protected alertCtrl: AlertController,
    protected picture: PictureService,
    protected message: MessageService,
    protected keyboard: Keyboard,
    protected file: FileService,
    protected opener: FileOpener
  ) {
    super(new ReportDamaged(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener);
  }

  updateDamagedCladding(event: Toggle) {
    this.report.component.fields.damaged_cladding[0] = event.checked;
    if (event.checked) this.updateDamagedInsulation({ checked: false } as Toggle);
    if (!event.checked) this.report.component.fields.damaged_cladding = [false, false, false, false];
  }


  updateDamagedInsulation(event: Toggle) {
    this.report.component.fields.damaged_insulation[0] = event.checked;
    if (event.checked) this.updateDamagedCladding({ checked: false } as Toggle);
    if (!event.checked) this.report.component.fields.damaged_insulation = [false, false, false, false];
  }

  setChecked(event: Toggle, index: number, prop: string){
    this.report.component.fields[prop][index] = event.checked;
  }

  protected calculate(): ReportBase {
    this.start_changes_observer();
    if (!this.form.invalid) {
      //this.view = 'result';
      this.save();
    } else {
      this.view = 'form';
    }
    return null;
  }
}
