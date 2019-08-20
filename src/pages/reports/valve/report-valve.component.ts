import { Component } from '@angular/core';
import { BaseReportPage, ReportValve } from '../../../models/reports';
import { NavController, NavParams, AlertController, Keyboard, ModalController } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { MessageService } from '../../../services/messages.service';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';


@Component({
  selector: 'page-report-valve',
  templateUrl: 'report-valve.component.html'
})

export class ReportValvePage extends BaseReportPage {
  public unknow_length: boolean = true;

  constructor(protected navCtrl: NavController,
    navParams: NavParams,
    protected service: ReportService,
    protected alertCtrl: AlertController,
    protected picture: PictureService,
    protected message: MessageService,
    protected keyboard: Keyboard,
    protected file: FileService,
    protected opener: FileOpener,
    public modalCtrl: ModalController
  ) {
    super(new ReportValve(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener);
  }
}
