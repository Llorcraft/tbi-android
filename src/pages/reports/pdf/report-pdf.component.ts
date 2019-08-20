import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { NavParams, NavController } from 'ionic-angular';
import { Group, exportPDF } from '@progress/kendo-drawing';
import { FileService, MessageService, LicencesService } from '../../../services';
import { ReportBase } from '../../../models';
import { FileOpener } from '@ionic-native/file-opener';
import { IMAGES } from '../../../const/images';

@Component({
  selector: 'report-pdf-page',
  templateUrl: './report-pdf.component.html'
})
export class ReportPdfPage implements OnInit {
  @ViewChild('pdf') public pdf: PDFExportComponent;
  @Input() autoprint = true;
  report: ReportBase;
  //c: TbiComponent;
  images = IMAGES;
  creating_pdf = true;
  constructor(private nav: NavController,
    private params: NavParams,
    private file: FileService,
    private message: MessageService,
    private opener: FileOpener,
    public licences: LicencesService) { }

  ngOnInit(): void {
    this.report = this.params.data.report;
    if(!this.report.energy) this.report_ready();
  }

  setPageNumber(index: number): number {
    return (index % 4 == 0) ? 4 - index - 2 : null;
  }

  setPageCount(): number {
    return (this.report.filtered_pictures.length < 1 ? 1 : Math.ceil(this.report.filtered_pictures.length || 1 / 4))
      + (this.report.has_contacts ? 2 : 1)
  }
  public report_ready() {
    if (!this.autoprint) return;
    Array.from(document.getElementsByClassName('scroll-content')).reverse()[0].scrollTo(0, 0);
    setTimeout(() => {
      this.pdf.export().then((g: Group) => {
        exportPDF(g).then(data => {
          this.file.create_pdf(data, `TBI-${this.report.summary_id}`.replace(/ /g, '_')).then(r => {
            this.nav.pop({ animate: false });
            this.opener.open(r, 'application/pdf')
              .catch(ex => this.message.alert('Error', `${r}\n${JSON.stringify(ex)}`));
          })
        })
      })
    }, 10);
  }}
