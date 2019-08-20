import { Component } from '@angular/core';
import { BaseReportPage, ReportSurface } from '../../../models/reports';
import { ModalController, NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { MessageService } from '../../../services/messages.service';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-report-surface',
  templateUrl: 'report-surface.component.html'
})

export class ReportSurfacePage extends BaseReportPage {
  

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
    super(new ReportSurface(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener, modalCtrl);
  }
}
