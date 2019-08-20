import { Component, Input, OnInit } from '@angular/core';
import { BaseReportPage } from '../../../../models/reports';

@Component({
    selector: 'report-footer',
    templateUrl: './report-footer.component.html'
})
export class ReportFooterComponent implements OnInit{
    @Input() parent: BaseReportPage;
    @Input() calculate_text?: string

    ngOnInit(): void {
        this.calculate_text = this.calculate_text || 'Calculate';
    }

}
