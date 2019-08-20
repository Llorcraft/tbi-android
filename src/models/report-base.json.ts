import { Result } from './result';
import { ReportBase } from './report-base';
import { Picture } from './picture';

export class ReportBaseJson {
  public id: string = '';
  public name: string = '';
  public user: string = '';
  public path: string = '';
  public result: Result = null;
  public pictures: Picture[] = [];
  public insulated: boolean = false;
  public summary_id: string = '';
  public readonly_summary_id: string = '';
  public comment: string = '';
  public date: Date = new Date();
  public fictisius = false

  constructor(item: Partial<ReportBase>) {
      this.id = item.id;
      this.name = item.name;
      this.path = item.path;
      this.summary_id = item.summary_id;
      this.comment = item.comment;
      this.readonly_summary_id = item.readonly_summary_id || item.summary_id;
      this.insulated = !!item.insulated;
      this.result = new Result(item.result);
      this.date = new Date(item.date.toString());
      this.pictures = (item.pictures || []).map(p => new Picture(p));
      this.user = item.user;
      this.fictisius = item.fictisius;  
  }
}
