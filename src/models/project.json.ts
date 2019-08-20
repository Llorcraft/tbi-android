import { ReportBase, Project } from '.';
import { Document } from './';
import { People } from './project';
import { TbiComponentJson } from './component.json';


export class ProjectJson {
  public id: string = '';
  public name: string = '';
  public desc: string = '';
  public date: Date = new Date();
  public user: string = '';
  public picture: string = '';
  public documents: Document[] = [];
  public components: TbiComponentJson[] = [];
  public price?: number = null;
  public price_delta: number = 1;
  public people: People = new People();
  public co2?: number;
  public currency: string = "€"
  public currency_index: number = 1;
  public co2_index: number = 0;

  constructor(project: Partial<Project>) {
    this.id = project.id;
    this.name = project.name;
    this.desc = project.desc;
    this.date = project.date;
    this.user = project.user;
    this.price = project.price;
    this.currency = project.currency || "€";
    this.price_delta = project.price_delta;
    this.picture = project.picture;
    this.components = project.components.map(c => new TbiComponentJson(c));
    this.documents = project.documents || [];
    this.people = new People(project.people);
    this.co2 = project.co2;
    this.currency_index = project.currency_index || 1;
    this.co2_index = project.co2_index || 0;
  }

  private flatten(arr: any[]): any[] {
    return [].concat.apply([], arr);
  }

  public get_reports_by_type(type: string): ReportBase[] {
    const reports = this.components.map(c => c.reports.filter(r => !!r.path.match(new RegExp(type, 'gi'))));
    return this.flatten(reports);
  }
}
