import { Component } from '@angular/core';
import { FileService, ProjectService } from '../../services';
import { Document } from '../../models';
import { Picture } from '../../models/picture';
import { Includes } from '../../enums';

@Component({
  selector: 'page-download',
  templateUrl: 'download.html'
})
export class DownloadPage {
  public files: Document[] = [];
  public pictures: Picture[] = [];
  constructor(private file: FileService, private service: ProjectService) {
    
    this.file.get_documents().then(d => this.files = d);
    
    service.get_all(true, Includes.COMPONENTS + Includes.CONTACTS  + Includes.PICTURES).then(projects => {
      projects.forEach(p => {
        this.files = this.files.concat(p.documents);
        p.components.forEach(c => c.reports.forEach(r => this.pictures = this.pictures.concat(r.pictures)));
      });
    })
  }

  create_file() {
    this.service.create_database([]).then(blob => {
      console.log(blob);
      //   var a = document.createElement("a"),
      //     url = URL.createObjectURL(blob);
      //   a.href = url;
      //   a.download = 'db.zip';
      //   a.click();
      //   setTimeout(function () {
      //     window.URL.revokeObjectURL(url);
      //   }, 0);
    })
  }

}
