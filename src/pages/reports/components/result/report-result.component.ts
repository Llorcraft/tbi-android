import { Component, Input, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { NON_PICTURE } from '../../../../const/images/non-picture';
import { BaseReportPage } from '../../../../models/reports';
import { IMAGES } from '../../../../const/images';

@Component({
    selector: '[report-result]',
    templateUrl: './report-result.component.html',
    host: {
        '(window:resize)': 'setDefaultZoom()'
    }
})

export class ReportResultComponent implements AfterContentInit {
    @Input() parent: BaseReportPage;
    @Input() show_advise?: boolean = true;
    @Output() onReady = new EventEmitter<ReportResultComponent>();
    unknow_surface: boolean = false;
    is_validation: boolean = false;
    images = IMAGES;
    zoom = .5;
    @Input() currency: string;
    protected get first_picture(): string {
        return this.parent.report.pictures.length ? this.parent.report.pictures[0].picture : NON_PICTURE;
    }

    ngAfterContentInit(): void {
        setTimeout(() => this.initialize_values(), 250)
        this.setDefaultZoom();

    }

    setDefaultZoom() {
        const _zoom = getComputedStyle(document.getElementById('default-zoom-value'), ':before').getPropertyValue('content');
        this.zoom = (eval(_zoom + "*1"));
    }

    go_top() {
        document.getElementsByClassName('scroll-content')[3].scrollTo(0, 0)
    }

    initialize_values(): void {
        this.is_validation = !!this.parent
            && !!this.parent.report
            && !!this.parent.report.component
            && !!this.parent.report.component.validation;

        const height = 200;
        this.unknow_surface = this.parent.report.component && this.parent.report.component.fields.unknow_surface;
        let _max: number = this.parent.report.result.headLost.power;
        if (!!this.parent.report.result.previousHeadLost.power && this.parent.report.result.previousHeadLost.power > this.parent.report.result.headLost.power)
            _max = this.parent.report.result.previousHeadLost.power;

        this.scale.max = this.upScale(_max / 100);
        this.scale.medium = Math.ceil(this.scale.max / 1.5);
        this.scale.min = Math.ceil(this.scale.max / 2)
        this.scale.max;
        this.currency = this.currency || this.parent.report.component.project.currency;

        if (!this.parent.report.result.previousHeadLost.power)
            this.set_values(height);
        else
            this.set_validation_values(height);
    }

    private set_validation_values(height: number) {
        this.bars.current.losses = [
            this.get_delta() * (this.parent.report.result.previousHeadLost.power / 100 * height / (this.scale.max)),
            this.get_delta() * this.down(this.parent.report.result.previousHeadLost.money)
        ];

        this.bars.basic.losses = [
            (this.parent.report.result.headLost.power / 100 * height / (this.scale.max)),
            this.up(this.parent.report.result.headLost.money)
        ];

        this.bars.basic.savings = [
            (this.bars.current.losses[0] - this.bars.basic.losses[0]),
            (this.bars.current.losses[1] - this.bars.basic.losses[1])
        ];

        this.onReady.next(this);
    }

    upScale(value: number): number {
        if (value > 1e4) return this.roundUp((value), -3)
        if (value > 1e3) return this.roundUp((value), -2)
        if (value > 1e2) return this.roundUp((value), -1)
        return this.roundUp(value, 0);
    }

    roundUp(number, digits): number {
        let factor = Math.pow(10, digits);
        return Math.ceil(number * factor) / factor
    }

    private get_delta(): number {
        return !this.parent.report || !this.parent.report.component
            ? 1
            : !Number(this.parent.report.component.fields.unknow_surface_temp)
                ? 1
                : Number(this.parent.report.component.fields.unknow_surface_temp)
    }

    private set_values(height: number) {
        this.bars.current.losses = [
            (this.parent.report.result.headLost.power / 100 * height / (this.scale.max)),
            this.down(this.parent.report.result.headLost.money)
        ];

        this.bars.basic.losses = [
            (this.parent.report.result.headLost.power - this.parent.report.result.savingPotentialMin.power) / 100 * height / (this.scale.max),
            (this.parent.report.result.headLost.money - this.parent.report.result.savingPotentialMin.money)            
            //this.up(this.parent.report.result.headLost.money - this.parent.report.result.savingPotentialMin.money)
            //this.up(this.parent.report.result.savingPotentialMin.money)
        ];

        this.bars.basic.savings = [
            (this.bars.current.losses[0] - this.bars.basic.losses[0]),
            (this.bars.current.losses[1] - this.bars.basic.losses[1])
        ];


        this.bars.economical.losses = [
            (this.parent.report.result.headLost.power - this.parent.report.result.savingPotentialMax.power) / 100 * height / (this.scale.max),
            //this.up(this.bars.current.losses[1] - this.parent.report.result.savingPotentialMax.money)
            this.up(this.parent.report.result.headLost.money - this.parent.report.result.savingPotentialMax.money)
        ];

        this.bars.economical.savings = [
            (this.bars.current.losses[0] - this.bars.economical.losses[0]),
            (this.bars.current.losses[1] - this.bars.economical.losses[1])
        ];

        //if (!this.parent.report.result.annual_saving_from || !this.parent.report.result.annual_saving_from) {
        this.parent.report.result.annual_saving_from = this.bars.basic.savings[1];
        this.parent.report.result.annual_saving_to = this.bars.economical.savings[1];
        //}

        this.onReady.next(this);
    }

    get show_savings(): boolean {
        return !!this.parent.report.annual_saving
            && (!!this.parent.report.component && !this.parent.report.component.validation)
            && !(Number(String(this.parent.report.result.annual_saving_from || 0)) < 0
                && Number(String(this.parent.report.result.annual_saving_to || 0)) < 0
                && !!this.parent.report.name.match(/Insulated/))
    }

    @Output() bars: any = {
        current: {
            losses: [0, 0],
        },
        basic: {
            savings: [0, 0],
            losses: [0, 0]
        },
        economical: {
            savings: [0, 0],
            losses: [0, 0]
        }
    }

    @Output() scale: any = {
        min: 0,
        medium: 0,
        max: 0
    }

    down(value: number): number {
        return value;
        // if(value < 100) return value;
        // let _value = value > 1000 ? Math.floor((value) / 100) * 100 : Math.floor((value) / 10) * 10;
        // return _value;
    }

    up(value: number): number {
        return value;
        // if(value < 100) return value;
        // let _value = value > 1000 ? Math.ceil((value) / 100) * 100 : Math.ceil((value) / 10) * 10;
        // return _value;
    }

    do_zoom(value: number) {
        this.zoom += value
    }

    get saving_lower(): boolean {
        return this.parent.report.result.annual_saving_from < 0
            || this.parent.report.result.annual_saving_to < 0;
    }

    constructor() {
    }

}
