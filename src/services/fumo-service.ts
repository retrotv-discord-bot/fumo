import { PrismaClient } from "@prisma/client";
import prisma from "../config/datasource";
import FormData from "form-data";
import fs from "fs/promises";
import fetch from "node-fetch";
import ky from "ky";

import { config } from "../../config";

interface Fumo {
    ID: number;
    TITLE: string;
    DESCRIPTION: string;
    FILENAME: string;
    URL: string;
}

export default class FumoService {
    private readonly client: PrismaClient;

    public constructor() {
        this.client = prisma;
    }

    public async saveFumo(title?: string, description?: string, filename?: string, url?: string): Promise<void> {
        await this.client.fumo.create({
            data: {
                ID: undefined,
                TITLE: title,
                DESCRIPTION: description,
                FILENAME: filename,
                URL: url,
            },
        });
    }

    public async getFumoByTitle(title: string): Promise<Fumo | null> {
        const fumo = await this.client.fumo.findFirst({
            where: {
                TITLE: {
                    contains: title,
                },
            },
        });

        return fumo;
    }

    public async getFumoTitles(title: string): Promise<string[] | null> {
        const fumos = await this.client.fumo.findMany({
            where: {
                TITLE: {
                    contains: title,
                },
            },
        });

        if (fumos.length === 0) {
            return null;
        }

        const fumoTitles = fumos.map((fumo) => fumo.TITLE);
        const uniqueFumoTitles = Array.from(new Set(fumoTitles));

        return uniqueFumoTitles;
    }

    public async getRandomFumo(): Promise<Fumo | null> {
        const count = await this.client.fumo.count();
        if (count === 0) {
            return null;
        }

        const randomSkip = Math.floor(Math.random() * count);
        const randomFumo = await this.client.fumo.findFirst({
            skip: randomSkip,
        });

        return randomFumo;
    }

    public async uploadFumo(title: string, fileUrl: string, descript: string | null): Promise<void> {
        const tempPath = "./temp-image.png";
        this.fileDownload(fileUrl, tempPath);

        descript = descript ?? "";

        const form = new FormData();
        form.append("file", fs.readFile(tempPath));

        const response = await fetch("https://file.retrotv.me/api/upload", {
            method: "POST",
            headers: {
                Authorization: config.FILE_API_KEY!,
                "Content-Type": "multipart/form-data",
                ...form.getHeaders(),
            },
            body: form,
        });

        const json = (await response.json()) as any;

        try {
            const uploadedUrl = json["files"][0]["url"];
            await this.saveFumo(title, descript, "", uploadedUrl);
        } catch (error) {
            console.error("Error uploading fumo:", error);
            throw new Error("Failed to upload fumo. Please check the file URL and try again.");
        }
    }

    private async fileDownload(fileUrl: string, fileName: string): Promise<void> {
        const tempPath = fileName;
        const response = await ky.get(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        await fs.writeFile(tempPath, Buffer.from(arrayBuffer));
    }
}
