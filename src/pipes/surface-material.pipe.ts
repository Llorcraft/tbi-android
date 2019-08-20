import { Pipe, PipeTransform } from '@angular/core';
import { More } from '../const/more/more';
import { Fields } from '../models';

@Pipe({ name: 'surface_material' })
export class SurfaceMaterialPipe implements PipeTransform {
    transform(field?: Fields): string {
        const material = More.MATERIALS.find(t => t[1] == field.surface_material_index);
        return !!material ? `${material[0]}` : `${field.surface_material || ''}`;
    }
} 