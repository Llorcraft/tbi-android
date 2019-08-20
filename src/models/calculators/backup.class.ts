import { ICalculator } from "./calculator.factory";
import { ReportBase } from "../report-base";
import { BaseCalculator } from "./base-calculator.class";


export class BackupDecorator implements ICalculator {
    public calculate(report: ReportBase): ReportBase {
        return new BackupCalculator(report).execute();
    }
}

class BackupCalculator extends BaseCalculator {
    constructor(report: ReportBase) {
        super(report, [
        /*00*/() => this.Δθ = Math.abs(this.θse - this.θa),
        /*01*/() => this.hr = this.ε * this.δ * (Math.pow(this.θse + 273, 4) - Math.pow(this.θa + 273, 4)) / ((this.θse + 273) - (this.θa + 273)),
        /*02*/() => this.hcv = 1.74 * Math.pow(this.Δθ, 1 / 3),
        /*03*/() => this.hse = this.hr + this.hcv,
        /*04*/() => this.q = this.hse * this.Δθ,
        /*05*/() => this.Qkwh = this.q * this.S * this.Ot * 1 / 1000,
        /*06*/() => this.Qε = this.Qkwh * this.Σ,
        /*07*/() => this.θm_min = (this.θse + (this.θa + 35)) / 2,
        /*08*/() => this.θm_max = (this.θse + (this.θa + 20)) / 2,
        /*09*/() => this.λm_min = this.a + this.b * this.θm_min + this.c * Math.pow(this.θm_min, 2) + this.d * Math.pow(this.θm_min, 3),
        /*10*/() => this.λm_max = this.a + this.b * this.θm_max + this.c * Math.pow(this.θm_max, 2) + this.d * Math.pow(this.θm_max, 3),
        /*11*/() => this.λdes_min = this.λm_min * this.Ft,
        /*12*/() => this.λdes_max = this.λm_max * this.Ft,
        /*13*/() => this.e_min = this.get_l(0),
        /*14*/() => this.e_max = this.get_l(1),
        /*15*/() => this.Rse_min = 1 / this.hse,
        /*16*/() => this.Rse_max = 1 / this.hse,
        /*17*/() => this.Rins_min = this.e_min / this.λdes_min,
        /*18*/() => this.Rins_max = this.e_max / this.λdes_max,
        /*19*/() => this.qref_pb = this.q - ((10000 * this.Cpb_surface_pipe) / this.Ot / this.Σ),
        /*20*/() => this.q_min = this.Δθ / (this.Rse_min + this.Rins_min),
        /*21*/() => this.q_max = this.Δθ / (this.Rse_max + this.Rins_max),
        /*22*/() => this.Qkwh_min = this.q_min * this.S * this.Ot * 1 / 1000,
        /*23*/() => this.Qkwh_max = this.q_max * this.S * this.Ot * 1 / 1000,
        /*24*/() => this.Qε_min = this.Qkwh_min * this.Σ,
        /*25*/() => this.Qε_max = this.Qkwh_max * this.Σ,
        /*26*/() => this.Savingkwh_min = this.Qkwh - this.Qkwh_min,
        /*27*/() => this.Savingkwh_max = this.Qkwh - this.Qkwh_max,
        /*28*/() => this.Savingε_min = this.Qε - this.Qε_min,
        /*29*/() => this.Savingε_max = this.Qε - this.Qε_max,
       /*30*/() => this.Insulation_advice = this.qref_pb > this.q_min ? 'Insulation recommended' : 'System OK',
            // /*31*/() => this.minimum_potential_explanation = 'Minimum potential savings per m<sup>2</sup><sub>cf</sub> insulated. Total surface must be define.',
            // /*32*/() => this.lort = Math.pow(this.De, 3) * this.Δθ,
            // /*33*/() => this.hcv_laminar = 1.25 * Math.pow(this.Δθ / this.De, 1 / 4),
            // /*34*/() => this.hcv_turbulent = 1.12 * Math.pow(this.Δθ, 1 / 3),
            // /*35*/() => this.hse = this.hr + this.lort < 10 ? this.hcv_laminar : this.hcv_turbulent,
            // /*36*/() => this.De_min = this.De + 2 * this.e_min,
            // /*37*/() => this.De_max = this.De + 2 * this.e_max,
            // /*38*/() => this.Rins_min = Math.log(this.De_min / this.De) / 2 * Math.PI * this.λdes_min,
            // /*39*/() => this.Rins_max = Math.log(this.De_max / this.De) / 2 * Math.PI * this.λdes_max,
            // /*40*/() => this.Sp = Math.PI * this.De_min,
            // /*42*/() => this.Rle = 1 / this.hse * Math.PI * this.De,
            // /*43*/() => this.ql = this.Δθ / this.Rle,
            // /*41*/() => this.ql_ref_pb = this.ql,
            // /*44*/() => { if (!!this.l) this.Qkwh = this.ql * this.l * this.Ot * 1 / 1000 },
            // /*45*/() => this.ql_min = this.Δθ / (this.Rle_min + this.Rins_min),
            // /*46*/() => this.ql_max = this.Δθ / (this.Rle_max + this.Rins_max),
            // /*47*/() => { if (!!this.n) this.Qkwh = this.ql * this.l * this.Ot * this.n * 1 / 1000 },
            // /*48*/() => this.ql_ref_pb = this.ql - (10000 * this.c * this.Sp)
        ]);
    }
}
