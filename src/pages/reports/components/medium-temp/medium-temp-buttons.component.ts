import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ReportTempMarkersWindowComponent } from '../..';
import { ReportBase } from '../../../../models';

@Component({
  selector: 'medium-temp',
  templateUrl: './medium-temp-buttons.component.html'
})

export class ReportMediumTempButtonsComponent {
  protected show = { markers: true, pictures: true };
  @Output('change') change = new EventEmitter<number>();
  @Input() report: ReportBase;
  @Output() value: number;

  constructor(private modalCtrl: ModalController) { }

  protected show_markers(): ReportMediumTempButtonsComponent {
    const modal = this.modalCtrl.create(ReportTempMarkersWindowComponent,
      { 
        report: this.report
      },
      {
        cssClass: "modal-window-markers",
        showBackdrop: true,
        enableBackdropDismiss: false
        
      });
    modal.onDidDismiss(v => {
      if (!v || !v.length) return
      this.value = eval(v.map(m => m.temperature).join('+')) / v.length;
      this.change.next(this.value);
    });
    modal.present();
    return this;
  }

  protected show_pictures(): ReportMediumTempButtonsComponent {
    return this;
  }


}
