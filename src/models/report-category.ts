import { ReportBase } from "./report-base";
import { ReportCategories } from '../enums';

export class ReportCategory {
  public id: number = 0;
  public name: string = '';
  public categories: ReportCategory[] = null;
  public reports: ReportBase[] = null;
  public type: ReportCategories = ReportCategories.OTHERS;

  constructor(item?: Partial<ReportCategory>) {
    if (!!item) {
      Object.assign(this, item);
    }
  }
}

