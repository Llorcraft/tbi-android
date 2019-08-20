import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { ReportGeneric } from '../../../models/reports/report-generic.class';
import { BaseReportPage } from '../../../models/reports';
import { MessageService } from '../../../services/messages.service';
import { ReportBase } from '../../../models';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-generic-report',
  templateUrl: 'generic.html',
})

export class GenericReportPage extends BaseReportPage {

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
    super(new ReportGeneric(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener);
    this.report.name = this.report.summary_id;
  }

  protected calculate(): ReportBase {
    return this.validateGeneric();
  }
}
