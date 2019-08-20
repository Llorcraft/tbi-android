export class Segment {

  public value: number = 0;
  public visible_group: number = 0;
  public options = [];
  public hidden: boolean = false;

  public set(option: string | number): Segment {
    this.value = 0;
    const options = {
      '': [],
      'insulation': ['UN-Insulated Equipment', 'Insulated Equipment', 'Cold Insulation'],
      'hot-surface': ['UN-Insulated Equipment', 'Insulated Equipment']
    }
    this.options = options[option] || [];
    this.hidden = !this.options.length;
    return this;
  }
}
