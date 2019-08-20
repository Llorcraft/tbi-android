import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { Project } from '../../models';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'page-project',
  templateUrl: 'project.html'
})

export class ProjectPage {
  public project: Project;
  public segment: string = 'reports';
  public filter: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public service: ProjectService) {

    this.project = navParams.get("project");
  }
}
