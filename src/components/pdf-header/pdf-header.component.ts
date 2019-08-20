import { Component, ViewEncapsulation } from '@angular/core';
import { LicencesService } from '../../services';

@Component({
    selector: 'pdf-header',
    templateUrl: './pdf-header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PdfHeaderComponent{
    constructor(public licences: LicencesService) { 

    }
}
