import { Value } from "./value";

export class Result {
    public headLost: Value = new Value();
    public previousHeadLost: Value = new Value();
    public savingPotentialMin: Value = new Value();
    public savingPotentialMax: Value = new Value();
    public advise: string = '';
    public co2: number[] = [0, 0, 0, 0]; //Last index for previous
    public annual_saving_from: number;
    public annual_saving_to: number;
  
    constructor(result?: Partial<Result>) {
      if (!result) return;
      Object.assign(this, result);
      this.advise = result.advise;
      this.headLost = new Value(result.headLost);
      if(!!result.previousHeadLost) this.previousHeadLost = new Value(result.previousHeadLost);
      this.savingPotentialMin = new Value(result.savingPotentialMin);
      this.savingPotentialMax = new Value(result.savingPotentialMax);
      this.co2 = result.co2 || [0, 0, 0];
      this.annual_saving_from = result.annual_saving_from || 0;
      this.annual_saving_to = result.annual_saving_to || 0;
    }
  }