import { ReportBase } from './../report-base';
import { Project } from '..';
import { TbiComponent } from '../component';
import { ReportInsulatedPipePage } from '../../pages/reports';

export class ReportInsulatedPipe extends ReportBase {
  public page = ReportInsulatedPipePage;
  public name = `Insulated Pipe`;
  //public path = REPORT.INSULATION.INSULATED_EQUIPMENTS.PIPE;
  public insulated = true;

  constructor(public project: Project, public component?: TbiComponent, item?: ReportInsulatedPipe) {
    super(project, component, item);
    // this.component.fields.location = 'Test ipipe borrar';
    // this.component.fields.operational_time = 8760;
    // this.component.fields.nominal_diameter = 200;
    // this.component.fields.length = 1;
    // this.component.fields.surface_material = 0.9;
    // this.component.fields.ambient_temp = 12;
    // this.component.fields.surface_temp = 36;
  }
}
