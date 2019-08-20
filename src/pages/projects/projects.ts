import { Project } from './../../models/project';
import { ProjectService } from '../../services/project.service';
import { Component } from '@angular/core';
import { NavController, Platform, ActionSheetController, AlertController, NavParams, Keyboard } from 'ionic-angular';
import { ProjectPageBase } from './project-page-base';
import { EditProjectPage } from './edit';
import { ReportsPage } from '../reports';
import { ReportCategory, ReportBase } from '../../models';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { LicencesService } from '../../services/licences.service';
import { SummaryPage } from '../summary/summary';
import { TbiComponent } from '../../models/component';
import { Includes } from '../../enums';
import { IMAGES } from '../../const/images';

@Component({
  selector: 'page-project',
  templateUrl: 'projects.html'
})

export class ProjectsPage extends ProjectPageBase {
  public projects: Project[] = [];
  public edit_mode: boolean = false;
  public user_name = '';
  public top_categories: ReportCategory[] = [];
  public apps: any[] = [];
  public images = IMAGES
  exporting = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ProjectService,
    public platform: Platform,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public licences: LicencesService,
    uuid: UniqueDeviceID,
    protected keyboard: Keyboard) {

    super(alertCtrl, service, keyboard);

    if (this.licences.remaining() <= 0) this.onLicenseExpire();

    // uuid.get()
    //   .then((uuid: any) => console.log(uuid))
    //   .catch((error: any) => console.log(error));

    this.user_name = this.navParams.get("user_name") || this.user_name
  }

  ngOnInit(): void {
    this.licences.setLogo()
  }

  public toggle_export_data() {
    if (this.exporting) return this.exporting = false;
    this.alertCtrl.create({
      message: 'Select the project to be saved as a .tbi file. The .tbi file can be shared and further processed (e.g. create backups, tailored reports, etc.) with the TBI-Admin.',
      cssClass: 'project-action-sheet',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.projects.forEach(p => p.selected = true);
            this.exporting = true;
          }
        }
      ]
    }).present();
  }

  public export_data() {
    this.create_db();
    this.toggle_export_data();
  }

  public duplicate(project: Project, event?: Event) {
    if (!!event) {
      event.cancelBubble = true;
      event.preventDefault();
    }
    let new_project = new Project(project);
    new_project.id = '';
    new_project.name = `${project.name} Copy`;
    new_project.date = new Date();
    new_project.components = new_project.components.map(c => {
      let new_component = new TbiComponent(new_project, c);
      new_component.id = '';
      new_component.date = new_project.date;
      new_component.fields.location = `${c.fields.location} Copy`;
      return new_component;
    });
    this.service.save(new_project).then(() => this.load());
  }

  public open_report(project: Project): void {
    if (this.edit_mode) {
      this.edit_mode = false;
      return this.navigate_to_edit(project);
    }

    if (this.licences.lock) {
      this.alert_licence();
    } else {
      this.navCtrl.push(ReportsPage, {
        project: project,
        report: null,
        parent: this
      });
    }
  }

  ask_for_action(project: Project) {
    let buttons = [
      {
        text: 'Open',
        //icon: 'document',
        handler: () => {
          this.open(project)
        }
      },
      {
        text: 'Edit properties',
        //icon: 'create',
        handler: () => {
          this.navigate_to_edit(project)
        }
      },
      {
        text: 'Duplicate',
        //icon: 'copy',
        handler: () => {
          this.duplicate(project)
        }
      },
      {
        text: 'Delete',
        role: 'destructive',
        //icon: 'trash',
        handler: () => {
          setTimeout(() => this.delete_project(project, null), 250);
        }
      }, {
        text: 'Cancel',
        //icon: 'thumbs-down',
        role: 'cancel'
      }
    ]
    if (this.licences.type != 'PRO') {
      buttons.splice(3, 1);
      buttons.splice(2, 1);
    }
    this.actionSheetCtrl.create({
      //title: 'What would you like to do?',
      cssClass: 'project-action-sheet',
      buttons: buttons
    }).present();
  }

  alert_licence() {
    this.alertCtrl.create({
      //title: 'Licence',
      message: 'To create more projects, please upgrade to TBI-App Pro',
      cssClass: 'project-action-sheet',
      buttons: [
        {
          text: 'Upgrade',
          handler: () => {
            window.open('http://www.eiif.org/tbi', '_system', 'location=yes')
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  ionViewWillEnter() {
    this.load().then(() => {
      if (!!this.navParams.get('summary'))
        this.navCtrl.setRoot(SummaryPage, { project: this.projects.find(p => p.id == this.navParams.get('project')) }, { animate: true, direction: 'backward' });
      if (!this.projects.length) {
        // this.service.save(new Project({
        //   name: this.licences.type != 'PRO' ? 'TBI Easy' : 'TBI First Project',
        //   price_delta: 1,
        //   co2: 202,
        //   user: localStorage.getItem('tbi-user')
        // })).then(() => {
        //   this.service.get_all().then(projects => {

        //   })
        // })
        this.navCtrl.push(EditProjectPage, { project: new Project(), force: true })
      }
    });
  }

  public load(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.service.get_all(true, Includes.COMPONENTS + Includes.CONTACTS).then(p => {
        this.projects = p;
        if (!this.projects.length) this.edit_mode = false;
        resolve(true);
      });
    });
  }

  public open(project: Project): void {
    if (this.remove_mode) {
      this.remove_mode = false;
    } else if (this.edit_mode) {
      this.edit_mode = false;
      this.navigate_to_edit(project);
    } else {
      this.navigate_to_reports(project);
    }
  }
  private navigate_to_reports(project?: Project): any {
    if (this.exporting) return false;
    return !!project.components.length
      ? this.open_summary(project)
      : this.navCtrl.push(ReportsPage, {
        project: project,
        parent: this
      });
  }
  private navigate_to_edit(project?: Project, event?: Event): void {
    if (!!event) event.stopPropagation();
    this.navCtrl.push(EditProjectPage, {
      project: project,
      parent: ProjectsPage
    });
  }
  public toggle_edit_mode(): void {
    this.edit_mode = !this.edit_mode;
  }
  public select_file(): void {
    this.edit_mode = false;
    setTimeout(() => this.create(), 200);
  }
  public create(): void {
    if (this.licences.type != 'PRO' && !this.edit_mode && this.projects.length > 0) {
      this.alert_licence();
      return;
    }

    setTimeout(() => this.navigate_to_edit(new Project()), this.edit_mode ? 200 : 0);
    this.edit_mode = false;
  }

  get can_export(): boolean {
    return !!this.projects.filter(p => p.selected).length;
  }

  validateProCode() {
    this.alertCtrl.create({
      message: 'Please insert your TBI-App Pro licence key.',
      cssClass: `ion-dialog-horizontal margin-top`,
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'code',
          value: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.onLicenseExpire();
          }
        },
        {
          text: 'Validate',
          role: 'submit',
          handler: (data) => {
            if (!data.code) return this.validateProCode();
            this.licences.validate(data.code).then((result: { ok: boolean, message: string }) => {
              this.alertCtrl.create({
                message: result.message,
                cssClass: `ion-dialog-horizontal margin-top`,
                enableBackdropDismiss: false,
                buttons: [{
                  text: 'OK',
                  role: 'submit',
                  handler: () => {
                    if (result.ok) {
                      this.navCtrl.setRoot(ProjectsPage, { animate: false })
                    } else {
                      this.onLicenseExpire();
                    }
                  }
                }]
              }).present();
            })
          }
        }]
    }).present()
  }

  onLicenseExpire() {
    this.actionSheetCtrl.create({
      title: 'The TBI-Pro license has expired. All reports will be deleted.',
      cssClass: 'project-action-sheet',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Get Pro-license key',
          handler: () => {
            this.licences.requestProKey();
            this.validateProCode();
          }
        },
        {
          text: 'Insert Pro-license key',
          //icon: 'information-circle',
          handler: () => {
            this.validateProCode();
          }
        },
        {
          text: 'Save reports',
          handler: () => {
            this.service.create_database(this.projects).then(result => {
              this.alertCtrl.create({
                message: result,
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.projects = [];
                      this.service.save_all([]).then(() => {
                        this.licences.reset();
                        this.navCtrl.setRoot(ProjectsPage, { animate: false })
                      });
                    }
                  }
                ]
              }).present();
            })
          }
        }, {
          text: 'Continue as Free',
          handler: () => {
            this.projects = [];
            this.service.save_all([]).then(() => {
              this.licences.reset();
              this.navCtrl.setRoot(ProjectsPage, { animate: false })
            });
          }
        }
      ]
    }).present();
  }

  public create_db(): void {
    this.service.create_database(this.projects.filter(p => p.selected)).then((result: string) => {
      this.alertCtrl.create({
        message: result,
        buttons: [
          'OK'
        ]
      }).present();
    });
  }

  after_delete() {
    this.load();
  }

  private flatten(arr: any[]): any[] {
    return [].concat.apply([], arr);
  }
  get_by_type(project: Project, type: string): ReportBase[] {
    //return project.get_reports_by_types(type);
    return this.flatten(project.components.filter(c => !c.validation).map(c => c.reports)).filter(r => !!r.path.match(new RegExp('(' + type + ')', 'gi')));
  }

  protected open_summary(project): void {
    this.navCtrl.push(SummaryPage, { project: project, parent: this });
  }

  go_next() {
    this.navigate_to_reports(this.projects[0])
    // if (!!this.projects.length && !this.projects[0].components.length) {
    //   this.open_summary(this.projects[0])
    // } else {
    //   (new ReportRouter(this.projects[0], this.projects[0].components[0], this.navCtrl)).navigate_to_report(this.projects[0].components[0].reports[0].path, this.projects[0].components[0].reports[0].summary_id, this.projects[0].components[0].reports[0], null, this.projects[0].components[0].result);
    // }
  }
}
