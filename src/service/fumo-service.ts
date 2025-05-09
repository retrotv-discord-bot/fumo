import { PrismaClient } from "@prisma/client";
import prisma from "../config/datasource";

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
                }
            },
        });

        return fumo;
    }

    public async getFumoTitles(title: string): Promise<Fumo[] | null> {
        const fumos = await this.client.fumo.findMany({
            where: {
                TITLE: {
                    contains: title,
                }
            },
        });

        return fumos;
    }

    public async getRandomFumo(): Promise<Fumo | null> {
        const fumos = await this.client.fumo.findMany({
            orderBy: {
                ID: "asc",
            }
        });
        const randomIndex = Math.floor(Math.random() * fumos.length);
        const randomFumo = fumos[randomIndex];
        
        return randomFumo;
    }
}
