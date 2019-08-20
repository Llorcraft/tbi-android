import { ReportBase } from "../report-base";
import { SurfaceDecorator, FlangeDecorator, PipeDecorator, ValveDecorator, ISurfaceDecorator, IPipeDecorator } from ".";
import { REPORT } from "../../const";
import { Result } from "../result";

export class CalculatorFactory {
    public decorators = new Map<string, Function>();

    public calculate(report: ReportBase, result?: Result): ReportBase {
        try {
            let calculated_report: ReportBase = this.decorators.get(report.path)().calculate(report);
            if (!!result) {
                calculated_report.result.previousHeadLost = result.headLost;
                calculated_report.result.co2[3] = result.co2[0];
            }
            return calculated_report;
        } catch (ex) {
            return report;
        }
    }

    constructor() {
        this.decorators.set(REPORT.INSULATION.UNINSULATED_EQUIPMENTS.SURFACE, () => new SurfaceDecorator());
        this.decorators.set(REPORT.INSULATION.UNINSULATED_EQUIPMENTS.FLANGE, () => new FlangeDecorator());
        this.decorators.set(REPORT.INSULATION.UNINSULATED_EQUIPMENTS.PIPE, () => new PipeDecorator());
        this.decorators.set(REPORT.INSULATION.UNINSULATED_EQUIPMENTS.VALVE, () => new ValveDecorator());
        this.decorators.set(REPORT.INSULATION.INSULATED_EQUIPMENTS.SURFACE, () => new ISurfaceDecorator());
        this.decorators.set(REPORT.INSULATION.INSULATED_EQUIPMENTS.PIPE, () => new IPipeDecorator());
    }
}

export interface ICalculator {
    calculate(report: ReportBase): ReportBase;
}