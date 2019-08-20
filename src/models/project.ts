import { ReportBase } from '.';
import { Document } from './';
import { TbiComponent } from './component';
import { ModelWithPicture } from './model-with-picture';
import { More } from '../const/more/more';

export class People {
  public leader: Contact = new Contact();
  public energy_manager: Contact = new Contact();
  public maintenance_manager: Contact = new Contact();
  public hse_manager: Contact = new Contact();

  constructor(people?: Partial<People>) {
    if (!people) return;
    Object.assign(this, people);
  }
}

export class Contact {
  public name: string = '';
  public email: string = '';
  public phone: string = '';

  constructor(contact?: Partial<Contact>) {
    if (!contact) return;
    Object.assign(this, contact);
  }
}

export class Project extends ModelWithPicture {
  public name: string = '';
  public desc: string = '';
  public date: Date = new Date();
  public user: string = '';
  public documents: Document[] = [];
  public components: TbiComponent[] = [];
  public price?: number = null;
  public price_delta: number = 1;
  public people: People = new People();
  public co2?: number = null;
  public currency: string = "€"
  public currency_index: number = 1;
  public co2_index: number = 0;
  public selected = false;

  constructor(project?: Partial<Project>) {
    super(project);
    if (!project) return;
    this.name = project.name || '';
    this.desc = project.desc || '';
    this.date = project.date || new Date();
    this.user = project.user || '';
    this.currency = project.currency || "€";
    this.price = Number(project.price) || null;
    this.price_delta = Number(project.price_delta) || 1;
    this.documents = (project.documents || []).map(d => new Document(d));
    this.components = (project.components || []).map(c => new TbiComponent(this, c, project.components.find(p => p.validation == c.id)));
    this.people = new People(project.people);
    this.co2 = project.co2;
    this.currency_index = project.currency_index || 1;
    this.co2_index = project.co2_index || 0;
  }

  public get measure(): string {
    return this.price_delta == 1 ? "kWh" : "GJ";
  }

  public get has_people(): boolean{
    return !!this.people.leader.name 
        || !!this.people.energy_manager.name 
        || !!this.people.maintenance_manager.name 
        || !!this.people.hse_manager.name;
  }

  public get m_measure(): string {
    return this.price_delta == 1 || 1==1 ? "kWh" : "GJ";
  }

  public get s_measure(): string {
    return "MWh";
  }

  public get price_measure(): string {
    //return `${this.currency}/${String(More.MEASURES.find(m => m[1] == this.price_delta)[0])}`;
    return More.MEASURES.find(m => m[1] == this.price_delta)[0] as string;
  }

  private flatten(arr: any[]): any[] {
    return [].concat.apply([], arr);
  }

  public get_reports_by_type(type: string): ReportBase[] {
    const reports = this.components.map(c => c.reports.filter(r => !!r.readonly_summary_id.match(new RegExp(type, 'gi'))));
    return this.flatten(reports);
  }


  public get_reports_by_types(types: string[]): ReportBase[] {
    let result: ReportBase[] = []
    types.forEach(type => {
      let filter = this.components.map(c => c.reports.filter(r => !!r.readonly_summary_id.match(new RegExp(type, 'gi'))));
      this.flatten(filter).forEach(r => result.push(r));
    })
    return result;
  }
}
