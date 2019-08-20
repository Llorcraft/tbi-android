import { Injectable, EventEmitter } from '@angular/core';
import { MessageService } from './messages.service';
import { File, FileEntry, Entry } from '@ionic-native/file'
import { FileService } from './file.service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Document, Project } from '../models';
import { FileTransfer } from '@ionic-native/file-transfer';
import * as JSZip from 'jszip';
import { Picture } from '../models/picture';
import { LoadindService } from './loading.service';
import { Platform } from 'ionic-angular';
import { ProjectJson } from '../models/project.json';

@Injectable()
export class FileDeviceService extends FileService {
    private download_emiter: EventEmitter<boolean> = new EventEmitter<boolean>();
    private total_files: string[] = [];

    constructor(private file: File,
        private message: MessageService,
        private chooser: FileChooser,
        private path: FilePath,
        private transfer: FileTransfer,
        private platform: Platform,
        public loading: LoadindService) {

        super(loading);
        this.working_folder = this.platform.is('ios') ? this.file.documentsDirectory : this.file.dataDirectory;
        this.download_folder = this.platform.is('ios') ? this.file.documentsDirectory : this.file.dataDirectory;
        //this.file.externalRootDirectory
        this.create_folder('files');
        this.create_folder('pictures');
        this.create_folder('temp');
    }

    public async get_documents(): Promise<Document[]> {
        return new Promise<Document[]>((resolve) => {
            this.files_in(`files`)
                .then(files =>
                    resolve(files.map(f => new Document({
                        file: f.name,
                        folder: f.fullPath.replace(f.name, '')
                    }))))
        });
    }

    public create_picture(uri: string): Promise<Document> {
        return new Promise<Document>((resolve) => {
            this.path.resolveNativePath(uri)
                .then(path => {
                    let file = path.substring(path.lastIndexOf('/') + 1, path.length);
                    this.transfer.create().download(uri, `${this.working_folder}pictures/${file}`)
                        .then(() => resolve(new Document({ file: file, folder: `${this.working_folder}pictures` })))
                        .catch((ex) => {
                            throw ex;
                        })
                });
        });
    }

    private copy_file(uri: string): Promise<Document> {
        return new Promise<Document>((resolve) => {

            this.path.resolveNativePath(uri)
                .then(path => {
                    //let folder = path.substring(0, path.lastIndexOf('/'));
                    let file = path.substring(path.lastIndexOf('/') + 1, path.length);

                    this.transfer.create().download(uri, `${this.working_folder}files/${file}`)
                        .then(() => resolve(new Document({ file: file, folder: `${this.working_folder}files` })))
                        .catch(ex => { throw ex; })
                        .catch(ex => { throw ex; });
                });
        });
    }

    private create_folder(type: string) {
        try {
            this.file.createDir(this.working_folder, type, false);
        } catch (ex) {
            throw ex;
        }
    }

    public select_file(): Promise<Document> {
        return new Promise<Document>((resolve) => {
            this.chooser.open()
                .then(uri => {
                    this.copy_file(uri).then(d => resolve(d));
                })
                .catch(e => this.message.alert('File', e.message));
        });
    }

    private create_file(filename: string): Promise<FileEntry> {
        return new Promise<FileEntry>((resolve, reject) => {
            this.file.writeFile(this.working_folder, `${filename}.json`, '', { append: true })
                .then(r => resolve(r))
                .catch(_ => {
                    this.file.writeFile(this.working_folder, `${filename}.json`, '', { replace: true })
                        .then(r => resolve(r))
                        .catch(ex => {
                            reject(ex.message);
                            throw ex;
                        })
                });
        });
    }

    private split_path(path: string): any {
        let _split = path.split('/');
        return {
            file: _split[_split.length - 1],
            folder: path.replace(_split[_split.length - 1], '')
        }
    }

    public delete(file: Document | Picture): Promise<boolean> {
        const _folder = file instanceof Document ? file.folder : this.split_path(file.picture).folder;
        const _file = file instanceof Document ? file.file : this.split_path(file.picture).file;

        return new Promise<boolean>((resolve, reject) => {
            this.file.removeFile(_folder, _file)
                .then(r => resolve(r.success))
                .catch(ex => {
                    reject(ex.message);
                    throw ex;
                })
        });
    }

