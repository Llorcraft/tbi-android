import { ReportBase } from './../report-base';
import { Project } from '..';
import { TbiComponent } from '../component';
import { ReportValvePage } from '../../pages/reports';

export class ReportValve extends ReportBase {
  public page = ReportValvePage;
  public name = `Uninsulated Valve`;
  //public path = REPORT.INSULATION.UNINSULATED_EQUIPMENTS.VALVE;
  public calculator

  constructor(public project: Project, public component?: TbiComponent, item?: ReportValve) {
    super(project, component, item);
    // this.component.fields.location = 'Test valve borrar';
    // this.component.fields.operational_time = 8760;
    // this.component.fields.nominal_diameter = 200;
    // this.component.fields.length = 1;
    // this.component.fields.number = 1;
    // this.component.fields.surface_material = 0.8;
    // this.component.fields.ambient_temp = 25;
    // this.component.fields.surface_temp = 250;
  }
}
