import { ICalculator } from "./calculator.factory";
import { ReportBase } from "../report-base";
import { BaseCalculator } from "./base-calculator.class";


export class ISurfaceDecorator implements ICalculator {
  public calculate(report: ReportBase): ReportBase {
    return new ISurfaceCalculator(report).execute();
  }
}

class ISurfaceCalculator extends BaseCalculator {
  constructor(report: ReportBase) {
    super(report, [
      () => { this.θse_min = 55; this.θse_max = 35; this.θa_min = 35; this.θa_max = 1; },
      /*00*/() => this.Δθ = Math.abs(this.θse - this.θa),
      /*01*/() => this.hr = this.ε * this.δ * (Math.pow(this.θse + 273, 4) - Math.pow(this.θa + 273, 4)) / ((this.θse + 273) - (this.θa + 273)),
      /*01min*/() => this.hr_min = .8 * this.δ * (Math.pow(this.θse_min + 273, 4) - Math.pow(this.θa_min + 273, 4)) / ((this.θse_min + 273) - (this.θa_min + 273)),
      /*02*/() => this.hcv = 1.74 * Math.pow(this.Δθ, 1 / 3),
      /*02min*/() => this.hcv_min = 1.74 * Math.pow(Math.abs(this.θse_min - this.θa_min), 1 / 3),
      /*03*/() => this.hse = this.hr + this.hcv,
      /*03min*/() => this.hse_min = this.hr_min + this.hcv_min,
      /*04*/() => this.q = this.hse * this.Δθ,
      /*05*/() => this.Qkwh = this.q * this.S * this.Ot * 1 / 1000,
      /*06*/() => this.Qε = this.Qkwh * this.Σ,
      /*07*/() => this.θm_min = (this.θse_min + (this.θa + 35)) / 2,
      /*08*/() => this.θm_max = (this.θse_max + (this.θa + 20)) / 2,
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
      /*20*/() => this.q_min = (this.θse < this.θa) ? this.q * .7 : this.hse_min * Math.abs(this.θse_min - this.θa_min),
      /*21*/() => this.q_max = (this.θse < this.θa) ? this.q * .45 : 90,//this.Δθ / (this.Rse_max + this.Rins_max),
      /*22*/() => this.Qkwh_min = this.q_min * this.S * this.Ot * 1 / 1000,
      /*23*/() => this.Qkwh_max = this.q_max * this.S * this.Ot * 1 / 1000,
      /*24*/() => this.Qε_min = this.Qkwh_min * this.Σ,
      /*25*/() => this.Qε_max = this.Qkwh_max * this.Σ,
      /*26*/() => this.Savingkwh_min = this.Qkwh - this.Qkwh_min,
      /*27*/() => this.Savingkwh_max = this.Qkwh - this.Qkwh_max,
      /*28*/() => this.Savingε_min = this.Qε - this.Qε_min,
      /*29*/() => this.Savingε_max = this.Qε - this.Qε_max,
     /*30*/() => this.Insulation_advice = 'SAVINGS-achieved'
    ]);
  }
}


