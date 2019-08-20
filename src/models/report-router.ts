import { Project, ReportBase } from ".";
import { REPORT } from "../const/report.const";
import { NavController } from "ionic-angular";
import { TbiComponent } from "./component";
import { ReportFlange, ReportPipe, ReportSurface, ReportValve, ReportInsulatedSurface, ReportInsulatedPipe, ReportDamaged, ReportCondensation } from "./reports";
import { ReportGeneric } from "./reports/report-generic.class";
import { Result } from "./result";

export class ReportRouter {
  constructor(public project: Project,
    public component: TbiComponent,
    public navCtrl: NavController) {
    this.component = this.component || new TbiComponent(this.project);
  }

  public navigate_to_report(path: string, summary_id: string, report?: ReportBase, event?: MouseEvent, result?: Result): ReportRouter {
    const r = this.create_report(path, summary_id, report)
    this.navCtrl.push(r.page, {
      project: this.project,
      component: this.component,
      report: r,
      result: result
    });
    return this;
  }

  public create_report(path: string, summary_id: string, report?: ReportBase): ReportBase {
    let _report: ReportBase = report;
    //if (!!_report) return _report;
    switch (path) {
      case REPORT.INSULATION.UNINSULATED_EQUIPMENTS.SURFACE:
      case REPORT.SAFETY.HOT_SURFACE.UNINSULATED_EQUIPMENTS.SURFACE:
        _report = new ReportSurface(this.project, this.component, report);
        break;
      case REPORT.INSULATION.INSULATED_EQUIPMENTS.SURFACE:
      case REPORT.SAFETY.HOT_SURFACE.INSULATED_EQUIPMENTS.SURFACE:
        _report = new ReportInsulatedSurface(this.project, this.component, report);
        break;
      case REPORT.INSULATION.UNINSULATED_EQUIPMENTS.FLANGE:
      case REPORT.SAFETY.HOT_SURFACE.UNINSULATED_EQUIPMENTS.FLANGE:
        _report = new ReportFlange(this.project, this.component, report);
        break;
      case REPORT.INSULATION.UNINSULATED_EQUIPMENTS.PIPE:
      case REPORT.SAFETY.HOT_SURFACE.UNINSULATED_EQUIPMENTS.PIPE:
        _report = new ReportPipe(this.project, this.component, report);
        break;
      case REPORT.INSULATION.INSULATED_EQUIPMENTS.PIPE:
      case REPORT.SAFETY.HOT_SURFACE.INSULATED_EQUIPMENTS.PIPE:
        _report = new ReportInsulatedPipe(this.project, this.component, report);
        break;
      case REPORT.INSULATION.UNINSULATED_EQUIPMENTS.VALVE:
      case REPORT.SAFETY.HOT_SURFACE.UNINSULATED_EQUIPMENTS.VALVE:
        _report = new ReportValve(this.project, this.component, report);
        break;
      case REPORT.INSULATION.INSULATED_EQUIPMENTS.DAMAGED:
      case REPORT.INSULATION.COLD_INSULATION.DAMAGED:
      case REPORT.SAFETY.HOT_SURFACE.INSULATED_EQUIPMENTS.DAMAGED:
      case REPORT.MANTENANCE.DAMAGED:
        _report = new ReportDamaged(this.project, this.component, report);
        break;
      case REPORT.INSULATION.COLD_INSULATION.CONDENSATION:
      case REPORT.MANTENANCE.CONDENSATION:
        _report = new ReportCondensation(this.project, this.component, report);
        break;
      // case REPORT.MANTENANCE.LEAKAGE:
      //   _report = new ReportLeakage(this.project, this.component, report);
      //   break;
      default:
        _report = new ReportGeneric(this.project, this.component, report);
        break;
    }
    _report.path = path;
    _report.summary_id = summary_id;
    _report.readonly_summary_id = summary_id;
    return _report;
  }
}
