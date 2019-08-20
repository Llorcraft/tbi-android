import { Component, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ReportAreaModalComponent } from './report-area-modal.component';

@Component({
  selector: 'area-button',
  templateUrl: './report-area-button.component.html'
})

export class ReportAreaButtonComponent {
  @Output() value?= null;
  @Output('change') change = new EventEmitter<number>();

  constructor(private modalCtrl: ModalController) {
  }

  public show_modal(): ReportAreaButtonComponent {
    const modal = this.modalCtrl.create(ReportAreaModalComponent,
      null,
      {
        cssClass: "modal-window-area",
        showBackdrop: true,
        enableBackdropDismiss: false
      });
    modal.onDidDismiss(v => {
      if(null === v || 'undefined' === typeof v) return;
      this.value = v;
      this.change.next(this.value);
    });
    modal.present();
    return this;
  }
}
