import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Picture } from '../../../../models/picture';
import { ReportBase } from '../../../../models';
import { NON_PICTURE } from '../../../../const/images';
import { BaseReportPage } from '../../../../models/reports/base-report-page.class';
import { TextInput } from 'ionic-angular';

@Component({
    selector: '[picture-slide]',
    templateUrl: './picture-slide.component.html'
})

export class ReportPictureSlideComponent implements OnInit {
    @Input() report: ReportBase;
    @Input() editable: boolean;
    @Output() onStartEdit = new EventEmitter<Picture>();
    @Input() parent: BaseReportPage;
    @Input() input: TextInput;

    can_edit: boolean = false;

    ngOnInit(): void {
        this.can_edit = !!this.report.path.match(/(surface|pipe|valve|flange)/gi);
    }

    protected NON_PICTURE: string = NON_PICTURE
    public edit(picture: Picture): void{
        this.onStartEdit.emit(picture)
    }

    public set_button_color(who: string): string {
        return this.report.component.fields.surface_temp == this.report.component[who](this.report) ? 'royal' : 'light';
    }
    
    public set_temperature(who: string): void{
        this.report.component.fields.surface_temp=this.report.component[who](this.report);
        if(!!this.input) this.input.setFocus();
    }
}
