import { ReportBase } from './../report-base';
import { Project } from '..';
import { TbiComponent } from '../component';
import { ReportPipePage } from '../../pages/reports';

export class ReportPipe extends ReportBase {
  public page = ReportPipePage;
  public name = `Uninsulated Pipe`;
  //public path = REPORT.INSULATION.UNINSULATED_EQUIPMENTS.PIPE;
  public insulated = true;

  constructor(public project: Project, public component?: TbiComponent, item?: ReportPipe) {
    super(project, component, item);
  }
}
