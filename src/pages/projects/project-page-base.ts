import { AlertController, Keyboard } from 'ionic-angular';
import { Project } from '../../models';
import { ProjectService } from '../../services/project.service';
import { ScrollToComponent } from '../scroll_to_component.class';

export class ProjectPageBase extends ScrollToComponent {
  protected remove_mode: boolean = false;
  
  constructor(
    public alertCtrl: AlertController,
    public service: ProjectService,
    protected keyboard: Keyboard) {
      super(keyboard);
  }

  public delete_project(project: Project, event: Event) {
    !!event && event.stopPropagation();
    this.remove_mode = true;
    let confirm = this.alertCtrl.create({
      //title: `Remove`,
      message: `Do you agree to remove permanently '${project.name}'?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.delete(project);
          }
        },
        {
          text: 'No',
          role: 'candel'
        }
      ]
    });
    confirm.present();
  }

  public delete(project: Project): void {
    this.service.delete(project).then(() => this.after_delete());
  }

  protected after_delete(): void { }
}
