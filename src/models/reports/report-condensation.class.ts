import { ReportBase } from './../report-base';
import { Project } from '..';
import { TbiComponent } from '../component';
import { ICalculator } from '../calculators/calculator.factory';
import { ReportCondensationPage } from '../../pages/reports';

export class ReportCondensation extends ReportBase {
  public page = ReportCondensationPage;
  public name = `Condensation`;
  //public path = REPORT.CONDENSATION;
  public calculator: ICalculator;

  constructor(public project: Project, public component?: TbiComponent, item?: ReportCondensation) {
    super(project, component, item);
    // this.component.fields.location = 'Test flange borrar';
    // this.component.fields.operational_time = 8760;
    // this.component.fields.nominal_diameter = 200;
    // this.component.fields.number = 1;
    // this.component.fields.surface_material = 0.8;
    // this.component.fields.ambient_temp = 12;
    // this.component.fields.surface_temp = 250;
  }
}
