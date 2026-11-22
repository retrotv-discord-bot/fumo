import dotenv from "dotenv";

dotenv.config();

let { FILE_API_KEY, BOT_TOKEN, APPLICATION_ID, PUBLIC_KEY, GUILD_ID, PREFIX } = process.env;

if (!BOT_TOKEN || !APPLICATION_ID) {
    throw new Error("Missing environment variables");
}

GUILD_ID ??= "";
PREFIX ??= "!";

export const config = {
    FILE_API_KEY, // zipline 업로드를 위한 key
    BOT_TOKEN,
    APPLICATION_ID,
    PUBLIC_KEY,
    GUILD_ID,
    PREFIX,
};
