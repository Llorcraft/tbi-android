import { ReportBase } from './../report-base';
import { GenericReportPage } from '../../pages/reports';
import { Project } from '..';
import { TbiComponent } from '../component';

export class ReportGeneric extends ReportBase {
  public page = GenericReportPage;
  public name = `Generic`;
  //public path = REPORT.INSULATION.UNINSULATED_EQUIPMENTS.GENERIC;
  
  constructor(public project: Project, public component?: TbiComponent, item?: ReportGeneric) {
    super(project, component, item);
  }
}
