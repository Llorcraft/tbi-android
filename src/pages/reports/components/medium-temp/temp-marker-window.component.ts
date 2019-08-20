import { Component, ViewChild } from '@angular/core';
import { Marker } from './../../../../models/marker';
import { ViewController, NavParams, Keyboard } from 'ionic-angular';
import { ScrollToComponent } from '../../../scroll_to_component.class';
import { Patterns } from '../../../../const/patterns';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'markers-window',
  templateUrl: './temp-marker-window.component.html'
})

export class ReportTempMarkersWindowComponent extends ScrollToComponent {
  @ViewChild(NgForm) form: NgForm;
  public patterns: any = Patterns;
  protected markers: any[] = [];
  protected get disabled(): boolean {
    return this.markers.filter(m => m.hasValue).length === 0;
  }

  // public on_focus(event: FocusEvent) {
  //   const elm = (event.currentTarget || event.target) as HTMLElement
  //   elm.closest('.scroll-content').scrollTo(0, 0);
  //   elm.closest('.scroll-content').scrollTo(0, elm.closest('ion-item').getBoundingClientRect().top - 100);
  // }

  public on_focus(event: any) {
    const elm = event._elementRef.nativeElement
    const offset = 100;
    elm.closest('.scroll-content').scrollTo(0, elm.closest('.scroll-content').scrollTop - offset);
    this.scroll(elm.closest('.scroll-content'), elm.closest('.scroll-content').scrollTop + elm.closest('ion-item').getBoundingClientRect().top - offset);
  }

  protected on_keypress(event: KeyboardEvent) {
    if (event.which === 13) {
      (event.currentTarget as HTMLElement).closest('.scroll-content').scrollTo(0, 0);
      this.calculate();
    }
  }

  private flatten(arr: any[]): any[] {
    return [].concat.apply([], arr);
  }

  flatMap = (arr, f) => arr.reduce((x, y) => [...x, ...f(y)], []);

  constructor(private viewCtrl: ViewController, private params: NavParams, protected keyboard: Keyboard) {
    super(keyboard);

    let others_reports_markers = this.flatten(this.params.data.report.component.reports.filter(r => r != this.params.data.report)).map(r => this.flatMap(r.pictures, (p => p.markers.map(m => ({ parent: p, marker: m, order: `2${m.hasValue ? 0 : 1}` })))));
    let report_marker = this.flatMap(this.params.data.report.pictures, (p => p.markers.map(m => ({ parent: p, marker: m, order: `1${m.hasValue ? 0 : 1}` }))));
    params.data.report.component.markers = params.data.report.component.markers.concat(Array.apply(null, { length: 10 }).slice(others_reports_markers.length + report_marker.length + params.data.report.component.markers.length, 10).map(x => new Marker()));
    let component_markers = params.data.report.component.markers.map(m => ({ parent: params.data.report.component, marker: m, order: `3${m.hasValue ? 0 : 1}` }));
    let markers = component_markers.concat(report_marker).concat(others_reports_markers);
    this.markers = markers.sort((a, b) => a.order > b.order ? 1 : -1);
  }

  protected calculate(): ReportTempMarkersWindowComponent {
    this.markers.forEach(m => {
      m.parent.markers = m.parent.markers.filter(pm => pm.hasValue);
    })
    // this.params.data.pictures.forEach((p: Picture) => p.markers = p.markers.sort(m => m.temperature).reverse());
    // this.params.data.pictures.filter((p: Picture) => !!p.picture).forEach((p: Picture) => p.markers = p.markers.filter(m => m.hasValue));

    this.viewCtrl.dismiss(this.markers.filter(m => m.hasValue));
    return this;
  }
  protected close(): ReportTempMarkersWindowComponent {
    this.viewCtrl.dismiss(null);
    return this;
  }

}
