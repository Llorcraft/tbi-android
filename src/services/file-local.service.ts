import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { Document, Project } from '../models';
import { Picture } from '../models/picture';
import { LoadindService } from './loading.service';
import { ProjectJson } from '../models/project.json';

@Injectable()
export class FileLocalService extends FileService {
    constructor(public loading: LoadindService) {
        super(loading);
    }

    public working_folder: string = 'D:\\Sofware Factory\\tbi\\src\\assets\\';

    public create_pdf(base64: string, filename: string): Promise<string> {
        //filename = `${filename}-${(new Date()).toLocaleString().replace(/(\/| |:)/g, '')}`;
        this.loading.show();
        return new Promise<string>((resolve, reject) => {
            let blob = new Blob([this.base64_to_uint(base64)], { type: 'application/pdf' });
            let newWindow = window.open(`${filename}`, '_blank');
            newWindow.location.href = URL.createObjectURL(blob);
            this.loading.hide();
            resolve(filename);
        });
    }

    public create_picture(uri: string): Promise<Document> {
        throw new Error("Method not implemented.");
    }

    public get_documents(): Promise<Document[]> {
        throw new Error("Method not implemented.");
    }

    public delete(file: Document | Picture): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public select_file(): Promise<Document> {
        throw new Error("Method not implemented.");
    }

    public read_text(filename: string, hide?: boolean): Promise<string> {
        !hide && this.loading.show();
        return new Promise<string>((resolve, reject) => {
            !hide && this.loading.hide();
            resolve(localStorage.getItem(filename));
        });
    }

    public write_text(filename: string, content: string, hide?: boolean): Promise<boolean> {
        !hide && this.loading.show();
        return new Promise<boolean>((resolve, reject) => {
            localStorage.setItem(filename, content);
            !hide && this.loading.hide();
            resolve(true);
        });
    }

    public create_database(filename: string, projects: Project[]): Promise<Blob> {
        return new Promise<Blob>((resolve) => {
            resolve(new Blob([JSON.stringify(projects.map(p=>new ProjectJson(p)))], { type: 'text' }));
        });
    }
}