import { Value } from "../value";
import { Result } from "../result";
import { ReportBase } from "../report-base";
import { More } from "../../const/more/more";

export class BaseCalculator {
    constructor(protected report: ReportBase, protected fnc: Function[]) { }

    public hr: number = 1;
    public hr_min: number = 1;
    public hcv: number = 1;
    public hcv_min: number = 1;
    public hcv_laminar: number = 1;
    public hcv_laminar_min: number = 1;
    public hcv_laminar_max: number = 1;
    public hse: number = 1;
    public q: number = 1;
    public q_min: number = 1;
    public q_max: number = 1;
    public qref_pb: number = 1;
    public ql: number = 1;
    public ql_ref_pb: number = 1;
    public Qkwh: number = 1;
    public Qkwh_min: number = 1;
    public Qkwh_max: number = 1;
    public Qε: number = 1;
    public Qε_min: number = 1;
    public Qε_max: number = 1;
    public θm_min: number = 1;
    public θm_max: number = 1;
    public λm_min: number = 1;
    public λm_max: number = 1;
    public λm_mim: number = 1;
    public λdes_min: number = 1;
    public λdes_max: number = 1;
    public Savingkwh_min: number = 1;
    public Savingkwh_max: number = 1;
    public Savingε_min: number = 1;
    public Savingε_max: number = 1;
    public a: number = 0.0338;
    public b: number = 0.0001173;
    public c: number = 0.00000007545;
    public Cpb_surface_pipe: number = 4;
    public Cpb_valve_flange: number = 8;
    public d: number = 0.0000000007109;
    public ε_default = 0.8;
    public Ft: number = 1.5;
    public Δθ: number = 1;
    public e_min: number = 1;
    public e_max: number = 1;
    public hse_min: number = 0;
    public hse_max: number = 0;
    public hcv_turbulent: number = 1;
    public hcv_turbulent_min: number = 1;
    public Rse_min: number = 1;
    public Rse_max: number = 1;
    public Rins_min: number = 1;
    public Rins_max: number = 1;
    public Insulation_advice: string = '';
    public minimum_potential_explanation = '';
    public lort: number = 1;
    public lort_min: number = 1;
    public lort_max: number = 1;
    public get De(): number {
        /*const range = [
            [10, 0.018],
            [15, 0.022],
            [20, 0.027],
            [25, 0.034],
            [32, 0.043],
            [40, 0.049],
            [50, 0.061],
            [60, 0.072],
            [65, 0.077],
            [80, 0.089],
            [100, 0.115],
            [125, 0.141],
            [150, 0.169],
            [200, 0.220],
            [250, 0.273],
            [300, 0.324],
            [350, 0.356],
            [400, 0.407],
            [450, 0.458],
            [500, 0.508],
            [600, 0.610],
            [700, 0.712],
            [800, 0.813],
            [900, 0.915],
            [1000, 1.016],
            [1100, 1.120],
            [1200, 1.220],
            [1400, 1.420],
            [1500, 1.520],
            [1600, 1.620],
            [1800, 1.820],
            [2000, 2.020],
            [2000, 2.020],
            [2200, 2.220],
            [2400, 2.420],
            [2600, 2.620],
            [2800, 2.820],
            [3000, 3.020],
            [3200, 3.220],
            [3400, 3.420]
        ]
        const filter = range.find(r => r[0] > this.DN);
         return filter ?
             range.lastIndexOf(filter) > 0 ? range[range.lastIndexOf(filter) - 1][1] : range[0][1] : range[range.length -1][1];
        */
       return this.DN / 1e3;
    };
    public De_min: number = 1;
    public De_max: number = 1;
    public Sp: number = 1;
    public Rle: number = 1;
    public ql_min: number = 1;
    public ql_max: number = 1;
    public Rle_min: number = 1;
    public Rle_max: number = 1;
    /*Report and Project properties*/
    public δ: number = 0.00000005670367;
    public θse = Number(this.report.component.fields.surface_temp);
    public θse_min: number = this.θse;
    public θse_max: number = this.θse;
    public θa = Number(this.report.component.fields.ambient_temp);
    public θa_min: number = this.θa;
    public θa_max: number = this.θa;
    public Ot = Number(this.report.component.fields.operational_time);
    public ε = Number(this.report.component.fields.surface_material);
    public Σ = Number(this.report.component.project.price * this.report.component.project.price_delta);
    public S = Number(this.report.component.fields.surface || 1);
    public l = Number(this.report.component.fields.length || this.default_length);
    public n = Number(this.report.component.fields.number);
    public DN = Number(this.report.component.fields.nominal_diameter || 0);

    public get default_length(): number {
        return 1;
    }
    protected get_l(index: number) {
        if (this.Δθ < 80) return [20, 100][index] / 1e3;
        if (this.Δθ < 150) return [30, 180][index] / 1e3;
        if (this.Δθ < 250) return [50, 250][index] / 1e3;
        return [80, 300][index] / 1000;
    }

    public execute(): ReportBase {
        this.fnc.forEach(f => f.apply(this));

        let _find = More.CO2.find(m => Number(m[1]) == this.report.project.co2);
        let _co2 = Number(!!_find ? _find[1] : isNaN(this.report.project.co2) ? 0 : this.report.project.co2)

        console.log('co2', _co2);

        this.report.result = new Result({
            advise: this.Insulation_advice,
            headLost: new Value({
                power: this.Qkwh,
                money: this.Qε
            }),
            savingPotentialMin: new Value({
                power: this.Savingkwh_min,
                money: this.Savingε_min
            }),
            savingPotentialMax: new Value({
                power: this.Savingkwh_max,
                money: this.Savingε_max
            }),
            co2: [
                this.Qkwh * _co2 / 1000000, //* (!Number(this.report.component.fields.unknow_surface_temp) ? 1 : Number(this.report.component.fields.unknow_surface_temp)),
                this.Qkwh_min * _co2 / 1000000,// * (!Number(this.report.component.fields.unknow_surface_temp) ? 1 : Number(this.report.component.fields.unknow_surface_temp)),
                this.Qkwh_max * _co2 / 1000000// * (!Number(this.report.component.fields.unknow_surface_temp) ? 1 : Number(this.report.component.fields.unknow_surface_temp)),
            ]
        });

        console.log({
            hse: this.hse,
            hse_min: this.hse_min,
            hse_max: this.hse_max,
            hr_min: this.hr_min,
            lort: this.lort,
            hcv_laminar_min: this.hcv_laminar_min,
            hcv_turbulent_min: this.hcv_turbulent_min
        });
        return this.report;
    }

}
