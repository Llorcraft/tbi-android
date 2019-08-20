import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavParams, ModalController, NavController, ActionSheetController, Content } from 'ionic-angular';
import { Project, Value, ReportBase, Result, Fields } from '../../models';
import { ProjectService } from '../../services/project.service';
import { SummaryEditPage } from './summary-edit';
import { ReportRouter } from '../../models/report-router';
import { ReportsPage, ReportResultComponent } from '../reports';
import { TbiComponent } from '../../models/component';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { Group, exportPDF } from '@progress/kendo-drawing';
import { ProjectsPage } from '../projects/projects';
import { FileService, LicencesService, MessageService } from '../../services';
import { FileOpener } from '@ionic-native/file-opener';
import { IMAGES } from '../../const/images';
import { InitPage } from '../init/init';
import { EditProjectPage } from '../projects/edit';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { REPORT } from '../../const';
import { SummaryReportPage } from '../summary-report/summary-report';

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class SummaryPage implements OnInit {
  public has_people = false;
  public REPORT = REPORT;
  public creating_pdf = false;
  public images = IMAGES;
  public project: Project;
  public report: ReportBase;
  public reports: ReportBase[] = [];
  public components: TbiComponent[] = [];
  public heat_lost: Value = new Value();
  public saving_potential_min: Value = new Value();
  public saving_potential_max: Value = new Value();
  public advises: Map<string, string> = new Map<string, string>([
    ['', ''],
    ['System OK', 'OK'],
    ['Maintenance', 'Maintenance'],
    ['Insulation recommended', 'Recommended'],
    ['SAFETY-Insulation recommended', 'SAFETY-Recommended'],
    ['SAVINGS-achieved', 'SAVINGS-achieved']
  ]);
  public totals: Result = new Result();
  @ViewChild('pdf') public pdf: PDFExportComponent;
  @ViewChild('report_result', { read: ReportResultComponent }) public report_result: ReportResultComponent;
  @ViewChild(Content) content: Content;
  pr: Project;
  constructor(
    protected navParams: NavParams,
    protected alertCtrl: AlertController,
    protected actionSheetCtrl: ActionSheetController,
    protected modalCtrl: ModalController,
    protected service: ProjectService,
    protected navCtrl: NavController,
    private opener: FileOpener,
    public licences: LicencesService,
    private message: MessageService,
    private file: FileService,
    private cdRef: ChangeDetectorRef) {
  }

  public go_to_projects() {
    this.navCtrl.push(ProjectsPage);
  }

  public go_to_reports(component: TbiComponent) {
    this.navCtrl.push(ReportsPage, {
      project: this.project,
      component: component,
      parent: this
    });
  }

  ellipsis(text: string, size: number = 40): string {
    return text.length + 3 <= size ? text : text.substr(0, size) + '...';
  }

  add_report(type: string, component: TbiComponent, event: Event): void {
    event.cancelBubble = true;
    event.preventDefault();
    this.navCtrl.setRoot(ReportsPage, {
      project: this.project,
      parent: this,
      to: type,
      component: component
    });
  }

  add_custom_report(component: TbiComponent, event: Event): void {
    event.cancelBubble = true;
    event.preventDefault();
    const router = new ReportRouter(this.project, component, this.navCtrl);
    router.navigate_to_report(REPORT.CUSTOM, 'Other')
  }

  async actions(cl: TbiComponent, event: Event) {
    event.preventDefault();
    event.cancelBubble = true;
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Add report',
          handler: () => {
            this.go_to_reports(cl);
          }
        },
        {
          text: 'Edit',
          //icon: 'ios-create',
          handler: () => {
            this.edit(cl);
          }
        }, {
          text: 'Duplicate',
          //icon: 'ios-copy',
          handler: () => {
            this.duplicate(cl);
          }
        },
        {
          text: 'Validate',
          //icon: 'checkmark-circle',
          handler: () => {
            this.validate(cl);
          }
        }
        , {
          text: 'Delete',
          role: 'ios-destructive',
          //icon: 'trash',
          handler: () => {
            this.remove(cl, event);
          }
        }, {
          text: 'Cancel',
          //icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    actionSheet.data.buttons.splice(3, 1);
    if (this.licences.type != 'PRO') {
      actionSheet.data.buttons.splice(2, 1);
    }
    await actionSheet.present();
  }

  duplicate(c: TbiComponent) {
    var component = new TbiComponent(c.project, c);
    component.id = Math.random().toString().substr(2);
    component.validationReport = null;
    component.fields.location += ' Copy';
    component.date = new Date();
    this.project.components.push(component);
    this.service.save(this.project).then(p => {
      this.navCtrl.setRoot(SummaryPage, { project: this.project });
    })
  }

  validate(c: TbiComponent) {
    var component = new TbiComponent(c.project, c);
    component.id = '';
    component.date = new Date();
    component.validation = c.id;
    component.result = null;
    let report = new ReportBase(component.project, component, c.reports.find(r => r.energy))
    report.result = null;
    component.reports = [report];
    component.fields = new Fields({
      unknow_surface_temp: 0,
      location: component.fields.location,
      operational_time: component.fields.operational_time,
      number: c.fields.number,
      length: component.fields.length,
      surface: report.name == "Uninsulated Surface" ? component.fields.surface : null
    });

    this.open(report, null, c.result);
  }

  protected remove(cl: TbiComponent, event: Event) {
    event.preventDefault();
    event.cancelBubble = true;

    let confirm = this.alertCtrl.create({
      //title: `Remove`,
      message: `Do you agree to remove permanently '${cl.fields.location}' component?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.components = this.components.filter(c => c !== cl);
            this.project.components = this.project.components.filter(c => c !== cl);
            this.service.save(this.project).then(() => this.navCtrl.setRoot(SummaryPage, { project: this.project }));
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    confirm.present();
  }

  private hide_svg(pdf: any): Promise<any> {
    return new Promise<any>(resolve => {
      document.querySelector(".result-chart").className = 'result-chart zoom-normal';
      pdf.element.nativeElement.className = 'print';
      resolve(true);
    })
  }

  private show_svg(pdf: any, restore: any): Promise<any> {
    return new Promise<any>(resolve => {
      document.querySelector(".result-chart").className = 'result-chart';
      pdf.element.nativeElement.className = '';
      resolve(true);
    });

  }

  public export_new_pdf(showComponent: boolean) {
    this.navCtrl.push(SummaryReportPage, { project: this.project, showComponent: showComponent }, { animate: false });
  }

  public export_pdf() {
    this.creating_pdf = true;
    setTimeout(() => {
      this.hide_svg(this.pdf).then(restores => {
        this.pdf.export().then((g: Group) => {
          exportPDF(g).then(data => {
            this.file.create_pdf(data, `TBI-${this.project.name}`.replace(/ /g, '_')).then(r => {
              this.show_svg(this.pdf, restores).then(() => {
                this.creating_pdf = false;
                this.opener.open(r, 'application/pdf')
                  .catch(ex => this.message.alert('Error', `${r}\n${JSON.stringify(ex)}`));
              });
            })
          })
        })
      });
    }, 500)
  }

  public open(report: ReportBase, event: Event, result?: Result) {
    if (event) event.cancelBubble = true;
    (new ReportRouter(report.component.project, report.component, this.navCtrl)).navigate_to_report(report.path, report.summary_id, report, null, result);
  }

  public edit_validation(cl: TbiComponent): SummaryPage {
    return this.edit(Object.assign(cl.validationReport, { project: cl.project }) as TbiComponent, cl.result);
  }
  protected edit(cl: TbiComponent, result?: Result): SummaryPage {
    if (!!cl.validationReport) return
    if (cl.reports.length == 1) {
      (new ReportRouter(cl.project, cl, this.navCtrl)).navigate_to_report(cl.reports[0].path, cl.reports[0].summary_id, cl.reports[0], null, result);
      return this;
    }
    const modal = this.modalCtrl.create(SummaryEditPage,
      {
        tbi_component: cl
      },
      {
        cssClass: "modal-window-summary",
        showBackdrop: true,
        enableBackdropDismiss: false

      });
    modal.onDidDismiss(v => {
      if (!v) return this;
      const report = cl.reports.find(r => r.id == v);
      (new ReportRouter(cl.project, cl, this.navCtrl)).navigate_to_report(report.path, report.summary_id, report);
    });
    modal.present();
    return this;
  }

  async next_action() {
    event.preventDefault();
    event.cancelBubble = true;
    let user = !!this.navParams.data.parent && this.navParams.data.parent.hasOwnProperty('report') ? localStorage.getItem('tbi-user') : '';
    let actionSheet = this.licences.type != 'PRO'
      ? this.create_action_sheet_basic(user)
      : this.create_action_sheet(user);

    await actionSheet.present();
  }

  create_action_sheet(user: string = '') {
    let action_sheet = this.actionSheetCtrl.create({
      title: !!user ? `The component ${this.navParams.data.report.component.fields.location} has been saved by ${user}` : null,
      subTitle: 'What do you want to do next?',
      buttons: [
        {
          text: 'Continue',
          //icon: 'add-circle',
          handler: () => {
            this.go_to_reports(null);
          }
        },
        {
          text: 'Change project',
          //icon: 'checkmark-circle',
          handler: () => {
            this.navCtrl.setRoot(ProjectsPage);
          }
        },
        {
          text: 'New project',
          //icon: 'checkmark-circle',
          handler: () => {
            this.navCtrl.push(EditProjectPage, {
              project: new Project(),
              parent: SummaryPage
            });
          }
        },
        {
          text: 'Change user',
          //icon: 'person',
          handler: () => {
            this.navCtrl.setRoot(InitPage);
          }
        },
        {
          text: 'Cancel',
          //icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    return action_sheet;
  }

  create_action_sheet_basic(user: string) {
    let action_sheet = this.actionSheetCtrl.create({
      title: 'What do you want to do next?',
      cssClass: 'basic_sheet',
      buttons: [
        {
          text: 'Delete & New Component',
          //icon: 'add-circle',
          handler: () => {
            this.project.components = [];
            this.go_to_reports(null);
          }
        },
        {
          text: 'Edit project',
          //icon: 'create',
          handler: () => {
            this.navCtrl.push(EditProjectPage, {
              project: this.project,
              parent: this
            });
          }
        },
        {
          text: 'Get Pro-license key',
          //icon: 'open',
          handler: () => {
            this.licences.requestProKey();
          }
        },
        {
          text: 'Insert Pro-license key',
          //icon: 'information-circle',
          handler: () => {
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
                  role: 'cancel'
                },
                {
                  text: 'Validate',
                  role: 'submit',
                  handler: (data) => {
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
                              this.navCtrl.setRoot(ProjectsPage, { animate: true, direction: 'backward' })
                            }
                          }
                        }]
                      }).present();
                    })
                  }
                }]
            }).present()
          }
        },
        {
          text: 'Cancel',
          //icon: 'close',
          role: 'cancel'
        }]
    });
    return action_sheet;
  }

  showDisclaimer() {
    this.navCtrl.push(DisclaimerPage)

  }

  // private pages = {
  //   table: () => Math.ceil(this.components.length / 7),
  //   chart: () => (this.components.some(c => c.reports.some(r => r.energy)) ? 1 : 0)
  // }

  ionViewDidLoad() {
    this.licences.setLogo();
  }

  public canPdf: boolean = false;
  public canPdfEnergy: boolean = false;

  ngOnInit(): void {
    this.service.get(this.navParams.data.project.id).then(p => {
      this.project = p;
      this.has_people = p.has_people;
      this.get_project();
      this.get_report();

      this.content.scrollToTop(500);
      this.cdRef.detectChanges();

      this.reports = ([].concat(...[].concat([...this.components.map(c => c.reports)])));
      this.canPdf = !!this.reports.length;
      this.canPdfEnergy = !!this.reports.filter(r => r.energy).length;
    });
  }

  getReportPageNumber(report: ReportBase, pictureIndex?: number): number {
    return this.reports.indexOf(report) + 1;
  }
  get_report(): void {
    this.report = new ReportBase(this.project, this.components[0], null)
    this.report.result = this.totals;
  }

  get_project(): void {
    this.totals.headLost.power = 0;
    this.totals.headLost.money = 0;
    this.totals.savingPotentialMin.power = 0;
    this.totals.savingPotentialMin.money = 0;
    this.totals.savingPotentialMax.power = 0;
    this.totals.savingPotentialMax.money = 0;
    this.totals.co2 = [0, 0, 0];

    this.components = (this.project.components || []).filter(c => !c.validation).sort((a, b) => a.date > b.date ? 1 : -1);

    this.components.filter(c => !!c.result && !c.fields.unknow_surface)
      .map(c => c.result)
      .forEach(r => {
        this.totals.headLost.power += r.headLost.power;
        this.totals.headLost.money += r.headLost.money;
        this.totals.savingPotentialMin.power += r.savingPotentialMin.power;
        this.totals.savingPotentialMin.money += r.savingPotentialMin.money;
        this.totals.savingPotentialMax.power += r.savingPotentialMax.power;
        this.totals.savingPotentialMax.money += r.savingPotentialMax.money;
        this.totals.co2[0] += r.co2[0];
        this.totals.co2[1] += r.co2[1];
        this.totals.co2[2] += r.co2[2];
      });
  }

  down(value: number): number {
    return value > 1000 ? Math.floor(Math.trunc(value) / 100) * 100 : Math.floor(Math.trunc(value) / 10) * 10;
  }

  up(value: number): number {
    return value > 1000 ? Math.ceil(Math.trunc(value) / 100) * 100 : Math.ceil(Math.trunc(value) / 10) * 10;
  }
}
