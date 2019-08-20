import { Component } from '@angular/core';
import { BaseReportPage, ReportCondensation } from '../../../models/reports';
import { NavController, NavParams, AlertController, Keyboard, Toggle } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { ReportBase } from '../../../models/report-base';
import { MessageService } from '../../../services/messages.service';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-report-condensation',
  templateUrl: 'report-condensation.component.html'
})

export class ReportCondensationPage extends BaseReportPage {

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
    super(new ReportCondensation(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener);
  }

  protected calculate(): ReportBase {
    return this.validateGeneric();
  }
  setCondensation(event: Toggle, index: number) {
    this.report.component.fields.condensation[index] = event.checked;
    if (event.checked) this.report.component.fields.condensation[(index == 0 ? 1 : 0)] = false;
  }
}