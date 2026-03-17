import { Client, Events } from "discord.js";

import Event from "../../../templates/event";
import { logger } from "../../../config/logger";

/**
 * 봇이 준비되었을 때 발생하는 이벤트
 * Event that occurs when the bot is ready
 */
export default new Event({
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (client.user) {
            logger.info(`Discord bot ${client.user.tag} is ready! 🤖`);
        } else {
            logger.warn("Discord bot is ready, but client.user is null.");
        }
    },
});
