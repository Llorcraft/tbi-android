import { Component } from '@angular/core';
import { BaseReportPage } from '../../../models/reports';
import { NavController, NavParams, AlertController, Keyboard, ModalController } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { ReportPipe } from '../../../models/reports/report-pipe.class';
import { MessageService } from '../../../services/messages.service';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-report-pipe',
  templateUrl: 'report-pipe.component.html'
})

export class ReportPipePage extends BaseReportPage {
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
    super(new ReportPipe(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener, modalCtrl);
  }
}
