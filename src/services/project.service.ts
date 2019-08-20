import { Injectable } from '@angular/core';
import { Project } from '../models';
import { ProjectJson } from '../models/project.json';
import { FileService } from './file.service';
import { MessageService } from './messages.service';
import { LicencesService } from './licences.service';
import { LoadindService } from './loading.service';
import { Includes } from '../enums';

const STORAGE_KEY: string = 'tbi-app-v7';

@Injectable()
export class ProjectService {

  constructor(private file: FileService, private message: MessageService, private licences: LicencesService, public loading: LoadindService) { }

  public async get_all(hide?: boolean, includes?: number): Promise<Project[]> {
    return new Promise<Project[]>((resolve, reject) => {
      this.file.read_text(STORAGE_KEY, hide)
        .then(r => {
          this.licences.projects = (JSON.parse(r || '[]') as Project[]).map(p => new Project(p));
          resolve(this.licences.projects);
        })
        .catch(ex => {
          reject(ex);
          //throw new Error(ex);
        });
    })
  }

  public async save_all(projects: Project[], hide?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const content: string = JSON.stringify(projects.map(p => new ProjectJson(p)));
      this.file.write_text(STORAGE_KEY, content, hide)
        .then(_ => resolve(true))
        .catch(ex => {
          reject(ex);
          this.message.alert('Error', JSON.stringify(ex, null, 2));
        })
    })
  }

  public async get(id: string, hide?: boolean): Promise<Project> {
    return new Promise<Project>((resolve, reject) => {
      this.get_all(hide).then(p => {
        resolve(!!p.filter(p => p.id == id).length ? p.filter(p => p.id == id)[0] : null);
      }).catch(ex => {
        reject(ex);
        this.message.alert('Error', JSON.stringify(ex, null, 2));
      });
    });

  }

  public async save(project: Project, hide?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.get_all(hide).then(p => {
        let projects: Project[] = p.filter(p => p.id !== project.id)
        if (!project.id) project.id = Math.random().toString().substr(2);
        projects.push(project);
        this.save_all(projects, hide).then(_ => resolve(true))
          .catch(ex => {
            reject(ex);
            this.message.alert('Error', JSON.stringify(ex, null, 2));
          });
      }).catch(ex => {
        reject(ex);
        this.message.alert('Error', JSON.stringify(ex, null, 2));
      });

    });

  }

  public async delete(project: Project): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.get_all(true, Includes.NONE).then(r => {
        let projects: Project[] = r.filter(p => p.id !== project.id);
        this.save_all(projects).then(_ => resolve(true))
          .catch(ex => {
            reject(ex);
            this.message.alert('Error', JSON.stringify(ex, null, 2));
          });
      }).catch(ex => {
        reject(ex);
        this.message.alert('Error', JSON.stringify(ex, null, 2));
      })

    })
  }

  public async create_database(projects: Project[]): Promise<any> {
    let date = new Date();
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    return this.file.create_database(`${date.getFullYear()}${month.length == 2 ? month : `0${month}`}${day.length == 2 ? day : `0${day}`}.tbi`, projects);
  }
}
