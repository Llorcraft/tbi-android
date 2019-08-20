import { Component } from '@angular/core';
import { BaseReportPage, ReportInsulatedSurface } from '../../../models/reports';
import { NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';
import { ReportService } from '../../../services/report.service';
import { MessageService } from '../../../services/messages.service';
import { PictureService, FileService } from '../../../services';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-report-surface',
  templateUrl: 'report-isurface.component.html'
})

export class ReportInsulatedSurfacePage extends BaseReportPage {
  public unknow_surface: boolean = false;
  
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
    super(new ReportInsulatedSurface(navParams.data.project, navParams.data.component, navParams.data.report), navParams, navCtrl, service, alertCtrl, picture, message, keyboard, file, opener);
  }
}
