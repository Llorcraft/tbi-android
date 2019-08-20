import { ReportBase } from "./report-base";
import { Fields } from "./fields";
import { Project } from "./project";
import { Marker } from "./marker";
import { Picture } from "./picture";
import { Result } from "./result";

export class TbiComponent {
  public id: string = "";
  public project: Project = null;
  public reports: ReportBase[] = [];
  public fields: Fields = new Fields();
  public markers: Marker[];
  public date: Date = new Date();
  public validation: string = "";
  public validationReport: Partial<TbiComponent> = null;

  private flatten(arr: any[]): any[] {
    return [].concat.apply([], arr);
  }

  public get is_hot(): boolean {
    return (this.fields.surface_temp || 0) > 55;
  }

  public get is_cold(): boolean {
    return (this.fields.surface_temp < this.fields.ambient_temp);
  }

  public result: Result;

  public get insulated(): boolean {
    const report = this.reports.find(r => !!r.insulated);
    return !!report;
  }

  public get energy(): boolean {
    const report = this.reports.find(
      r => !!r.path.match(/(surface|pipe|valve|flange)/gi)
    );
    return !!report;
  }

  public reports_by_type(type: string): ReportBase[] {
    let result = this.reports.filter(
      r => !r.fictisius && !!r.path.match(new RegExp("(" + type + ")", "gi"))
    );
    if (type.lastIndexOf("hot") != -1) {
      let r = this.reports.find(
        r => !!r.path.match(/(surface|pipe|valve|flange)/gi) && this.is_hot
      );
      if (!!r) result.push(r);
    }
    if (type.lastIndexOf("cold") != -1) {
      let r = this.reports.find(
        r => !!r.path.match(/(surface|pipe|valve|flange)/gi) && this.is_cold
      );
      if (!!r) result.push(r);
    }
    return result.sort((r1, r2) => (r1.date > r2.date ? 1 : -1));
  }

  public get pictures(): Picture[] {
    return this.flatten(this.reports.map(r => r.pictures));
  }
  public all_markers(report: ReportBase): Marker[] {
    return ((this.markers || []).filter(m => m.temperature != null) || [])
      .concat(
        this.flatten(
          this.reports
            .filter(r => r.id != report.id)
            .map(r => this.flatten(r.pictures.map(p => p.markers)))
        )
      )
      .concat(this.flatten(report.pictures.map(p => p.markers)));
  }
  public has_markers(report: ReportBase): boolean {
    return !!this.all_markers(report).length;
  }
  public min_temp(report: ReportBase): number {
    if (!this.has_markers(report)) return 0;
    return this.all_markers(report)
      .map(m => Number(m.temperature))
      .sort((a, b) => (Number(a) > Number(b) ? 1 : -1))[0];
  }
  public max_temp(report: ReportBase): number {
    if (!this.has_markers(report)) return 0;
    return this.all_markers(report)
      .map(m => Number(m.temperature))
      .sort((a, b) => (Number(a) > Number(b) ? -1 : 1))[0];
  }
  public medium_temp(report: ReportBase): number {
    if (!this.has_markers(report)) return 0;
    const markers = this.all_markers(report).map(m =>
      parseFloat(m.temperature.toString())
    );
    return Number(
      (
        markers.reduce((a, t) => a + Number(t), 0) /
        this.all_markers(report).length
      ).toFixed(2)
    );
  }

  is_energy: boolean = false;

  constructor(
    project: Project,
    item?: Partial<TbiComponent>,
    validation?: Partial<TbiComponent>
  ) {
    this.project = project;
    if (!!item) {
      this.fields = new Fields(item.fields);
      this.project = project;
      if (!!item.date)
        this.date =
          item.date instanceof Date ? item.date : new Date(String(item.date));
      this.id =
        item.id ||
        Math.random()
          .toString()
          .substr(2);
      this.reports = (item.reports || []).map(
        r => new ReportBase(project, this, r)
      );
      this.markers = (item.markers || []).map(m => new Marker(m));
      this.validation = item.validation;
      // const report = this.reports.find(
      //   r => !!r.path.match(/(surface|pipe|valve|flange)/gi)
      // );
      this.is_energy = !!this.reports.find(r => r.energy);
      const report = this.reports[0];
      this.result = !!report ? report.result : null;
      this.validationReport = validation;
    }
  }
  // private update_surface_temp(): TbiComponent {
  //     const surface_temp = this.pictures.map(p => p.surface_temp).filter(p => p !== null);
  //     if (surface_temp.length === 0) return;
  //     this.fields.surface_temp = eval(surface_temp.join('+')) / surface_temp.length
  //     return this;
  // }

  public get_reports_by_type(type: string): ReportBase[] {
    return this.reports.filter(
      r => !!r.path.match(new RegExp("(" + type + ")", "gi"))
    );
  }
}
