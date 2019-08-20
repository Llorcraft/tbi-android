import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, Keyboard, TextInput, Platform } from 'ionic-angular';
import { ProjectPageBase } from './project-page-base';
import { Project, Document } from '../../models';
import { ProjectService } from '../../services/project.service';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../services/messages.service';
import { FileService } from '../../services/file.service';
import { FileOpener } from '@ionic-native/file-opener';
import { PictureService } from '../../services';
import { More } from '../../const/more/more';
import { CalculatorFactory } from '../../models/calculators/calculator.factory';
import { ProjectsPage } from './projects';
import { IMAGES } from '../../const/images';

@Component({
  selector: 'page-edit-project',
  templateUrl: 'edit.html'
})
export class EditProjectPage extends ProjectPageBase {
  public project: Project;
  public segment: string = 'properties';
  public edit_mode = false;
  public error: string = '';
  public pictures = IMAGES
  private initial_values: { price: number, price_delta: number } = {
    price: 0,
    price_delta: 1
  }
  @ViewChild('form') form: NgForm;
  public edit_co2: boolean = false;
  @ViewChild('co2_input') co2_input;
  public more = More;
  public show_segment = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public service: ProjectService,
    private file: FileService,
    public actionSheetCtrl: ActionSheetController,
    private picture: PictureService,
    private message: MessageService,
    protected keyboard: Keyboard,
    private platform: Platform,
    private opener: FileOpener) {

    super(alertCtrl, service, keyboard);
    this.offset = 120;
    this.show_segment = !this.platform.is('ios');
    this.project = navParams.get("project");

    this.initial_values.price = this.project.price;
    this.initial_values.price_delta = this.project.price_delta

    this.edit_mode = false;
    this.change_measures_more();
    //this.project.documents.push(new Document({ file: 'lolo.pdf' }))
    //this.keyboard.onClose(() => document.querySelectorAll('.scroll-content').forEach((x) => x.scrollTo(0, 0)));
  }

  scroll(elm: any, top: number) {
    setTimeout(() => elm.scrollIntoView({ behavior: "smooth" }), 500);
  }

  onBackClick() {
    if(this.segment == 'properties')
      this.after_delete();
    else 
    this.segment = 'properties';
  }
  get energy_validation(): number {
    return !!this.form && this.form.submitted && (null == this.form.controls.price.value || isNaN(this.form.controls.price.value) || Number(this.form.controls.price.value.toString()) <= 0) ? null : 1;
  }
  get co2_validation(): number {
    return !!this.form && this.form.submitted && (null == this.form.controls.co2.value || isNaN(this.form.controls.co2.value) || Number(this.form.controls.co2.value.toString()) <= 0) ? null : 1;
  }
  get currency_validation(): number {
    return !!this.form && this.form.submitted && (null == this.form.controls.currency.value || !this.form.controls.currency.value.length) ? null : 1;
  }
  get showError() {
    return {
      required_name: !!this.form && this.form.submitted && this.form.controls.name.invalid,
      energy_validation: !!this.form && this.form.submitted && this.form.controls.energy_validation.invalid,
      co2_validation: !!this.form && this.form.submitted && this.form.controls.co2_validation.invalid,
      required_currency: !!this.form && this.form.submitted && this.form.controls.currency_validation.invalid
    }
  }

  change_measures_more() {
    More.MEASURES.forEach(m => {
      const split = (m[0] as string).split("/");
      m[0] = `${this.project.currency}/${split[split.length - 1]}`
    })
  }

  protected hide_keyboard() {
    this.keyboard.close();
  }

  public save(): void {
    setTimeout(() => {
      if (!this.form.valid) {
        this.scrollTo(0);
        return;
      }
      // if (this.project.price != this.initial_values.price || this.project.price_delta != this.initial_values.price_delta) {
      // this.project.components.forEach(c => {
      //   c.reports.forEach(r => (new CalculatorFactory()).calculate(new ReportBase(this.project, c, r)));
      // });
      // }
      this.service.save(this.project, false).then(() => {
        this.project.components.forEach(c => {
          c.result = null;
          c.reports = [
            ...c.reports.filter(r => !r.result),
            ...c.reports.filter(r => !!r.result).map(r => (new CalculatorFactory()).calculate(r, null))
          ];
        });
        this.service.save(this.project, true).then(() => {
          //this.navCtrl.setRoot(this.navParams.data.parent, { project: this.project}, {animate: true, direction: 'forward'});
          this.navCtrl.setRoot(ProjectsPage, {}, { animate: true, direction: 'forward' });
        });
      });
    }, 500);
  }

  private delete_file(file: Document): void {
    this.project.documents = this.project.documents.filter(f => f != file);
    this.file.delete(file);
    this.edit_mode = !!this.project.documents.length
  }

  private open_camera() {
    this.picture.take_picture()
      .then(d => this.project.picture = d)
  }

  private open_gallery() {
    this.picture.get_picture()
      .then(d => this.project.picture = d)
      .catch(ex => {
        this.message.alert('Error take picture', JSON.stringify(ex, null, 2));
      });
  }

  public ask_for_change_picture(project: Project) {
    let action_sheet = this.actionSheetCtrl.create({
      cssClass: 'picture-action-sheet',
      buttons: [
        {
          text: 'Take picture',
          //icon: 'camera',
          handler: () => {
            this.open_camera();
          }
        },
        {
          text: 'From gallery',
          //icon: 'images',
          handler: () => {
            this.open_gallery();
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          //icon: 'trash',
          cssClass: 'disable',
          handler: () => {
            project.picture = '';
          }
        }
        , {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    action_sheet.present();
  }

  public open_file(file: Document): void {
    this.opener.open(`${file.folder}/${file.file}`, file.mime)
      .then(() => console.log('File opened'))
      .catch(err => this.message.alert('Open', `${err.message}\n${file.folder}/${file.file}`));
  }

  choose_file() {
    this.file.select_file().then(d => {
      this.project.documents.push(d)
    });
  }

  ask_for_delete(file: Document): void {
    this.remove_mode = true;
    let confirm = this.alertCtrl.create({
      //title: `Remove`,
      message: `Do you agree to remove '${file.file}'?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.delete_file(file);
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

  after_delete(): void {
    this.service.get(this.project.id).then(p => {
      p => this.project;
      this.navCtrl.pop();
    });
  }

  get free_currency(): boolean {
    let free = !this.more.CURRENCIES.find(c => c[1] == this.project.currency && this.project.currency!="")
    return free;
  }
  set_measure(measure: { index?: number, value: number }) {
    this.project.price_delta = measure.value;
  }

  set_currency(currency: { value?: string, index: number }, focused: TextInput) {
    this.project.currency = currency.value;
    this.project.currency_index = currency.index;
    if (!currency.index) setTimeout(() => focused.setFocus(), 750);
  }

  set_co2(co2: { value?: number, index: number }, focused: TextInput) {
    this.project.co2 = co2.value;
    this.project.co2_index = co2.index;
    if (!co2.index) setTimeout(() => focused.setFocus(), 750);
  }
  edit() {
    this.edit_mode = true;
  }

  public friendy_more(type: string, index: number) {
    let _more = More[type].find(m => m[2] == index);
    return _more[0];
  }
}
