import { Component } from '@angular/core';
import { BaseReportPage, ReportFlange } from '../../../models/reports';
import { NavController, NavParams, AlertController, Keyboard, ModalController } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { MessageService } from '../../../services/messages.service';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';


@Component({
  selector: 'page-report-flange',
  templateUrl: 'report-flange.component.html'
})

export class ReportFlangePage extends BaseReportPage {
  public unknow_length: boolean = true;

  constructor(protected navCtrl: NavController,
    navParams: NavParams,
    protected service: ReportService,
    protected alertCtrl: AlertController,
    protected picture: PictureService,
    protected message: MessageService,
    protected keyboard: Keyboard,
    public modalCtrl: ModalController,
    protected file: FileService,
    protected opener: FileOpener
  ) {
    super(new ReportFlange(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener, modalCtrl);
  }
}
