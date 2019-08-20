import { Component, Input, EventEmitter } from '@angular/core';
import { NgForm, ValidationErrors } from '@angular/forms';
import { BaseReportPage } from '../../../../models/reports/base-report-page.class';

@Component({
  selector: 'report-errors',
  templateUrl: './report-errors.component.html',
})

export class ReportErrorsComponent {
  private _form?: NgForm;
  public page:  BaseReportPage;
  @Input('form')
  set form(form: NgForm) {
    if(!!this._form) return;
    this._form = form;
    form.valueChanges.subscribe((ev) => {
      this.on_change.emit(form);
      this.update();
    });
    this.update();
  };
  get():NgForm{
    return this._form;
  }
  public errors = [];
  public on_change: EventEmitter<NgForm> = new EventEmitter<NgForm>();

  constructor() {
  }

  understood(){
    this.page.view = 'form';
  }
  private update(): ReportErrorsComponent {
    this.errors = [];
    Object.keys(this._form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this._form.controls[key].errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(error => {
          this.errors.push({
            key: key,
            error: error,
            message: Array.from(document.getElementsByName(key))[1].attributes[`data-val-${error}`].value
          })
        });
      }
    });
    return this;
  }
}
