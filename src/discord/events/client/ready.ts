import { Events } from "discord.js";
import Event from "../../../templates/event";

/**
 * 봇이 준비되었을 때 발생하는 이벤트
 * Event that occurs when the bot is ready
 */
export default new Event({
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Discord bot ${client.user.tag} is ready! 🤖`);
    },
});
