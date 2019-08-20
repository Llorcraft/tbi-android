import { ReportBase } from './../report-base';
import { ReportInsulatedSurfacePage } from '../../pages/reports';
import { Project } from '..';
import { TbiComponent } from '../component';

export class ReportInsulatedSurface extends ReportBase {
  public page = ReportInsulatedSurfacePage;
  public name = `Insulated Surface`;
  //public path = REPORT.INSULATION.INSULATED_EQUIPMENTS.SURFACE;
  public insulated: boolean = true;

  public get potential_measure(): string {
    return (!this.component || !this.component.fields || null == this.component.fields.surface) ? 'kWh/m2' : 'kWh';
  }
  public get money_measure(): string {
    return (!this.component || !this.component.fields || null == this.component.fields.surface) ? '€/m2' : '€';
  }

  constructor(public project: Project, public component?: TbiComponent, item?: ReportInsulatedSurface) {
    super(project, component, item);
    // this.component.fields.location = 'Test isurface borrar';
    // this.component.fields.operational_time = 8760;
    // this.component.fields.surface = 20;
    // this.component.fields.surface_material = 0.6;
    // this.component.fields.ambient_temp = 12;
    // this.component.fields.surface_temp = 89;
  }
}
