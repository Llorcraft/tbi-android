import { Marker } from "./marker";
import { ModelWithPicture } from "./model-with-picture";

export class Picture extends ModelWithPicture {
  public markers: Marker[] = [];
  public get file(): string {
    const _split = (this.picture || '').split('/');
    if (_split.length < 2) return '';
    return _split[_split.length-1];
  }
  public get folder(): string {
    if(!this.picture) return '';
    return this.picture.replace(this.file, '');
  }
  public get has_markers(): boolean {
    return !!this.markers.filter(m => m.hasValue).length;
  }
  public get markers_with_values(): Marker[] {
    return this.markers.filter(m => m.hasValue);
  }
  public get min_temp(): number {
    return !this.has_markers ? null : this.markers.filter(m => m.hasValue).map(m => Number(m.temperature)).sort((a, b) => Number(a) > Number(b) ? 1 : -1)[0];
  }
  public get max_temp(): number {
    return !this.has_markers ? null : this.markers.filter(m => m.hasValue).map(m => Number(m.temperature)).sort((a, b) => Number(a) > Number(b) ? -1 : 1)[0];
  }
  public get surface_temp(): number {
    return !this.has_markers ? null : eval(this.markers.filter(m => m.hasValue).map(m => Number(m.temperature)).join('+')) / this.markers.filter(m => m.hasValue).length;
  }
  constructor(item?: Partial<Picture>) {
    super(item)
    if (!!item) {
      Object.assign(this, item);
      this.markers = (item.markers || []).map((m: Marker) => new Marker(m));
    }
  }
}
