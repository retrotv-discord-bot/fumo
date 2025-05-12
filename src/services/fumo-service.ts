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

    public async getFumoTitles(title: string): Promise<string[] | null> {
        const fumos = await this.client.fumo.findMany({
            where: {
                TITLE: {
                    contains: title,
                }
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
}
