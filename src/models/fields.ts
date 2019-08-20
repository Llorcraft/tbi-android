import { More } from "../const/more/more";

export class Fields {
  public location: string = '';
  public operational_time?: number = null;
  public surface?: number = null;
  public surface_material?: number = null;
  public ambient_temp?: number = null;
  public surface_temp?: number = null;
  public medium_temp?: number = null;
  public length?: number = null;
  public number?: number = null;
  public dimension?: number = null;
  public emissivity?: number = null;
  public leakage: string = '';
  public comment: string = '';
  public nominal_diameter?: number = null;
  public main_dimension: number = null;
  public damaged_cladding: boolean[] = [false, false, false, false];
  public damaged_insulation: boolean[] = [false, false, false, false];
  public damaged_comment: string = '';
  public space_warning: boolean = false;

  public operational_time_index: number = 0;
  public surface_material_index: number = 0;

  public get damaged_cladding_friendly():string {
    const result = ['Lack of cladding', 'Foot traffic/Dent', 'Highly corroded'].filter((v, i)=> this.damaged_cladding[i]).join(', ');
    return result;
  }

  public get damaged_insulation_friendly():string {
    const result = ['Lack of insulation', 'Wet insulation', 'Old insulation'].filter((v, i)=> this.damaged_insulation[i]).join(', ');
    return result;
  }
  public condensation: boolean[] = [false, false]
  public condensation_comment: string = '';
  public unknow_surface: boolean = false
  public unknow_surface_temp: number = 0;

  
  public get friendly_surface_material(): string {
    const more = More.MATERIALS.find(m => m[1] == this.surface_material);
    return !more  
      ? this.surface_material.toString()
      : more[0].toString();
  }


  constructor(f?: Partial<Fields>) {
    if (!f) return;
    this.location = f.location;
    this.operational_time = this.number_or_null(f.operational_time);
    this.surface = this.number_or_null(f.surface);
    this.surface_material = this.number_or_null(f.surface_material);
    this.ambient_temp = this.number_or_null(f.ambient_temp);
    this.surface_temp = this.number_or_null(f.surface_temp);
    this.medium_temp = this.number_or_null(f.medium_temp);
    this.length = this.number_or_null(f.length);
    this.number = this.number_or_null(f.number);
    this.dimension = this.number_or_null(f.dimension);
    this.emissivity = this.number_or_null(f.emissivity);
    this.nominal_diameter = this.number_or_null(f.nominal_diameter);
    this.leakage = f.leakage;
    this.comment = f.comment;
    this.main_dimension = this.number_or_null(f.main_dimension);
    this.damaged_cladding = f.damaged_cladding;
    this.damaged_insulation = f.damaged_insulation;
    this.damaged_comment = f.damaged_comment;
    this.condensation = f.condensation;
    this.condensation_comment = f.condensation_comment || '';
    this.unknow_surface = !!f.unknow_surface;
    this.unknow_surface_temp = Number(f.unknow_surface_temp || '0');
    this.space_warning = f.space_warning

    this.operational_time_index = f.operational_time_index || 0;
    this.surface_material_index = f.surface_material_index || 0;
  }

  private number_or_null(value?: number | string): number {
    if (value === null || value === '' || typeof value === 'undefined') return null;
    if (isNaN(Number(value))) return null;
    return Number(value);
  }
}
