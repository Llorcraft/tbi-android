//import { PicturesPage } from './../pictures/pictures';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Project } from '../../models';
import { ProjectService } from '../../services/project.service';

export class PictureReport {
  public project: Project;
  public report_name: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public service: ProjectService
  ) {
    this.project = navParams.get('project');
    this.report_name = navParams.get('report_name') || '';
  }

  public show_pictures(): void{
    // this.navCtrl.push(PicturesPage, {
    //   project: this.project
    // });
  }

  ionViewDidLoad() {
  }
  ionViewWillLeave() {
  }
}
