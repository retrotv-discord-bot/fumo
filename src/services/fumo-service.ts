import { Buffer } from "buffer";
import { FormData } from "formdata-node";
import { writeFile } from "fs/promises";
import fetch, { BodyInit } from "node-fetch";
import { fileFromPath } from "formdata-node/file-from-path";

import { config } from "../../config";
import prisma from "../config/datasource";
import FumoEntity from "../entities/fumo.entity";
import FumoRepository from "../repositories/fumo-repository";
import { PrismaClient } from "@prisma/client";

export default class FumoService {
    private readonly client: PrismaClient
    private readonly repository: FumoRepository;

    public constructor() {
        this.client = prisma;
        this.repository = new FumoRepository(prisma);
    }

    public async saveFumo(title: string, description: string, filename?: string, url?: string): Promise<void> {
        const newFumo = new FumoEntity(title, description, filename, url);
        try {
            await this.client.$transaction(async (tx) => {
                const txRepository = new FumoRepository(tx as PrismaClient);
                await txRepository.save(newFumo);
            })
        } catch (error) {
            console.error(`데이터베이스에 저장하는 도중 오류가 발생했습니다.\n${error}`);
            throw new Error("후모를 저장하는 도중 오류가 발생했습니다!");
        }
    }

    public async getFumoByTitle(title: string): Promise<FumoEntity | null> {
        const fumo = await this.repository.findFumoByTitle(title);
        console.log(`후모 검색 결과: ${fumo ? fumo.TITLE : "없음"}`);
        return fumo;
    }

    public async getFumoTitles(title: string): Promise<string[] | null> {
        const fumoTitles = await this.repository.findFumoTitles(title);
        console.log(`검색된 후모 제목 결과: ${fumoTitles ? fumoTitles.join(", ") : "없음"}`);
        return fumoTitles;
    }

    public async getRandomFumo(): Promise<FumoEntity | null> {
        return await this.repository.findRandomFumo();
    }

    public async uploadFumo(title: string, fileUrl: string, descript: string | null): Promise<void> {
        if (await this.repository.checkDuplicateFumo(title)) {
            throw new Error("해당하는 제목은 이미 존재합니다. 다른 제목을 사용해주세요.");
        }

        // 로컬에 저장 될 물리적인 파일명 지정
        const fileExtension = this.getFileExtension(fileUrl);
        const fileName = this.getCurrentTimeFormatted() + fileExtension;

        // 다운로드 경로 + 파일명
        const tempPath = `/home/docker/Downloads/${fileName}`;
        await this.fileDownload(fileUrl, tempPath);

        // 파일 서버에 이미지 업로드
        const uploadedUrl = await this.uploadFumoImageToFileServer(tempPath, `image/${fileExtension.replace(".", "")}`);

        descript = descript ?? "A cute fumo character.";
        await this.saveFumo(title, descript, "", uploadedUrl);
    }

    private async fileDownload(fileUrl: string, tempPath: string): Promise<void> {
        try {
            const imageResponse = await fetch(fileUrl);
            const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
            await writeFile(tempPath, imageBuffer);
        } catch (error) {
            console.error(`파일을 다운로드 하는 도중 오류가 발생했습니다.\n${error}`);
            throw new Error("파일을 다운로드 하는 도중 오류가 발생했습니다.");
        }
    }

    private getCurrentTimeFormatted() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

        return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    }

    private getFileExtension(fileUrl: string): string {
        const url = new URL(fileUrl);
        const filePath = url.pathname;

        // 마지막 점(.) 이후의 문자열을 찾아 확장자 추출
        const lastDotIndex = filePath.lastIndexOf(".");
        let fileExtension = "";

        if (lastDotIndex !== -1) {
            const extensionPart = filePath.substring(lastDotIndex);
            // 쿼리 문자열 제거
            fileExtension = extensionPart.split(/[?&]/)[0];
        }

        if (!fileExtension) {
            throw new Error("유효한 파일 확장자가 없습니다. 이미지 URL을 확인하십시오.");
        }

        return fileExtension;
    }

    private async uploadFumoImageToFileServer(filePath: string, type: string): Promise<string> {
        // 다운로드 받은 파일을 FormData로 지정
        const form = new FormData();
        form.append("file", await fileFromPath(filePath, { type }));

        // 파일 서버에 업로드
        const response = await fetch("https://file.retrotv.me/api/upload", {
            method: "POST",
            headers: {
                Authorization: config.FILE_API_KEY!,
            },
            body: form as unknown as BodyInit,
        });

        const json = (await response.json()) as any;

        let uploadedUrl: string;
        try {
            // 파일 서버에 저장된 URL
            uploadedUrl = json["files"][0]["url"];
        } catch (error) {
            console.error(`후모 이미지 정보를 저장하는 도중 오류가 발생했습니다.\n${error}`);
            throw new Error("후모 이미지 정보를 저장하는 도중 오류가 발생했습니다.");
        }

        return uploadedUrl;
    }
}
