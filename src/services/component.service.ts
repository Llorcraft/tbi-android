import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { TbiComponent } from '../models/component';
import { Project } from '../models';

@Injectable()
export class ComponentService {

    constructor(private service: ProjectService) { }

    public save(component: TbiComponent): Promise<Project> {
        return new Promise<Project>((resolve) => {
            if (!!component.project.components.find(r => component.id == r.id)) this.remove(component);
            if (!component.id) component.id = Math.random().toString().substr(2);
            component.project.components.push(component);
            this.service.save(component.project).then(() => resolve(component.project));
        })
    }

    public remove(component: TbiComponent): Project {
        component.project.components = component.project.components.filter(r => r.id !== component.id);
        return component.project
    }

}
