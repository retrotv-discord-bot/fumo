import dotenv from "dotenv";

dotenv.config();

let { BOT_TOKEN, BOT_ID, GUILD_ID, PREFIX, FILE_API_KEY, DATABASE_URL } = process.env;

if (!BOT_TOKEN || !BOT_ID || !DATABASE_URL) {
    throw new Error("Missing environment variables");
}

GUILD_ID ??= "";
PREFIX ??= "!";

export const config = {
    BOT_TOKEN,
    BOT_ID,
    GUILD_ID,
    PREFIX,
    FILE_API_KEY,
    DATABASE_URL,
};