    public async read_text(filename: string, hide?: boolean): Promise<string> {
        !hide && this.loading.show();
        await this.create_file(filename);
        return new Promise<string>((resolve, reject) => {
            this.file.readAsText(this.working_folder, `${filename}.json`)
                .then(r => {
                    !hide && this.loading.hide();
                    resolve(r);
                })
                .catch(ex => {
                    !hide && this.loading.hide();
                    reject(ex.message);
                    throw ex;
                });
        });
    }

    public async write_text(filename: string, content: string, hide?: boolean): Promise<boolean> {
        !hide && this.loading.show();
        await this.create_file(filename);
        return new Promise<boolean>((resolve, reject) => {
            this.file.writeFile(this.working_folder, `${filename}.json`, content, { replace: true })
                .then(() => {
                    !hide && this.loading.hide();
                    resolve(true);
                })
                .catch(ex => {
                    !hide && this.loading.hide();
                    reject(ex);
                    throw ex;
                });
        });
    }

    private zip_ready(zip: JSZip) {
        this.message.alert('Zip', 'Zip ready');
    }

    public async create_database(filename: string, projects: Project[]): Promise<string> {
        this.loading.show('Creating TBI file(s)...');
        return new Promise<string>(resolve => {
            let total = projects.length;
            projects.forEach(async project => {
                let url = await this.create_dabase_file(project);
                await this.moveToDownload(`${project.name}.tbi`, url);
                if (total-- == 1) {
                    this.loading.hide();
                    resolve(`TBI data files has been created in download folder.`);
                }
            })
            // return !this.platform.is('ios')
            //     ? this.moveToDownload(filename, url)
            //     : new Promise<string>(resolve => {
            //         resolve(`TBI data file ${filename} has been created in application folder.`)
            //     });
        })
    }

    private async moveToDownload(filename: string, url: string): Promise<string> {
        let fileTransfer = this.transfer.create();
        return new Promise<string>((resolve) => {
            fileTransfer.download(url, `${this.file.externalRootDirectory}/Download/${filename}`)
                .then(r => resolve(filename))
                .catch(err => {
                    this.message.alert('', 'TBI data file save error.')
                    throw err;
                })
        });
    }

    // private transform_picture_to_base64(project: ProjectJson): Promise<{ picture: string }[]> {
    //     let _pictures: { picture: string }[] = [project];
    //     project.components.forEach(c => c.reports.forEach(r => r.pictures.forEach(t => _pictures.push(t))));
    //     _pictures = _pictures.filter(p => !!p.picture);
    //     let total = _pictures.length;

    //     return new Promise<{ picture: string }[]>((resolve, reject) => {
    //         _pictures.forEach(async p => {
    //             this.file.readAsDataURL(`${this.working_folder}/pictures`, p.picture.split('/').reverse()[0]).then(pp => {
    //                 p.picture = pp;
    //                 if (total-- == 1) setTimeout(() => resolve(_pictures), 500);
    //             }).catch(ex => {
    //                 this.message.alert('', `Picture transform error ${p.picture}`)
    //                 reject();
    //             })
    //         })
    //     })
    // }

    private getAllPicturesOf(project: Project): { picture: string }[] {
        let _pictures: { picture: string }[] = [project];
        project.components.forEach(c => c.reports.forEach(r => r.pictures.forEach(t => _pictures.push(t))));
        return _pictures.filter(p => !!p.picture);

    }

