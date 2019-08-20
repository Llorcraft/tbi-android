import { ReportBase } from "./report-base";
import { Fields } from "./fields";
import { Value } from "./value";
import { TbiComponent } from "./component";

export class ComponentLocation {
    public name: string;
    public section_input: SectionInput;
    public section_energy: SectionEnergy
    public reports: Map<string, ReportBase> = new Map<string, ReportBase>();
    public insulated: boolean = false;
    constructor(public component: TbiComponent) {
        ['Insulation', 'Safety', 'Maintenance', 'Custom'].forEach(key => {
            this.reports[key] = this.component.reports.filter(r => r.path.startsWith(key))
        });
        this.name = this.component.fields.location;
        this.section_input = new SectionInput(component);
        this.section_energy = new SectionEnergy(component.reports.find(r => r.path.startsWith('Insulation')))

        this.insulated = !!this.reports['Insulation'].length && this.reports['Insulation'].find((r: ReportBase) => -1 !== r.path.lastIndexOf('\\Insulated'));
    }
}

class SectionInput {
    public fields: Fields;
    public dimension?: number;
    constructor(component: TbiComponent) {
        this.fields = component.fields;
        this.dimension = !!this.fields.surface ? this.fields.surface : !!this.fields.length ? this.fields.length : null;
    }
}

class SectionEnergy {
    public heat_lost: Value;
    public saving_potential_min: Value;
    public saving_potential_max: Value;
    public insulated: string;
    public tbi: string;
    private advises: Map<string, string> = new Map<string, string>([
        ['System OK', 'OK'],
        ['Insulation recommended', 'Recommended'],
        ['SAFETY-Insulation recommended', 'SAFETY-Recommended']
    ])
    constructor(report: ReportBase) {
        this.heat_lost = report.result.headLost;
        this.saving_potential_max = report.result.savingPotentialMax;
        this.saving_potential_min = report.result.savingPotentialMin;
        this.insulated = report.path.startsWith('Insulation\Insulated') ? 'Yes' : 'No';
        this.tbi = this.advises.get(report.result.advise);
    }
}