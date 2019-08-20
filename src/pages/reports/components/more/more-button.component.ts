import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ActionSheetController, ActionSheet, ActionSheetButton } from 'ionic-angular';
import { More } from '../../../../const/more/more';

@Component({
  selector: 'more',
  templateUrl: './more-button.component.html'
})
export class ReportMoreButtonComponent {
  @Output() value?: any = null;
  @Output() index: number = 0;
  @Input() type: string = '';
  @Input() cancelable?: boolean = true;
  @Output('change') change = new EventEmitter<{value?: any, index: number}>();
  
  constructor(private actionSheetCtrl: ActionSheetController) {
  }

  private options = {
    cancel: [{
      text: 'Cancel',
      role: 'cancel',
    }],
    time: More.TIMES,
    materials: More.MATERIALS,
    co2: More.CO2,
    currencies: More.CURRENCIES,
    measures: More.MEASURES
    // "€": More.MEASURES["€"],
    // "$": More.MEASURES["$"],
    // "£": More.MEASURES["£"]
  }
  protected show_options(): ActionSheet {
    let buttons = this.options[this.type].map(b => {
      return ({
        text: b[0],
        handler: () => {
          // setTimeout(() => {
          //   const _elem = (this.type == 'time')
          //   ? document.querySelector('input[name="surface"]') || document.querySelector('input[name="nominal_diameter"]')
          //   : document.querySelector('input[name="surface_temp"]');
          //   if (!!_elem) {
          //     _elem.dispatchEvent(new FocusEvent('focus'));
          //     //(<any>_elem).focus();
          //     //setTimeout(()=>document.querySelector('.input-has-focus').getElementsByTagName('input')[0].focus(), 100);
          //     //(<any>_elem).select();
          //   }
          //   }, 1000);
          this.value = b[1];
          this.index = b[2];
          this.change.next({value: b[1], index: b[2]});
        }
      }) as ActionSheetButton;
    });
    if (!!this.cancelable) {
      buttons = buttons.concat(this.options.cancel)
    }
    const actionSheet = this.actionSheetCtrl.create({
      buttons: buttons,
      cssClass: 'action-width-45'
    });
    actionSheet.present();
    return actionSheet;
  }
}
