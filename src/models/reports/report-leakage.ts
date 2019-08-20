import { ReportBase } from './../report-base';
import { Project } from '..';
import { TbiComponent } from '../component';
import { ReportLeakagePage } from '../../pages/reports/leakage/report-leakage.component';

export class ReportLeakage extends ReportBase {
  public page = ReportLeakagePage;
  public name = `Leakage`;
  //public path = REPORT.MANTENANCE.LEAKAGE;

  constructor(public project: Project, public component?: TbiComponent, item?: ReportLeakage) {
    super(project, component, item);
  }
}
