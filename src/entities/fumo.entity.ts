import type Fumo from "./fumo";

export default class FumoEntity implements Fumo {
    ID?: number;
    TITLE: string;
    DESCRIPTION: string;
    FILENAME: string;
    URL: string;

    constructor(title: string, description: string, filename?: string, url?: string, id?: number) {
        this.TITLE = title;
        this.DESCRIPTION = description;
        this.FILENAME = filename ?? "";
        this.URL = url ?? "";
        this.ID = id;
    }
}
