import { Project } from './project';
import { Result } from './result';
import { TbiComponent } from './component';
import { Picture } from './picture';
import { ICalculator } from './calculators/calculator.factory';

export class ReportBase {
  public id: string = '';
  public name: string = '';
  public path: string = '';
  public page: any = null;
  public user: string = '';
  public result: Result = null;
  public project: Project = null;
  public component?: TbiComponent = null;
  public pictures: Picture[] = [];
  public date: Date = new Date();
  public insulated: boolean = false;
  public summary_id: string = '';
  public readonly_summary_id: string = '';
  public comment: string = '';
  public fictisius = false

  public get has_contacts(): boolean {
    if(!this.component || !this.component.project) return false;
    return this.component.project.has_people
  }
  public get is_validation(): boolean {
    return !!this.component && !!this.component.validation;
  }
  public get potential_measure(): string {
    return 'kWh/a';
  }
  public is(pattern: string): boolean {
    return !!this.path.match(new RegExp(`(${pattern})`, 'gi'));
  }

  public get energy(): boolean {
    return !!this.path.match(/(surface|pipe|valve|flange)/gi);
  }
  public get has_markers(): boolean {
    const has_markers = !!this.pictures.filter(p => !!p.has_markers).length;
    return has_markers;
  }
  public get money_measure(): string {
    return '€/a';
  }
  public get min_temp(): number {
    return !this.has_markers ? 0 : this.pictures.filter(p => p.has_markers).map(m => m.min_temp).sort()[0];
  }
  public get max_temp(): number {
    return !this.has_markers ? 0 : this.pictures.filter(p => p.has_markers).map(m => m.max_temp).sort().reverse()[0];
  }
  public get surface_temp(): number {
    return !this.has_markers ? 0 : eval(this.pictures.filter(p => p.has_markers).map(m => m.surface_temp).join('+')) / this.pictures.filter(p => p.has_markers).length;
  }
  public calculator: ICalculator = null;
  public get first_picture(): Picture {
    return this.pictures[0]
  }
  public filtered_pictures(): Picture[] {
    return this.pictures.filter(p => p != this.first_picture);
  }

  get pages(): number {
    return Math.ceil(this.filtered_pictures().length / 4) + (this.component.project.has_people ? 2 : 1);
  }

  constructor(project: Project, component?: TbiComponent, item?: Partial<ReportBase>) {
    if (!!item) {
      Object.assign(this, item);
      this.pictures = (item.pictures || []).map(p => new Picture(p));
      this.project = project;
      this.component = component;
      this.path = item.path;
      this.id = item.id;
      this.result = new Result(item.result);
      this.summary_id = item.summary_id;
      this.readonly_summary_id = item.readonly_summary_id;
      this.comment = item.comment;
      this.date = !!item.date ? new Date(item.date.toString()) : new Date();
      this.insulated = !!this.path.match(/insulated/gi) && !this.path.match(/un-insulated/gi);
      this.user = localStorage.getItem("tbi-user");
    }
  }

  get annual_saving(): string {
    return !this.result || this.result.headLost.power == 0
      //? `Click on Next to get the result` 
      ? ``
      : `from ${this.result.annual_saving_from} € to ${this.result.annual_saving_to} €`;
  }
}
