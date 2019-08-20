import { ReportBase } from './../report-base';
import { ReportFlangePage } from '../../pages/reports';
import { Project } from '..';
import { TbiComponent } from '../component';
import { ICalculator } from '../calculators/calculator.factory';
import { FlangeDecorator } from '../calculators';

export class ReportFlange extends ReportBase {
  public page = ReportFlangePage;
  public name = `Uninsulated Flange`;
  //public path = REPORT.INSULATION.UNINSULATED_EQUIPMENTS.FLANGE;
  public calculator: ICalculator = new FlangeDecorator

  constructor(public project: Project, public component?: TbiComponent, item?: ReportFlange) {
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
