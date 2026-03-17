import FumoEntity from "../entities/fumo.entity";
import type Fumo from "../entities/fumo";
import type { PrismaExtendedClient } from "../config/datasource";

export default class FumoRepository {
    private readonly client: PrismaExtendedClient;

    public constructor(client: PrismaExtendedClient) {
        this.client = client;
    }

    public async save(fumo: Fumo): Promise<void> {
        if (fumo.ID !== undefined && fumo.ID !== null) {
            await this.client.fumo.update({
                where: { ID: fumo.ID },
                data: {
                    TITLE: fumo.TITLE,
                    DESCRIPTION: fumo.DESCRIPTION,
                    FILENAME: fumo.FILENAME,
                    URL: fumo.URL,
                },
            });
        } else {
            await this.client.fumo.create({
                data: {
                    ID: undefined,
                    TITLE: fumo.TITLE,
                    DESCRIPTION: fumo.DESCRIPTION,
                    FILENAME: fumo.FILENAME,
                    URL: fumo.URL,
                },
            });
        }
    }

    public async findFumoByTitle(title: string): Promise<FumoEntity | null> {
        const fumo = await this.client.fumo.findFirst({
            where: {
                TITLE: {
                    contains: title,
                },
            },
        });

        return fumo;
    }

    public async findFumoTitles(title: string): Promise<string[] | null> {
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

    public async findRandomFumo(): Promise<FumoEntity | null> {
        const count = await this.client.fumo.count({});
        if (count === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * count);
        const fumo = await this.client.fumo.findFirst({
            skip: randomIndex,
        });

        return fumo;
    }

    public async checkDuplicateFumo(title: string): Promise<boolean> {
        const fumo = await this.client.fumo.findFirst({
            where: {
                TITLE: {
                    equals: title,
                },
            },
        });

        return fumo !== null;
    }
}
