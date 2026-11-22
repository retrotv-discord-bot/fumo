import { AttachmentBuilder, EmbedBuilder, Message, TextChannel } from "discord.js";
import PrefixCommand from "../../../templates/prefix-command";
import FumoService from "../../../services/fumo-service";

export default new PrefixCommand({
    name: "fumo",
    description: "Ping the bot to check if it's alive",
    aliases: ["후모", "푸모"],
    async execute(message: Message) {
        const textChannel = message.channel as TextChannel;

        const fumoService = new FumoService();
        const fumo = await fumoService.getRandomFumo();

        if (!fumo || (fumo?.URL === "" && fumo?.FILENAME === "")) {
            await textChannel.send("후모가 없어요!");
            return;
        }

        const embed = new EmbedBuilder().setColor("#9b59b6").setTitle(fumo.TITLE).setDescription(fumo.DESCRIPTION);

        if (fumo.URL !== "") {
            embed.setImage(fumo.URL);
            await textChannel.send({
                embeds: [embed],
            });

            return;
        }

        if (fumo.FILENAME !== "") {
            const file = new AttachmentBuilder(fumo.FILENAME);
            embed.setImage(`attachment://${fumo.FILENAME}`);
            await textChannel.send({
                embeds: [embed],
                files: [file],
            });
        }
    },
});
