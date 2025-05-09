import { AttachmentBuilder, AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../templates/slash-command";
import FumoService from "../../../service/fumo-service";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("fumo")
        .setNameLocalizations({
            ko: "후모",
        })
        .setDescription("Show me a cute fumo photos!")
        .setDescriptionLocalizations({
            ko: "귀여운 후모 사진을 보여줍니다!",
        })
        .addStringOption((option) => 
            option
                .setName("title")
                .setNameLocalizations({
                    ko: "제목",
                })
                .setDescription("Search fumo photos by title.")
                .setDescriptionLocalizations({
                    ko: "제목으로 후모 사진을 검색합니다.",
                })
                .setRequired(false)
                .setAutocomplete(true)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.isCommand() || interaction.commandName !== "fumo") {
            return;
        }

        const fumoService = new FumoService();

        if (interaction.commandName === "fumo") {
            if (interaction.options.getString("title", false)) {
                const title = interaction.options.getString("title", false);
                const fumo = title === null ? null : await fumoService.getFumoByTitle(title);

                if (fumo === null) {
                    await interaction.reply("후모가 없어요!");
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("#9b59b6")
                    .setTitle(fumo.TITLE)
                    .setDescription(fumo.DESCRIPTION);
        
                if (fumo.URL !== "") {
                    embed.setImage(fumo.URL);
                    await interaction.reply({
                        embeds: [embed]
                    });
        
                    return;
                }
        
                if (fumo.FILENAME !== "") {
                    const file = new AttachmentBuilder(fumo.FILENAME);
                    embed.setImage(`attachment://${fumo.FILENAME}`);
                    await interaction.reply({
                        embeds: [embed],
                        files: [file]
                    });
        
                    return;
                }
            }
        }
    },

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const fumoService = new FumoService();

        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name !== "title") {
            return;
        }

        if (focusedOption.value.length < 2) {
            await interaction.respond([]);
            return;
        }

        const choices = await fumoService.getFumoTitles(focusedOption.value);
        if (choices === null) {
            await interaction.respond([]);
            return;
        }

        const filtered = choices.filter((choice) =>
            choice.toLowerCase().includes(focusedOption.value.toLowerCase())
        );
        await interaction.respond(
            filtered.map((choice) => ({
                name: choice,
                value: choice,
            }))
        );
    },
});