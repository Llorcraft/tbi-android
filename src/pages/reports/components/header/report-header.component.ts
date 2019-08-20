import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { BaseReportPage } from '../../../../models/reports';
import { LicencesService } from '../../../../services';

@Component({
  selector: 'report-header',
  templateUrl: './report-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ReportHeaderComponent implements OnInit {
  @Input() parent: BaseReportPage;

  constructor(private licences: LicencesService) { }

  ngOnInit(): void {
    this.licences.setLogo();
  }

}
