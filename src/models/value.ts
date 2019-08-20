export class Value {
    public power: number = 0;
    public money: number = 0;
  
    constructor(value?: Partial<Value>) {
      if (!value) return;
      Object.assign(this, value);
    }
  }
  