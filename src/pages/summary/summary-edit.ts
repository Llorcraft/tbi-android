import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { TbiComponent } from '../../models/component';
import { ReportBase } from '../../models';

@Component({
    selector: 'page-summary',
    templateUrl: './summary-edit.html'
})

export class SummaryEditPage {
    public component: TbiComponent;
    public reports: ReportListItem[] = [];
    public selected: string;
    private report_selected: any;
    constructor(private viewCtrl: ViewController, private params: NavParams) {
        this.component = this.params.data.tbi_component as TbiComponent;
        this.reports = this.component.reports;
        this.report_selected = this.reports[0].id;
    }

    protected edit() {
        this.viewCtrl.dismiss(this.report_selected);
    }

    protected close() {
        this.viewCtrl.dismiss(null);
    }

    friendly_path(report: ReportBase): string {
        return report.path.split(/(\\|\/)/gi)[0];
    }
}

class ReportListItem {
    public id: string;
    public name: string;
    constructor(report: ReportBase) {
        const segments = report.path.split('\\');
        this.id = report.id;
        this.name = segments[segments.length - 1]
    }
}