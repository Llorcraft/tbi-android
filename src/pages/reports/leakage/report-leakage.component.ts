import { Component } from '@angular/core';
import { BaseReportPage } from '../../../models/reports';
import { NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { MessageService } from '../../../services/messages.service';
import { ReportLeakage } from '../../../models/reports/report-leakage';
import { ReportBase } from '../../../models';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-report-leakage',
  templateUrl: 'report-leakage.component.html'
})

export class ReportLeakagePage extends BaseReportPage {
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
    super(new ReportLeakage(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener);
  }

  protected calculate(): ReportBase {
    return this.validateGeneric();
  }
}
