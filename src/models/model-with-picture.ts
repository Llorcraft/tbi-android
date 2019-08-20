
export class ModelWithPicture {
    public id: string;
    public picture: string;
    constructor(item?: Partial<ModelWithPicture>){
        this.id = !!item ? item.id ||  Math.random().toString().substr(2) : Math.random().toString().substr(2);
        this.picture = !!item && !!item.picture ? item.picture : '';
    }


    // public get picture(): string {
    //     return localStorage.getItem(this.id) || NON_PICTURE
    // };
    // public set picture(value: string) {
    //     localStorage.setItem(this.id, value);
    // };
}