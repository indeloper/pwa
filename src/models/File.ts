import FileCollection from "./collections/FileCollection";

export default class File {
    name: string = '';
    base64: string = '';
    type: string = '';
    size: number = 0;
}

(File as any).collection = FileCollection;