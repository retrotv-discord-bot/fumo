import type Fumo from "./fumo";

export default class FumoEntity implements Fumo {
    ID?: number;
    TITLE: string;
    DESCRIPTION: string;
    FILENAME: string;
    URL: string;
    UPLOADER_ID: string;

    constructor(title: string, description: string, userId: string, filename?: string, url?: string, id?: number) {
        this.TITLE = title;
        this.DESCRIPTION = description;
        this.FILENAME = filename ?? "";
        this.URL = url ?? "";
        this.ID = id;
        this.UPLOADER_ID = userId;
    }
}
