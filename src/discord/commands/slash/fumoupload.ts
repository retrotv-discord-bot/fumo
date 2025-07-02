import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../templates/slash-command";
import FumoService from "../../../services/fumo-service";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("fumoupload")
        .setNameLocalizations({
            ko: "후모업로드",
        })
        .setDescription("Show me a cute fumo photos!")
        .setDescriptionLocalizations({
            ko: "귀여운 후모 사진을 추가합니다!",
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
                .setRequired(true)
                .setAutocomplete(false),
        )
        .addStringOption((option) =>
            option
                .setName("url")
                .setNameLocalizations({
                    ko: "url",
                })
                .setDescription("The URL of the fumo photo. The file extension must be included.")
                .setDescriptionLocalizations({
                    ko: "후모 사진의 URL입니다. 파일의 확장자 명이 포함되어야 합니다.",
                })
                .setRequired(true)
                .setAutocomplete(false),
        )
        .addStringOption((option) =>
            option
                .setName("descript")
                .setNameLocalizations({
                    ko: "설명",
                })
                .setDescription("The description of the fumo photo.")
                .setDescriptionLocalizations({
                    ko: "후모 사진의 설명입니다.",
                })
                .setRequired(false)
                .setAutocomplete(false),
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.isCommand() || interaction.commandName !== "fumoupload") {
            return;
        }

        const fumoService = new FumoService();

        if (interaction.commandName === "fumoupload") {
            const title = interaction.options.getString("title", false);
            const url = interaction.options.getString("url", false);
            const descript = interaction.options.getString("descript", false);

            if (title === null || url === null) {
                await interaction.reply({ content: "후모 제목과 URL은 모두 필수 값 입니다!", ephemeral: true });
                return;
            }

            try {
                await fumoService.uploadFumo(title, url, descript);
                await interaction.reply({ content: "후모 사진 업로드에 성공했습니다!", ephemeral: true });
                return;
            } catch (e) {
                console.error(e);
                await interaction.reply({ content: "후모 사진 업로드 중 오류가 발생했습니다!", ephemeral: true });
                return;
            }
        }
    },
});