    private create_dabase_file(project: Project): Promise<string> {
        return new Promise<string>(async resolve => {
            //this.transform_picture_to_base64(_project).then(pictures => {
            let _project = new ProjectJson(project);
            let zip = new JSZip();
            let content = JSON.stringify(_project);
            let pictures = this.getAllPicturesOf(project);
            let count = pictures.length;
            zip.file(`data.tbi`, `\uFEFF${content}`)
            pictures.forEach(async p => {
                let pn = p.picture.split('/').reverse()[0];
                this.file.readAsArrayBuffer(`${this.working_folder}/pictures`, pn).then(uint8array => {
                    zip.file(pn, uint8array)//.then(() => {
                    if (count-- == 1) {
                        
                        zip.generateAsync({ type: "blob" }).then(async buffer => {
                            await this.file.writeFile(this.working_folder, `${_project.name}.tbi`, buffer, { replace: true });
                            resolve(`${this.working_folder}/${_project.name}.tbi`);
                        })
                    };
                    // }, (err) => {
                    //     this.message.alert('', `Adding ${err.message}`)
                    // });
                }, (err) => {
                    this.message.alert('', `Read file ${err.message}`)
                });
            }, (err) => {
                this.message.alert('', `Error Add tbi`)
            })
            // this.file.writeFile(this.working_folder, `${_project.name}.tbi`, `\uFEFF${content}`, { replace: true })
            //     .then(() => {
            //         zip.file()
            //         //resolve(`${this.working_folder}/${_project}.tbi`);
            //         //let _pictures = this.getAllPicturesOf(project)
            //     })
            // .catch(_ => {
            //     this.file.writeFile(this.working_folder, `${_project}.tbi`, `\uFEFF${content}`, { replace: true })
            //         .then(() => {
            //             resolve(`${this.working_folder}/${_project}.tbi`)
            //         })
            //         .catch(ex => {
            //             this.message.alert('', `Error al crear el tbi file`)
            //             throw ex;
            //         })
            // });
            //});
        });
    }

    public create_database_zip(filename: string, projects: Project[]): Promise<Blob> {
        let zip = new JSZip();

        this.download_emiter.subscribe(filename => {
            //this.set_percent();
            this.total_files = this.total_files.filter(f => f != filename);
            if (!this.total_files.length) this.zip_ready(zip);
        });

        return new Promise<Blob>((resolve, reject) => {
            this.create_database_structure(filename).then(files => {
                let folders = {
                    data: zip.folder('data'),
                    files: zip.folder('files'),
                    pictures: zip.folder('pictures')
                };
                this.total_files = files.map(f => f.entry.name);
                files.forEach(f => {
                    this.add_to_zip((f.folder == 'data') ? zip : folders[f.folder], f);
                })
            });
        });
    }

    add_to_zip(folder: any, file: any): any {
        this.file.readAsArrayBuffer(`${this.working_folder}${file.folder}`, file.entry.name).then(buffer => {
            folder.file(file.entry.name, buffer);
            this.download_emiter.emit(file.entry.name);
        }).catch(ex => this.message.alert('Read', JSON.stringify(file.entry, null, 2)));
    }

    private async create_database_structure(filename: string) {
        return new Promise<any>((resolve) => {
            let result = []
            this.files_in('').then(data => {
                result = result.concat(data.filter(f => f.isFile && f.name == `${filename}.json`).map(f => ({ folder: 'data', entry: f })));
                this.files_in('files').then(files => {
                    result = result.concat(files.filter(f => f.isFile).map(f => ({ folder: 'files', entry: f })));
                    this.files_in('pictures').then(pictures => {
                        result = result.concat(pictures.filter(f => f.isFile).map(f => ({ folder: 'pictures', entry: f })));
                        resolve(result);
                    })
                });
            });
        });
    }

    public files_in(folder: string): Promise<Entry[]> {
        return new Promise<Entry[]>(resolve => {
            this.file.listDir(this.working_folder, folder)
                .then(e => resolve(e))
                .catch(ex => { throw ex; });
        });
    }

    public async create_pdf(base64: string, filename: string): Promise<string> {
        //filename = `${filename}-${(new Date()).toLocaleString().replace(/(\/| |:)/g, '')}`;
        return new Promise<string>((resolve, reject) => {
            this.file.writeFile(`${this.working_folder}`,
                `${filename}.pdf`,
                this.base64_to_uint(base64).buffer,
                { replace: true })
                .then(r => {
                    setTimeout(() => resolve(`${this.working_folder}/${filename}.pdf`), 0);
                })
                .catch(ex => {
                    this.message.alert('Error', ex.message);
                    reject(ex.message);
                    throw ex;
                });
        });
    }
}