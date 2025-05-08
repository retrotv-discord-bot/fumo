import { EmbedBuilder, Message, TextChannel } from "discord.js";
import PrefixCommand from "../../../templates/prefix-command";

export default new PrefixCommand({
    name: "fumo",
    description: "Ping the bot to check if it's alive",
    aliases: ["후모", "푸모"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor("#9b59b6")
            .setTitle("Fumo!")
            .setDescription("Fumo!");
            // .setImage("")

        const textChannel = message.channel as TextChannel;
        await textChannel.send({
            embeds: [embed]
        })
    },
});
