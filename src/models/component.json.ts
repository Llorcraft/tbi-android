import { Fields } from "./fields";
import { ReportBaseJson } from "./report-base.json";
import { TbiComponent } from "./component";
import { Marker } from "./marker";

export class TbiComponentJson {
    public id: string = '';
    public reports: ReportBaseJson[] = [];
    public fields: Fields = new Fields();
    public markers: Marker[];
    public date: Date;
    public validation: string = '';

    constructor(item: Partial<TbiComponent>) {
        this.id = item.id;
        this.reports = (item.reports || []).map(r => new ReportBaseJson(r))
        this.fields = new Fields(item.fields);
        this.markers = (item.markers || []).map(m => new Marker(m));
        this.date = item.date || new Date();
        this.validation = item.validation;
    }

}