import { Injectable } from "@angular/core";
import { Http, Headers, ResponseOptions } from "@angular/http";
import { Project } from "../models";
import { IMAGES } from "../const/images";
import * as moment from 'moment';
import { UniqueDeviceID } from "@ionic-native/unique-device-id";
import { FileService } from "./file.service";
import { FileLocalService } from "./file-local.service";

@Injectable()
export class LicencesService {

  public static CODE: string = "JMCiwuT532";
  public lock: boolean = false;
  private _projects: Project[] = [];

  async validate(code: string): Promise<{ ok: boolean; message: string }> {
    let result = await this.getRemoteCode(code);
    return new Promise<{ ok: boolean; message: string }>(resolve => {
      if (!!result && result.error_code == 0) {
        resolve({ ok: true, message: `TBI-App licence is valid for ${this.remaining()} days.` });
      } else {
        resolve({ ok: false, message: result.message });
      }
    });
  }

  setLogo() {
    return null;
    // if(!!this.getData()){
    //   setTimeout(()=>document.getElementsByClassName('toolbar-background')[0]['style'].backgroundImage = `url(${this.getData().url_logo})`, 500);
    // }
  }

  public get type(): string {
    const type = (this.getData().easy || this.remaining() < 0) ? 'BASIC' : 'PRO';
    return type;
  }

  public set projects(projects: Project[]) {
    this.lock =
      this.type == "BASIC" &&
      this.projects.reduce((a, p) => a.concat(p.components), []).length >= 1;
    this._projects = projects;
  }

  public get projects(): Project[] {
    return this._projects;
  }

  reset() {
    localStorage.removeItem('tbi-licence-data');
    //localStorage.setItem('tbi-licence-data', JSON.stringify(this.getData()))
  }
  getData(): { name: string, mail: string, url: string, url_logo: string, phone_number: string, first_activation_data: Date, easy: boolean } {
    let data = JSON.parse(localStorage.getItem('tbi-licence-data') || '{}');
    return (!data.hasOwnProperty('easy'))
      ? {
        name: 'TIPCHECK department EiiF',
        mail: 'tbicheck@eiif.org',
        url: 'www.eiif.org',
        url_logo: IMAGES.LOGO,
        phone_number: '+41 22 99 500 70',
        easy: true,
        first_activation_data: moment(new Date())
      }
      : (data);
  }

  public remaining(): number {
    return moment(moment(this.getData().first_activation_data)).add('years', 1).diff(new Date(), 'days') - 1;
  }
  public async getRemoteCode(code: string): Promise<any> {
    var headers = new Headers();
    headers.append("Accept", 'application/x-www-form-urlencoded');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //headers.append('Access-Control-Allow-Origin', '*');
    const options = new ResponseOptions({ headers: headers });

    let body = new URLSearchParams();
    body.set('code', code);
    body.set('license_type', '1');
    body.set('device_id', await this.getDeviceId());
    return new Promise<any>(resolve => {
      this.http
        .post("https://www.eiif.testengineonline.com/tbi-app/validate-code", body.toString(), options)
        .toPromise()
        .then((r: any) => {
          let data = JSON.parse(r._body).response_data;
          ['name', 'mail', 'url', 'url_logo', 'phone_number'].forEach(p => data.data[p] = data.data[p] || this.getData()[p]);
          data.data.easy = false;
          localStorage.setItem('tbi-licence-data', JSON.stringify(data.data));
          resolve(data)
        })
        .catch(() => resolve(this.onServerError()))
    });
  }

  onServerError() {
    if (this.file instanceof FileLocalService)
      return {
        ok: true,
        error_code: 0,
        message: 'OK from local'
      }
    return {
      ok: false,
      error_code: 500,
      message: 'There was a problem connecting to the validation procedure. Please try again later.'
    }
  }

  getDeviceId(): PromiseLike<string> {
    return new Promise<string>(resolve => {
      this.uniqueDeviceID.get()
        .then(uuid => resolve(uuid))
        .catch(err => resolve('6f3240eaac4fe87bf4d604278cea70ed90fc0734'))
    })
  }

  requestProKey() {
    window.open('https://www.eiif.org/tbi/get-tbi-app', '_system')
  }

  constructor(private http: Http, private uniqueDeviceID: UniqueDeviceID, private file: FileService) { }
}
