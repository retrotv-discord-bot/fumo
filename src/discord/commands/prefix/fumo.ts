import { Message } from "discord.js";
import PrefixCommand from "../../../templates/prefix-command";

export default new PrefixCommand({
    name: "fumo",
    description: "Ping the bot to check if it's alive",
    aliases: ["후모", "푸모"],
    async execute(message: Message) {
        await message.reply("pong");
    },
});
