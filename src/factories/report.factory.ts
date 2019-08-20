import { ReportBase, Project } from "../models";
import { ReportSurface, ReportFlange, ReportValve, ReportPipe } from "../models/reports";
import { TbiComponent } from "../models/component";
import { ReportGeneric } from "../models/reports/report-generic.class";

export namespace Report {
  export class Factory {
    public static base_path =  'Insulation\\Un-Insulated Equipments\\';

    public static Generic(project?: Project, component?: TbiComponent, item?: ReportBase): ReportBase {
      return new ReportGeneric(project, component || new TbiComponent(project), item);
    }
  }

  export namespace Insulation {
    export namespace InunsulatedEquipment {
      export class Factory {
        public static Surface(project?: Project, component?: TbiComponent, item?: ReportSurface): ReportBase {
          return new ReportSurface(project, component || new TbiComponent(project), item);
        }
        public static Flange(project?: Project, component?: TbiComponent, item?: ReportFlange): ReportBase {
          return new ReportFlange(project, component || new TbiComponent(project), item);
        }
        public static Pipe(project?: Project, component?: TbiComponent, item?: ReportPipe): ReportBase {
          return new ReportPipe(project, component || new TbiComponent(project), item);
        }
        public static Valve(project?: Project, component?: TbiComponent, item?: ReportValve): ReportBase {
          return new ReportValve(project, component || new TbiComponent(project), item);
        }
      }
    }
  }
}
