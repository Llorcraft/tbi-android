export class Document {
  public folder: string = '';
  public file: string = '';
  public size: number = 0;
  public get extension(): string {
    try {
      return this.file.substr(this.file.lastIndexOf('.') + 1, this.file.length - 1).toLowerCase();
    } catch{
      return 'unknown'
    }
  }

  constructor(document?: Partial<Document>) {
    if (!!document) Object.assign(this, document);
  }

  public get mime(): string {
    switch (this.extension) {
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls': return 'application/vnd.ms-excel';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'ppt': return 'application/vnd.ms-powerpoint';
      case 'pps': return 'application/vnd.ms-powerpoint';
      case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case 'ppsx': return 'application/vnd.openxmlformats-officedocument.presentationml.slideshow';
      case 'jpg': return 'image/jpeg';
      case 'bmp': return 'image/bmp';
      case 'png': return 'image/png';
      case 'txt': return 'text/*';
      default: return 'application/octet-stream';
    }
  }
}
