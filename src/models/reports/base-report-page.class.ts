import { NavController, AlertController, Keyboard, Content, ModalController, NavParams } from "ionic-angular";
import { NgForm } from "@angular/forms";
import { ViewChild, OnInit, AfterViewInit, ElementRef } from "@angular/core";
import { ReportBase, Project } from "..";
import { CalculatorFactory } from "../calculators/calculator.factory";
import { Picture } from "../picture";
import {
  ReportErrorsComponent, ReportsPage, ReportMoreButtonComponent, KnownTempPage
} from "../../pages/reports";
import { ReportService } from "../../services/report.service";
import { More } from "../../const/more/more";
import { TbiComponent } from "../component";
import { MessageService } from "../../services/messages.service";
import { ScrollToComponent } from "../../pages/scroll_to_component.class";
import { NON_PICTURE, IMAGES } from "../../const/images";
import { PictureService, FileService } from "../../services";
import { Patterns } from "../../const/patterns";
import { SummaryPage } from "../../pages/summary/summary";
import { FileOpener } from "@ionic-native/file-opener";
import { ReportPdfPage } from "../../pages/reports/pdf/report-pdf.component";
import { Result } from "../result";

export class BaseReportPage extends ScrollToComponent
  implements OnInit, AfterViewInit {
  @ViewChild("form") form: NgForm;
  @ViewChild("errors") errors: ReportErrorsComponent;
  //Focus input after option select
  @ViewChild("after_time") after_time;
  @ViewChild("ambient_temp") ambient_temp;
  @ViewChild("before_time") before_time;
  @ViewChild("after_material") after_material;
  @ViewChild("before_material") before_material;

  @ViewChild("time", { read: ReportMoreButtonComponent })
  time: ReportMoreButtonComponent;
  @ViewChild("material", { read: ReportMoreButtonComponent })
  material: ReportMoreButtonComponent;
  @ViewChild("surface_material") surface_material;
  @ViewChild(Content) content: Content;
  @ViewChild("resultGrid") resultGrid: ElementRef;
  public can_remove: boolean = false;
  public unknow_surface: boolean = false;
  public calculator = new CalculatorFactory();
  public edit_surface_material = false;
  public view: string = "form";
  public is_energy_report: boolean;
  protected editing_picture: Picture = new Picture();
  protected segment = "input";
  public patterns: any = Patterns;
  public more = More;
  public images = IMAGES;

  private _original_component: TbiComponent;
  public editable: boolean = false;

  get show_pdf_button(): boolean {
    //console.log(this.view != 'edit_picture', !!this.report.result.headLost || !this.report.energy), !this.form.invalid);
    return this.view != 'edit_picture'
      && !this.form.invalid
      && (!this.report.energy || (!!this.report.result && !!this.report.result.headLost.power));
  }

  //#region Custom Validations
  public get picture_qty(): number {
    return !!this.report.pictures.length ? this.report.pictures.length : null;
    //return 1;
  }
  public get surface_required(): number {
    let c = this.report.component.fields;
    return !c.unknow_surface && (Number(c.surface) == 0) ? null : 1;
  }
  public get compare_insulated_temp(): number {
    let c = this.report.component.fields;
    return !c ||
      (c.surface_temp == null || c.surface_temp.toString() == "") ||
      (c.medium_temp == null || c.medium_temp.toString() == "") ||
      (c.ambient_temp == null || c.ambient_temp.toString() == "")
      ? 1
      : Number(c.surface_temp) < Number(c.medium_temp) &&
        Number(c.surface_temp) < Number(c.ambient_temp)
        ? null
        : 1;
  }

  public validateGeneric(): ReportBase {
    this.start_changes_observer();
    if (!this.form.invalid) {
      this.save();
    } else {
      this.view = 'form';
      setTimeout(() => this.scrollToBottom(0), 100);
    }
    return null;
  }

  public get surface_temp_abs(): number {
    let c = this.report.component.fields;
    return !c ||
      (c.medium_temp == null ||
        c.medium_temp.toString() == "" ||
        c.unknow_surface) ||
      (c.surface_temp == null || c.surface_temp.toString() == "")
      ? 1
      : Math.abs(Number(c.medium_temp) - Number(c.surface_temp)) < 15
        ? null
        : 1;
  }
  public get surface_material_range(): number {
    let c = this.report.component.fields;
    return !c ||
      (c.surface_material == null || c.surface_material.toString() == "")
      ? 1
      : Number(c.surface_material) < 0 || Number(c.surface_material) > 1
        ? null
        : 1;
  }
  public get operational_time_range(): number {
    let c = this.report.component.fields;
    return !c ||
      (c.operational_time == null || c.operational_time.toString() == "")
      ? 1
      : Number(c.operational_time) < 0 || Number(c.operational_time) > 8760
        ? null
        : 1;
  }
  public get temp_range_diff(): number {
    let c = this.report.component.fields;
    return !c ||
      (c.ambient_temp == null || c.ambient_temp.toString() == "") ||
      (c.surface_temp == null || c.surface_temp.toString() == "")
      ? 1
      : Math.abs(Number(c.surface_temp) - Number(c.ambient_temp)) < 5
        ? null
        : 1;
  }
  public get diameter_low(): number {
    let c = this.report.component.fields;
    return !c ||
      (c.nominal_diameter == null || c.nominal_diameter.toString() == "")
      ? 1
      : Number(c.nominal_diameter) <= 0
        ? null
        : 1;
  }
  public get length_low(): number {
    let c = this.report.component.fields;
    return !c || (c.length == null || c.length.toString() == "")
      ? 1
      : Number(c.length) <= 0
        ? null
        : 1;
  }
  public get items_low(): number {
    let c = this.report.component.fields;
    return !c || (c.number == null || c.number.toString() == "")
      ? 1
      : Number(c.number) <= 0
        ? null
        : 1;
  }
  public get surface_low(): number {
    let c = this.report.component.fields;
    return !c ||
      (c.surface == null || c.surface.toString() == "" || c.unknow_surface)
      ? 1
      : Number(c.surface) <= 0
        ? null
        : 1;
  }
  public get surface_temp_range(): number {
    let c = this.report.component.fields;
    return !c || (c.surface_temp == null || c.surface_temp.toString() == "")
      ? 1
      : Number(c.surface_temp) >= 1000
        ? null
        : 1;
  }
  //#endregion
  constructor(
    public report: ReportBase,
    protected navParam: NavParams,
    protected navCtrl: NavController,
    protected service: ReportService,
    protected alertCtrl: AlertController,
    protected picture: PictureService,
    protected message: MessageService,
    protected keyboard: Keyboard,
    protected file: FileService,
    protected opener: FileOpener,
    public modalCtrl?: ModalController
  ) {
    super(keyboard);
    this._original_component = this.report.component;
    this.report.component = new TbiComponent(
      this._original_component.project,
      this._original_component
    );
    this.report.component.id = this._original_component.id;
    //this.can_remove = !!this.report.id && 1 == 2;
    this.editable = !this.report.component.reports.filter(
      r => !!r.path.match(/(surface|pipe|valve|flange)/gi) && !!r.result
    ).length;
    this.is_energy_report = !!this.report.path.match(
      /(pipe|surface|valve|flange)/gi
    );

    //TODO: Quitar agregar imagen
    // this.report.pictures.push(new Picture({
    //   picture: "data:image/jpeg;base64,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"
    // }))
  }

  ngAfterViewInit() {
    //const wait: number = 1000;
    // if (!!this.time && !!this.after_time) {
    //   this.time.change.subscribe(v => {
    //     setTimeout(() => this.after_time.setFocus(), wait);
    //   })
    // }
    // if (!!this.material) {
    //   this.material.change.subscribe(v => {
    //     setTimeout(() => this.after_material.setFocus(), wait);
    //   })
    // }
  }

  ngOnInit(): void {
    if (
      !!this.report.result.headLost.power &&
      !!this.report.id &&
      !!this.report.path.match(/(pipe|surface|valve|flange)/gi)
    )
      setTimeout(() => this.calculate(), 250);
  }

  remove_report() { }

  public get first_picture(): string {
    return this.report.pictures.length
      ? this.report.pictures[0].picture
      : NON_PICTURE;
  }

  protected set_length(message: string, default_value: number) {
    let alert = this.alertCtrl.create({
      cssClass: "ion-dialog-horizontal margin-top",
      message: `Equivalent length<br><small>${message}</small>`,
      inputs: [
        {
          name: "length",
          placeholder: "m",
          type: "number",
          value:
            null != this.report.component.fields.length
              ? this.report.component.fields.length.toString()
              : default_value.toString()
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Report",
          cssClass: "royal",
          handler: data => {
            this.report.component.fields.length =
              "" != data.length ? parseFloat(data.length) : default_value;
          }
        }
      ]
    });
    alert.present();
  }

  public toggle_surface_material(value: boolean) {
    //if (!this.editable) return;
    this.edit_surface_material = value;
    value &&
      setTimeout(() => {
        this.surface_material.setFocus();
      }, 150);
  }

  protected start_changes_observer(): void {
    this.errors.form = this.form;
    this.errors.on_change.subscribe((form: NgForm) => {
      this.view = "form";
      this.report.result = null;
    });
  }

  public export_pdf(n) {
    this.navCtrl.push(ReportPdfPage, { report: this.report, parent: this }, { animate: false });
  }

  protected save() {
    if (!!this.form.invalid) return this.scrollToBottom(10);
    const project = this.report.component.project;
    if (this.report.is('maintenance')) {
      this.report.result = this.report.result || new Result();
      this.report.result.advise = 'Maintenance';
    }
    if (!this.report.component.reports.find(c => c.id === this.report.id))
      this.report.component.reports.push(this.report);
    if (!project.components.find(c => c.id === this.report.component.id))
      project.components.push(this.report.component);

    //this.confirm_space().then(space => {
    //this.report.component.fields.space_warning = space;
    this.service.save(this.report).then(p => {
      this.navCtrl.setRoot(
        SummaryPage,
        { project: p, summary: true, parent: this, report: this.report },
        { animate: true, direction: "backward" }
      );
    });
    //});
    //this.ask_for_more_reports(project);
    //this.navCtrl.push(ProjectPage, { project: project });
  }

  protected ask_for_more_reports(project: Project) {
    let confirm = this.alertCtrl.create({
      //title: `Create report`,
      cssClass: `ion-dialog-horizontal`,
      message: `Do you want to add another report associated to this component?`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "No",
          handler: () => {
            this.navCtrl.push(ReportsPage, {
              project: project,
              message: `“${
                this.report.component.fields.location
                }” has been saved. You are going to start reports on a new component.`
            });
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Yes",
          handler: () => {
            this.navCtrl.push(ReportsPage, {
              component: this.report.component,
              report: this.report,
              project: project
            });
          }
        }
      ]
    });
    confirm.present();
  }

  protected get has_results(): boolean {
    return !this.form.invalid && this.report.result !== null;
  }

  protected go_back(): BaseReportPage {
    if (this.view === "edit_picture") {
      //(document.getElementsByTagName('ion-buttons')[0] as any).style.display = 'initial';
      this.view = "form";
    } else {
      if (this.form.dirty || !this.form.pristine) {
        let confirm = this.alertCtrl.create({
          //title: `Leave report`,
          cssClass: `ion-dialog-horizontal`,
          message: `Do you want to leave this report?`,
          enableBackdropDismiss: false,
          buttons: [
            {
              text: "Yes",
              handler: () => {
                this.report.component = this._original_component;
                this.navCtrl.pop();
              }
            },
            {
              text: "No",
              role: "cancel"
            }
          ]
        });
        confirm.present();
      } else {
        this.report.component = this._original_component;
        this.navCtrl.pop();
      }
    }
    return this;
  }

  public reset_result(): void {
    this.report.result = new Result();
    this.report.component.result = new Result;
    setTimeout(() => this.view = 'form', 150);
  }

  protected calculate() {
    // const _elm = document.getElementById('result-grid');
    // _elm.closest('.scroll-content').scrollTo(0, _elm.closest('.scroll-content').scrollTop - 150);

    this.start_changes_observer();
    this.errors.page = this;
    if (!this.form.invalid) {
      this.view = "result";
      this.report = this.calculator.calculate(
        this.report,
        this.navParam.data.result
      );


      setTimeout(() => {
        this.scrollToBottom(0).then(() => {
          //document.getElementsByClassName('scroll-content')[2].scrollTop += 38;
          Array.from(document.getElementsByClassName('scroll-content')).reverse()[0].scrollTop += 38;
        });
      }, 150);
      return this.report;
    } else {
      this.view = "form";
    }
    //setTimeout(() => this.content.scrollTo(0, 2000, 1500), 150);
    setTimeout(() => this.scrollToBottom(0), 500);
  }

  private remove_picture(include_markers: boolean) {
    //He comentado lo de eliminar fisicamente el archivo
    //porque si no guarda los cambios, el usuario,
    //ya se habrá perdido el archivo.
    //this.picture.delete_picture(this.editing_picture).then(picture => {
    if (!include_markers) {
      this.report.component.markers = (
        this.report.component.markers || []
      ).concat(this.editing_picture.markers);
    }
    this.report.pictures = this.report.pictures.filter(
      p => p.picture != this.editing_picture.picture
    );
    this.view = "form";
    this.editing_picture = null;
    //});
  }

  protected delete_picture() {
    const _message = this.editing_picture.has_markers
      ? "Do you want to remove this pictures and its measurements"
      : "Do you want to remove this picture?";
    const _buttons: any = !this.editing_picture.has_markers
      ? [
        { text: "Yes", handler: () => this.remove_picture(false) },
        { text: "No", role: "cancel" }
      ]
      : [
        { text: "Yes", handler: () => this.remove_picture(true) },
        { text: "No", handler: () => this.remove_picture(false) },
        { text: "Cancel", role: "cancel" }
      ];
    let confirm = this.alertCtrl.create({
      message: _message,
      cssClass: `ion-dialog-horizontal`,
      enableBackdropDismiss: false,
      buttons: _buttons
    });
    confirm.present();
  }

  scrollToBottom(duration): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      setTimeout(
        () =>
          this.content.scrollToBottom(100).then(() => {
            // if (this.is_tablet && window.outerWidth > window.outerHeight)
            //   this.content.scrollTop -= 200;
            resolve(true);
          }),
        duration + 50
      );
    });
  }

  protected on_picture_start_edit(picture: Picture): void {
    //(document.getElementsByTagName('ion-buttons')[0] as any).style.display = 'none';
    this.editing_picture = picture;
    this.view = "edit_picture";
  }

  public alert(message: string) {
    let confirm = this.alertCtrl.create({
      //title: `Create report`,
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "Ok"
        }
      ]
    });
    confirm.present();
  }

  protected take_picture() {
    this.picture
      .take_picture()
      .then(d => {
        this.report.pictures.push(new Picture({ picture: d }));
      })
      .catch(ex =>
        this.message.alert("Error take picture", JSON.stringify(ex, null, 2))
      );
  }

  protected toggle_know() {
    if (!!this.report.component.fields.unknow_surface)
      this.report.component.fields.surface = null;
  }

  protected toggle_know_temp() {
    if (!!this.report.component.fields.unknow_surface_temp) {
      let known_temp = this.modalCtrl.create(
        KnownTempPage,
        { medium_temp: this.report.component.fields.surface_temp },
        {
          showBackdrop: true,
          enableBackdropDismiss: false,
          cssClass: "known-temp"
        }
      );
      known_temp.onDidDismiss(r => {
        if (!!r) {
          this.report.component.fields.surface_temp = Number(r.temp);
          this.report.component.fields.unknow_surface_temp = Number(r.gas);
          setTimeout(() => this.ambient_temp.setFocus(), 150);
        } else {
          this.report.component.fields.unknow_surface_temp = 0;
        }
      });
      known_temp.present();
    }
  }

  protected before_calculate(temp: number) {
    this.report.component.fields.surface_temp = temp;
  }
  private _average_temp?: number = null;
  protected set average_temp(value: number) {
    this._average_temp = value;
  }
  protected get average_temp(): number {
    if (!this.report.has_markers) {
      this._average_temp = null;
    }
    this._average_temp = this.report.surface_temp;
    return this._average_temp;
  }

  protected ask_calculate(): ReportBase {
    if (
      isNaN(this.report.component.fields.surface_temp) ||
      !this.report.has_markers
    )
      return this.calculate();
    let confirm = this.alertCtrl.create({
      //title: `Temperature`,
      message: `Which temperature would you like to use for calculation?`,
      cssClass: `ion-dialog-horizontal`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: `Average ${this.report.surface_temp}ºC`,
          handler: () =>
            this.before_calculate(
              (this.report.component.fields.surface_temp = this.report.surface_temp)
            )
        },
        {
          text: `Minimum ${this.report.min_temp}ºC`,
          handler: () =>
            this.before_calculate(
              (this.report.component.fields.surface_temp = this.report.min_temp)
            )
        },
        {
          text: `Maximum ${this.report.max_temp}ºC`,
          handler: () =>
            this.before_calculate(
              (this.report.component.fields.surface_temp = this.report.max_temp)
            )
        }
      ]
    });
    confirm.present();
  }

  public confirm_space(): Promise<boolean> {
    return !this.report.insulated || this.report.is_validation
      ? new Promise(resolve => {
        resolve(false);
      })
      : new Promise(resolve => {
        let confirm = this.alertCtrl.create({
          message: `Is there enough space to place the insulation?`,
          enableBackdropDismiss: false,
          buttons: [
            {
              text: "Yes",
              handler: () => resolve(false)
            },
            {
              text: "No",
              handler: () => resolve(true)
            }
          ]
        });
        confirm.present();
      });
  }

  public friendy_more(type: string, index: number) {
    let _more = More[type].find(m => m[2] == index);
    return _more[0];
  }

  public set_operational_time(more) {
    this.report.component.fields.operational_time = more.value;
    this.report.component.fields.operational_time_index = more.index;
    setTimeout(
      () => (more.index == 0 ? this.before_time : this.after_time).setFocus(),
      650
    );
  }

  public set_surface_material(more) {
    this.report.component.fields.surface_material = more.value;
    this.report.component.fields.surface_material_index = more.index;
    console.log(more);
    setTimeout(
      () =>
        (more.index == 0
          ? this.before_material
          : this.after_material
        ).setFocus(),
      650
    );
  }
}
