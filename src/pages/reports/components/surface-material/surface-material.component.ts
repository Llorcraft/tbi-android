import { Component, Input, ViewChild } from '@angular/core';
import { BaseReportPage } from '../../../../models/reports';

@Component({
    selector: '[surface-material]',
    templateUrl: './surface-material.component.html'
})
export class SurfaceMaterialComponent {
    @Input() parent: BaseReportPage;
    @ViewChild('surface_material') surface_material;
    @ViewChild('#material') material;

    setFocus(){
        this.surface_material.setFocus();
    }
}
