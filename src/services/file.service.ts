import { Document, Project } from "../models";
import { Picture } from "../models/picture";
import { LoadindService } from "./loading.service";

export abstract class FileService {

    constructor(public loading: LoadindService) { }

    public working_folder: string;

    public download_folder: string;
    
    public abstract read_text(filename: string, hide?: boolean): Promise<string>;

    public abstract write_text(filename: string, content: string, hide?: boolean): Promise<boolean>;

    public abstract create_database(filename: string, projects: Project[]): Promise<any>;

    public abstract select_file(): Promise<Document>;

    public abstract delete(file: Document | Picture): Promise<boolean>;

    public abstract create_picture(uri: string): Promise<Document>

    public abstract get_documents(): Promise<Document[]>

    public base64_to_uint(base64: string): Uint8Array {
        let arr = base64.split(','),
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return u8arr;
    }

    public abstract create_pdf(base64: string, filename: string): Promise<string>;

}