import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../templates/slash-command";

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

        if (interaction.commandName === "fumo") {
            if (interaction.options.getBoolean("title", false)) {
                await interaction.reply("Fumo!");
                return;
            }

            await interaction.reply("Fumo!");
            return;
        }
    },

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedOption = interaction.options.getFocused(true);
        const choices = ["Fumo", "Fumo2", "Fumo3"];
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