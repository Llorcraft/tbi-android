import { Injectable } from '@angular/core';

@Injectable()
export class PictureLocalService{
    private select_picture(): Promise<string> {
        return new Promise<string>(resolve => {
            var input = document.createElement("input");
            input.setAttribute('type', 'file');
            input.onchange = (e => {
                var reader = new FileReader();
                reader.readAsDataURL((e.target as any).files[0]);
                reader.onload = () => {
                    resolve(reader.result as string);
                }
            })
            input.click();
        })
    }

    public take_picture(edit?: boolean, quality?: number): Promise<string> {
        return this.select_picture();
    }

    public get_picture(option: any): Promise<string> {
        return this.select_picture();
    }

}